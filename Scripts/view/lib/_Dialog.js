


/*CLASS*/

function DialogHelper(el) {
    var d; // dom el
    if (BaseObject.is(el, "string")) {
        d = $(el).get(0);
    } else if (el != null) { // assume dom element
        d = el;
    } else {
        // Create one in the end of the World (oops doc)
        d = $('<div data-key="cardroot"></div>').append($("#jb_dialog_frame_container").children().clone()).hide();
        $('body').append(d);
    }
    ViewBase.call(this, d);
    this.initialize();
}

DialogHelper.Inherit(ViewBase, "DialogHelper");
DialogHelper.Implement(IStructuralQueryProcessor);
DialogHelper.Implement(IAjaxQueryRequestContent);
DialogHelper.Implement(IStructuralQueryRouter);
DialogHelper.Implement(IAjaxContextParameters);
DialogHelper.Implement(IViewHostQuery);
// Did it: Implement IAjaxContextParameters and decide what we should do when the dialog has no parent window.
DialogHelper.Implement(IUserData);
DialogHelper.prototype.directData = new InitializeBooleanParameter("If true the data is not requested from the server", false);
DialogHelper.prototype.changedevent = new InitializeEvent("Fired when the contained view changes its data. The view's data context is both emited through the event and exposed through the viewdata property. proto: handler(sender, datacontext);");
DialogHelper.prototype.closedevent = new InitializeEvent("Fired when the dialog closes. Should be used only for visual binding. proto: handler(sender, datacontext);");
DialogHelper.prototype.openedevent = new InitializeEvent("Fired when the dialog opens. Should be used only for visual binding. proto: handler(sender, datacontext);");
DialogHelper.prototype.currentView = null;
DialogHelper.prototype.dialogWidth = 400;
DialogHelper.prototype.dialogHeight = 400;
DialogHelper.prototype.$viewName = null;
DialogHelper.prototype.$closeDone = false;
DialogHelper.prototype.clearDialog = function() {
    var c = this.child("card_content");
    
    if (BaseObject.is(this.currentView, "BaseObject")) this.currentView.obliterate();
	if (c != null && c.length > 0) c.Empty();
    this.currentView = null;
    // this.set_data(null);
    this.$parent = null;
};
DialogHelper.prototype.getRequestContentFlags = function(settings) {
    var flags = STUFFRESULT.ALL;
    if (this.localTemplate) flags ^= STUFFRESULT.VIEWS;
    if (this.directData) flags ^= STUFFRESULT.DATA;
    // TODO: pass this to the cache management
    return flags;

};
DialogHelper.prototype.obliterate = function() {
    this.clearDialog();
    ViewBase.prototype.obliterate.call(this);
};
DialogHelper.prototype.$framesToShow = null;
DialogHelper.prototype.dialogOpening = function(e, ui) {
    //    this.$framesToShow = $("iframe:visible");
    //    if (this.$framesToShow != null && this.$framesToShow.length > 0) {
    //        this.$framesToShow.hide();
    //    } else {
    //        this.$framesToShow = null;
    //    }
    System.Default().hideIFrames();
    this.$closeDone = false;

    //    if (document.frames != null) {
    //        this.$framesToShow = [];
    //        for (var i = 0; i < document.frames.length; i++) {
    //            var f = document.frames[i];
    //            if (f != null && f.frameElement != null && f.frameElement.style != null && (f.frameElement.style.visibility != "hidden" || f.frameElement.style.visibility != "collapse")) {
    //                this.$framesToShow.push(f);
    //                f.frameElement.style.visibility = "hidden";
    //            }
    //        }
    //    }
};
DialogHelper.prototype.dialogClosing = function(e, ui) {
    if (!this.$closeDone) {
        if (this.$closeNotify() === false) return false;
    }
    //    if (this.$framesToShow != null) {
    //        this.$framesToShow.show();
    //    }
    //    this.$framesToShow = null;
    if (!System.Default().showIFrames(this)) {
        // Notify the app that a dialog is opened and leave to it to decide if some views need to be hidden
        var app = this.findService("PRootApp");
        if (app != null) app.OnPopUpDialogClosed();
    }

    //    if (this.$framesToShow != null) {
    //        for (var i = 0; i < this.$framesToShow.length; i++) {
    //            var f = this.$framesToShow[i];
    //            if (f != null && f.frameElement != null && f.frameElement.style != null) {
    //                f.frameElement.style.visibility = "visible";
    //            }
    //            this.$framesToShow[i] = null;
    //        }
    //    }
};
/* If more parameters need to be supplied, pass a single object as parameter - the following properties are supported:
    {
        url: (string, required) - the url of the data node on the server
        viewName: (string, required) - the name of the view template to use (Normal, Minimized, Maximized)
        height: (int, instance default if not specified) - the height of the dialog in pixels
        width: (int, instance default if not specified) - the width of the dialog in pixels
        modal: (bool, call default = true) - show as modal dialog
        resizable: (bool, call default = true) - enable resizing
        title: (string, call default = "Loading ...") - the title of the dialog to be shown until the view loads
        directData: (bool, instance default = false) - use the supplied data instead of loading data from the server
        data: Direct data - if not null the data is not requested from the server
        view: (string, optional, mutually exc. with viewName)
        parent: (ref, optional) parent element or window
    }
*/
DialogHelper.prototype.showModal = function(url, data, viewName, post, parent) {
    this.clearDialog();
    if (typeof url == "object" && url != null) {
        this.$viewName = url.viewName;
	   if (url.parent != null) this.$parent = url.parent;
        $(this.root).dialog({
            height: (url.dialogHeight != null) ? url.dialogHeight : this.dialogHeight,
            width: (url.dialogWidth != null) ? url.dialogWidth : this.dialogWidth,
            modal: (url.modal != null) ? url.modal : true,
            resizable: (url.resizable != null) ? url.resizable : true,
            zIndex: 11000,
            title: (url.title != null) ? url.title : "Loading ...",
            open: Delegate.createWrapper(this, this.dialogOpening),
            close: Delegate.createWrapper(this, this.dialogClosing),
		   beforeClose: Delegate.createWrapper(this, this.dialogClosing)
        }).dialog('open');
        if (url.parent != null) this.$parent = url.parent;
        if (url.directData != null) this.directData = url.directData;
        if (this.directData) {
            this.$viewdata = url.data;
        }
        this.$explicitView = url.view;
        $(this.root).find(".ui-dialog-content").css("overflow-y: visible");
        if (url.view != null && url.directData) {
            this.$showModal({ status: { issuccessful: true }, data: url.data });
        } else {
            if (IsNull(url.url)) {
                this.$showModal({ status: { issuccessful: true }, data: url.data });
            } else {
                System.showLoadingIndicator(this.child("card_content"), "horizontal");
                if (url.post) {
                    this.ajaxPostXml(url.url, url.data, this.$showModal);
                } else {
                    this.ajaxGetXml(url.url, url.data, this.$showModal);
                }
            }
        }
    } else {
        this.$viewName = viewName;
	   if (parent != null) this.$parent = parent;
        $(this.root).dialog({
            height: this.dialogHeight,
            width: this.dialogWidth,
            modal: true,
            resizable: true,
            zIndex: 11000,
            title: "Loading ...",
            open: Delegate.createWrapper(this, this.dialogOpening),
            beforeClose: Delegate.createWrapper(this, this.dialogClosing)
        }).dialog('open');
        if (parent != null) this.$parent = parent;
        $(this.root).find(".ui-dialog-content").css("overflow-y: visible");
        System.showLoadingIndicator(this.child("card_content"), "horizontal");
        if (post) {
            this.ajaxPostXml(url, data, this.$showModal);
        } else {
            this.ajaxGetXml(url, data, this.$showModal);
        }
    }
	$('.ui-widget-overlay').append("<iframe style=\"z-index:-1; position:absolute;width:100%;height:100%;border:none; top:1;\"></iframe>");
};
DialogHelper.prototype.$showModal = function(result) {
    var useView = null;
    var views = null;
    if (result.status.issuccessful) {
        if (!result.status.isreadonly) {
            views = result.views;
        } else {
            views = result.rviews;
        }
        if (this.$explicitView != null) {
            useView = this.$explicitView;
        } else if (this.$viewName != null) {
            useView = views[this.$viewName];
        } else {
            for (var v in views) {
                if (views[v] != null && views[v].length > 0) {
                    useView = views[v];
                    break;
                }
            }
        }
        if (useView != null) {
            // We can proceed
            var c = this.child("card_content");
            if (c != null && c.length > 0) {
                this.currentView = ViewBase.materializeIn(c, useView);
                if (this.currentView != null) {
					this.currentView.rebind();
                    CacheManager.Default.applyToInstance(result, this.currentView);
                    this.currentView.set_data((this.directData) ? this.get_viewdata() : result.data);
					if (result.metadata != null) this.currentView.metadata = result.metadata;
                    if (this.currentView.get_caption != null) {
                        $(this.root).dialog({
                            title: this.currentView.get_caption()
                        });
                        if (BaseObject.is(this.currentView.caption_changed, "EventDispatcher")) {
                            this.currentView.caption_changed.add(new Delegate(this, function() {
                                if (this.root != null) {
                                    $(this.root).dialog("option", "title", this.currentView.get_caption());
                                }
                            }));
                        }
                    }
                    this.$isopen = true;
                    this.$viewdata = (this.directData) ? this.get_viewdata() : result.data;
                    this.$correctDialogSize();
                    this.openedevent.invoke(this, this.$viewdata);
                    this.set_data(null);
                    $(this.root).dialog('option', 'position', 'center');
                }
            } else {
                CWorkspace.showError("DialogHelper", "", "The system dialog template is missing or corrupt.");
            }
        }
        //else {
        //    // We are too choosy and we cannot find a wife for our son ;P
        //    $(this.root).dialog('close');
        //    CWorkspace.showError("DialogHelper", "", "Cannot select/find suitable view for the dialog");
        //}
    } else {
        $(this.root).dialog('close');
    }
};
// IViewHostQuery implementation
DialogHelper.prototype.get_viewcontainerelement = function () {
    var c = $(this.root);
    var p = c.parent('[role="dialog"]');
    if (p.length > 0) return p.get(0);
    var c = this.child("card_content");
    if (c != null && c.length > 0) {
        return c.get(0);
    }
    return null;
};
DialogHelper.prototype.get_containerposition = function () {
    return null;
};
DialogHelper.prototype.$isopen = false;
DialogHelper.prototype.get_isopen = function() { return this.$isopen; };
DialogHelper.prototype.$viewdata = null;
// Hold direct data if necessary
DialogHelper.prototype.get_viewdata = function() { return this.$viewdata; };
DialogHelper.prototype.set_viewdata = function(d) {
    this.$viewdata = d;
    if (this.currentView != null) {
        this.currentView.set_data(d);
    }
};
DialogHelper.prototype.close = function() {
    return this.$closeNotify();
};
// The return value may be ignored
DialogHelper.prototype.$closeNotify = function(bIgnoreViewWishes) {
    if (this.currentView != null && !this.currentView.onClose() && !bIgnoreViewWishes) return false; // do nothing
    this.$closeDone = true;
    if (this.currentView != null && this.currentView.get_data != null) {
        this.$viewdata = this.currentView.get_data();
    } else {
        this.$viewdata = null;
    }
    $(this.root).dialog('close');
    this.$isopen = false;
    this.closedevent.invoke(this, this.$viewdata);
    return true;
};

