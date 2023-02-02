(function() {

    function DialogWindowBehavior() {
        WindowBehaviorBase.call(this, true); // No multiuse - one dialog opener should be enough by anchor window
    }
    DialogWindowBehavior.Inherit(WindowBehaviorBase, "DialogWindowBehavior")
        .Implement(IServiceLocator)
        .Implement(IDialogShow);

    //#region IServiceLocator
    DialogWindowBehavior.prototype.locateService = function(_type, reason) {
        var type = Class.getTypeName(_type);
        if (type == "IDialogShow") {
            return this;
        }
        return null;
    }

    //#endregion IServiceLocator

    //#region  IDialogShow

    DialogWindowBehavior.prototype.get_hostwindow = function() { throw "not impl."; }

    DialogWindowBehavior.prototype.$windowtemplate = null;
    DialogWindowBehavior.prototype.get_windowtemplate = function() { throw "not impl."; }
    DialogWindowBehavior.prototype.set_windowtemplate = function(v) { throw "not impl."; }

    DialogWindowBehavior.prototype.openDialog = function (workdata, view, placement) {
        var op = new ChunkedOperation();
        var view = null;
        var directData = null;
        if (typeof this.$configuration.view == "string") { // Empty templates are no actual use, but we permit them for now
            view = this.$configuration.view;
        }
        if (this.$configuration.directData != null) {
            directData = this.$configuration.directData;
        }
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
                view: view,
                directData: directData,
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
    //#endregion IDialogShow
})();