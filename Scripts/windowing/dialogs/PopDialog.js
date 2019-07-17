function PopDialog(parentapp, conf) {
    BaseObject.apply(this, arguments);
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (BaseObject.is(arg, "BaseWindow") || BaseObject.is(arg, "IApp")) {
            this.set_application(arg);
        } else if (arg != null && typeof arg == "object") {
            this.$configuration = arg;
        }
    }
}

PopDialog.Inherit(BaseObject, "PopDialog");
PopDialog.Implement(IPlatformUtilityImpl, "popdlgdev");

PopDialog.ImplementProperty("application", new InitializeObject("Holds the application reference while open", null));

PopDialog.prototype.$configuration = null; // Holds the configuration
PopDialog.prototype.$dialog = null; // holds the dialog instance while open

PopDialog.prototype.get_hostwindow = function () {
    var app = this.get_application();
    if (BaseObject.is(app, "BaseWindow")) {
        return app;
    } else if (BaseObject.is(app, "IApp")) {
        return app.get_approotwindow();
    }

    return null;
}

PopDialog.prototype.get_dialogwindow = function () {
    return this.$dialog;
}

PopDialog.prototype.openDialog = function (workdata, placement) {
    var op = new ChunkedOperation();

    if (this.$dialog != null) {
        op.CompleteOperation(false, IOperation.errorname("singleinstance"));
        this.$dialog.activateWindow();
        return op;
    }

    this.$dialog = new SimpleViewWindow(
        this.$configuration.template,
        WindowStyleFlags.visible | WindowStyleFlags.draggable | WindowStyleFlags.topmost | WindowStyleFlags.adjustclient,
        this.$calcPopUpPosition(placement),
        this.get_hostwindow(),
        {
            url: this.$configuration.url,
            on_ReportResult: function (msg) {
                if (!op.isOperationComplete()) {
                    op.ReportOperationChunk(msg.data.result, msg.data.resultData);
                    if (msg.data.close) {
                        op.CompleteOperation(true, this);
                    }
                }
            },
            on_ViewLoaded: function (msg) {
                if (msg.target.currentView != null) {
                    if (BaseObject.is(msg.target.currentView, "IDialogView")) {
                        msg.target.currentView.InitWorkData(workdata);
                    } else {
                        throw "The dialog views must implement IDialogView";
                    }
                } else {
                    throw "Impossible thing happened!";
                }

            },
            on_FirstShown: function (msg) {
                msg.target.activateWindow();
            },
            on_Destroy: this.thisCall(function (msg) {
                this.$dialog = null;
            })
        });
    if (this.$configuration.isResponsive) {
        this.$dialog.attachBehavior(new ResponsiveWindowBehavior(this.$configuration.placement.size.w));
    }
    if (this.$configuration.resizableBehavior) {
        var height = 50;
        if (this.$configuration.resizableBehaviorHeight) {
            height = this.$configuration.resizableBehaviorHeight;
        }
        this.$dialog.attachBehavior(new HeightWindowBehavior(this.$configuration.placement.size.h, height));
    }
    return op;
}

PopDialog.prototype.closeDialog = function () {
    if (this.isOpened()) {
        this.$dialog.closeWindow();
    }
}

PopDialog.prototype.$calcPopUpPosition = function (placement) {
    var rect = null;
    placement = BaseObject.CombineObjects(this.$configuration.placement, placement || {});

    rect = this.$centered(placement)
        || this.$topleft(placement)
        || this.$topright(placement)
        || this.$bottomleft(placement)
        || this.$bottomright(placement)
        || this.$docked(placement);

    if (rect == null) {
        throw "Invalid PopUp position";
    }

    return rect;
}

PopDialog.prototype.isOpened = function () {
    return BaseObject.is(this.$dialog, "BaseWindow");
}

PopDialog.prototype.$centered = function (placement) {
    if (placement.position == PopUpsPositionEnum.center) {
        var rect = new Rect(0, 0, 0, 0);
        rect.set_size(placement.size);
        var centered = this.get_hostwindow().get_clientrect().center(rect);
        return centered;
    }

    return null;
}

PopDialog.prototype.$topleft = function (placement) {
    if (placement.position == PopUpsPositionEnum.topleft) {
        var rect = new Rect(0, 0, 0, 0);
        rect.set_size(placement.size);
        return rect;
    }

    return null;
}

PopDialog.prototype.$topright = function (placement) {
    if (placement.position == PopUpsPositionEnum.topright) {
        var rect = new Rect(0, 0, 0, 0);
        rect.set_size(placement.size);
        var rootRect = this.get_hostwindow().get_clientrect();
        rect.x = rootRect.w - rect.w;
        return rect;
    }

    return null;
}

PopDialog.prototype.$bottomleft = function (placement) {
    if (placement.position == PopUpsPositionEnum.bottomleft) {
        var rect = new Rect(0, 0, 0, 0);
        rect.set_size(placement.size);
        var rootRect = this.get_hostwindow().get_clientrect();
        rect.y = rootRect.h - rect.h;
        return rect;
    }

    return null;
}

PopDialog.prototype.$bottomright = function (placement) {
    if (placement.position == PopUpsPositionEnum.bottomright) {
        var rect = new Rect(0, 0, 0, 0);
        rect.set_size(placement.size);
        var rootRect = this.get_hostwindow().get_clientrect();
        rect.x = rootRect.w - rect.w;
        rect.y = rootRect.h - rect.h;
        return rect;
    }

    return null;
}

PopDialog.prototype.$docked = function (placement) {
    if (placement.position == PopUpsPositionEnum.docked) {
        if (placement.dokingElement == null) {
            throw "No dockingElement";
        }

        return this.calcRect(placement.dokingElement, placement.size);
    }

    return null;
}

PopDialog.prototype.calcRect = function (el, size) {
    var el_cont = this.get_hostwindow().get_clientcontainer();
    var el_rect = Rect.fromBoundingClientRectangle(el);
    el_rect.x = el_rect.y = 0;
    var anchorrect = el_rect.mapFromToElements(el, null);
    var cont_rect = Rect.fromBoundingClientRectangle(el_cont);
    var sz = new Rect(0, 0, 300, 350);
    if (size) sz.set_size(size);
    var r = cont_rect.adjustPopUp(anchorrect, sz, "aboveunder", 0, 0);
    return r.mapFromToElements(null, el_cont);
}