// Ajax contextual parameters
DialogHelper.prototype.get_localajaxcontextparameter = function(param) {
    return null;
//    var md = this.get_metadata();
//    if (md != null) {
//        switch (param) {
//            case AjaxContextParameterFlags.RoleId:
//                if (md.roleid != null) return md.roleid;
//                break;
//            case AjaxContextParameterFlags.OnBehalfUserId:
//                if (md.onbehalfuserid != null) return md.onbehalfuserid;
//                break;
//        }
//    }
//    return null;
};
DialogHelper.prototype.get_ajaxcontextparameter = function(param) {
    var result = this.get_localajaxcontextparameter(param);
    if (result != null || this.isFinalAuthority(param)) return result;
    // Call the hierarchy
    if (this.$parent != null) {
        var query = new AjaxContextParameterQuery(param);
        //make sure the parent has the method throwStructuralQuery before you call it and get a run time error...
        if (typeof(this.$parent.throwStructuralQuery) != "undefined") {
            if (this.$parent.throwStructuralQuery(query)) {
                return query.result;
            }
        }
    }
    return null;
};
DialogHelper.prototype.set_localajaxcontextparameter = function(param, v) {
	if (this.$ajaxcontextparameter == null) this.$ajaxcontextparameter = {};
    this.$ajaxcontextparameter["" + param] = v;
};
DialogHelper.prototype.$isFinalAuthority = false;
DialogHelper.prototype.isFinalAuthority = function(param) { // Override this in Applet root classes to stop searching for parameters to the shell
    return this.$isFinalAuthority;
};
// The parent of the dialog must be able to process a hot query (at least) or additionally it can be a query router (e.g. view, window)
DialogHelper.prototype.get_structuralQueryRoutingType = function() { return "jquerydialogs"; };
DialogHelper.prototype.routeStructuralQuery = function(query, processInstructions) {
    var pinst = (processInstructions == null) ? { routingType: "jquerydialogs" } : processInstructions;
    var cur = this;
    while (cur != null) {
        if (BaseObject.is(cur, "IStructuralQueryRouter") && cur.get_structuralQueryRoutingType() != "jquerydialogs") {
            return cur.routeStructuralQuery(query, processInstructions);
        } else if (BaseObject.is(cur, "IStructuralQueryProcessor")) {
            if (cur.processStructuralQuery(query, processInstructions)) return true;
        }
        if (BaseObject.is(cur, "DialogHelper")) {
            cur = this.$parent;
        } else {
            cur = null;
        }
    }
    return false;
};
DialogHelper.prototype.processStructuralQuery = function(query, processInstructions) {
    if (!IsNull(query)) {
        if (BaseObject.is(query, "ChangeContainerStyleQuery")) {
            if (query.scrollable != null) {
                if (query.scrollable) {
                    this.child("card_content").css("overflow", "auto");
                } else {
                    this.child("card_content").css("overflow", "visible");
                }
            }
            if (query.scrollbottom) {
                this.child("card_content").scrollTop($(this.root).find('.j_card_content').children(":first").height());
            }
            return true;
        } else if (BaseObject.is(query, "UpdateCommandBars")) {
            var cmdBar = this.childObject("commandBar");
            if (cmdBar != null) {
                cmdBar.updateTargets();
            } else {
                jbTrace.log("The command bar repeater does not exist. Check the card container template");
            }
            return true;
        } else if (BaseObject.is(query, "RequestViewStateQuery")) {
            // not supported at this time
            return true;
        } else if (BaseObject.is(query, "CHideForWorkflow")) {
            return true;
        } else if (BaseObject.is(query, "HostCallQuery")) {
            if (query.command & HostCallCommandEnum.gethost) {
                query.host = this;
            }
            if (query.command & HostCallCommandEnum.datachanged) {
                this.$viewdata = null;
                if (this.currentView != null) this.$viewdata = this.currentView.get_data();
                query.clearCommandFlag(HostCallCommandEnum.datachanged);
                this.changedevent.invoke(this, this.$viewdata);
            }
            if (query.command & HostCallCommandEnum.close) {
                this.close();
                query.clearCommandFlag(HostCallCommandEnum.hide);
            }
            return true;
        } else if (BaseObject.is(query, "AjaxContextParameterQuery")) {
            if (this.is("IAjaxContextParameters")) {
                var result = this.get_localajaxcontextparameter(query.requestedParameter);
                if (result != null || this.isFinalAuthority(query.requestedParameter)) {
                    query.result = result;
                    return true;
                }
            }
        }
        // this.currentView.processStructuralQuery(query, processInstructions);
    }
    return false;
};
DialogHelper.prototype.$correctDialogSize = function() {
    var dialogContent = $(this.root).find('.j_dialog_content');
    var dialog = $(this.root).parent();
    var dialogPosition = $(this.root).position();

    var dialogHeight = dialog.outerHeight(true);
    var windowHeight = $(window).height() - dialogPosition.top;
    $(dialogContent).css('overflow-x', 'hidden');
    $(dialogContent).css('overflow-y', 'hidden');
    if (dialogHeight > windowHeight) {
        dialog.height(windowHeight);
        var uiDialogContent = $(this.root);
        $(uiDialogContent).css('height', '90%');
        $(uiDialogContent).css('overflow-y', 'auto');
    }
    var dialogWidth = $(this.root).width();
    var windowWidth = $(window).width() - dialogPosition.top;
    if (dialogWidth > windowWidth) {
        dialog.width(windowWidth);
        $(this.root).width(windowWidth);
        $(dialogContent).css('overflow-x', 'auto');
    }
};