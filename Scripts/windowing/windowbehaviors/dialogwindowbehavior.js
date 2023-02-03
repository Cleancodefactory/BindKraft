(function() {

    var IDialogShow = Interface("IDialogShow");

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

    DialogWindowBehavior.prototype.get_hostwindow = function() { return this.$window; }

    DialogWindowBehavior.prototype.$windowtemplate = null;
    /**
     * Gets/sets the window template to use for the dialog's window.
     * @param {String|Connector|null} v The template. If string is specified, it is wrapped in StringConnector.
     */
    DialogWindowBehavior.prototype.get_windowtemplate = function() { return this.$windowtemplate; }
    DialogWindowBehavior.prototype.set_windowtemplate = function(v) { 
        if (typeof v == "string" || v == null || BaseObject.is(v, "Connector")) {
            if (typeof v == "string") {
                this.$windowtemplate = new StringConnector(v);
            } else {
                this.$windowtemplate = v
            }
        } else {
            throw "Window templates can be strings, connectors or null";
        } 
    }
    DialogWindowBehavior.prototype.$findWindow = function(id) {
        var iid = null;
        if (typeof id == "string") { iid = id; }
        if (iid == null && BaseObject.is(id, "BaseObject")) {
            iid = id.$__instanceId;
        }
        if (Array.isArray(this.$dialogs)) {
            return this.$dialogs.FirstOrDefault(function(idx, entry) {
                if (entry.instanceid == iid) return entry.dialog;
                return null;
            });
        }
        return null;
    }
    DialogWindowBehavior.prototype.$regWindow = function(op,wnd) {
        var iid = BaseObject.is(op,"Operation")?op.$__instanceId:(typeof op == "string"?op:null);
        if (iid == null && BaseObject.is(wnd, "BaseWindow")) {
            iid = wnd.$__instanceId;
        }
        if (iid == null) return;
        var reg = { 
            instanceid: iid,
            dialog: wnd
        };
        this.$dialogs.push(reg);
    }
    DialogWindowBehavior.prototype.$unregWindow = function(id) {
        var iid = null;
        if (typeof id == "string") { iid = id; }
        if (iid == null && BaseObject.is(id, "BaseObject")) {
            iid = id.$__instanceId;
        }
        for (var i = 0; i < this.$dialogs.length; i++) {
            var dialog = this.$dialogs[i];
            if (dialog.instanceid == iid) {
                this.$dialog.splice(i, 1);
                return;
            }
        }
    }
    DialogWindowBehavior.prototype.$dialogs = new InitializeArray("All current dialog windows");
    DialogWindowBehavior.prototype.$calcPosition = function() {
        return null;
    }
    DialogWindowBehavior.prototype.openDialog = function (workdata, _view, placement) {
        var op = new ChunkedOperation();
        var wparams = [];
        var wdata = {};
        var me = this;
        

        if (typeof _view == "string") { // Empty templates are no actual use, but we permit them for now
            wdata.view = _view;
        } else if (BaseObject.is(_view, "BKUrl")) {
            wdata.url = _view.toString();
        }
        
        wdata.directData = workdata;
            
        wdata.on_ReportResult = function(msg) {
            if (!op.isOperationComplete()) {
                var data = msg.data;
                if (data != null) { // some data is required
                    if (data.close) { // End request
                        if (data.result) { 
                            op.CompleteOperation(true, data.resultData);
                        } else { 
                            op.CompleteOperation(false, null); // No message indicates close/cancel
                        }
                    } else {
                        op.ReportOperationChunk(data.result, data.resultData);
                    }
                }
                op.ReportOperationChunk(msg.data.result, msg.data.resultData);
                if (msg.data.close) {
                    op.CompleteOperation(true, this);
                }
            }
        }
        wdata.on_ViewLoaded = function (msg) {
            if (msg.target.currentView != null) {
                if (BaseObject.is(msg.target.currentView, "IDialogView")) {
                    msg.target.currentView.InitWorkData(workdata);
                } else {
                    op.CompleteOperation(false, "The dialog views must implement IDialogView");
                }
            } else {
                op.CompleteOperation(false, "The dialog views was not materialized successfully");
            }
        }
        wdata.on_FirstShown = function (msg) {
            msg.target.activateWindow(); // May be not the best place to do this?
        }
        wdata.on_Destroy = function (msg) {
            me.$unregWindow(op);
            if (!op.isOperationComplete()) {
                op.CompleteOperation(false, "Dialog destroyed for unknown reason");
            }
        }

    
        var dialog = new SimpleViewWindow(
            this.get_windowtemplate(),
            WindowStyleFlags.visible | WindowStyleFlags.draggable | WindowStyleFlags.topmost | WindowStyleFlags.adjustclient,
            this.$calcPosition(placement),
            this.get_hostwindow(), // Parent
            wdata
        );
        this.$regWindow(op, dialog);
        if (placement & PopUpsPositionEnum.auto) {
            // TODO At lest provide as configuration or use better behaviors
            dialog.attachBehavior(new ResponsiveWindowBehavior(500));
            dialog.attachBehavior(new HeightWindowBehavior(500));
        }

        return op;
    }

    DialogWindowBehavior.prototype.closeDialog = function(op) {
        if (op == null) return;
        var w = this.$findWindow(op);
        if (w != null) {
            // Close the operation though the window
            WindowingMessage.fireOn(w, WindowEventEnum.ReportResult, {
                result: false,
                resultData: null,
                close: true
            });
            // Close the dialog
            w.closeWindow();
        }
    }
    DialogWindowBehavior.prototype.closeAllDialogs = function() {
        for (var i = 0; this.$dialogs.length; i++) {
            var e = this.$dialogs[i];
            if (BaseObject.is(e.dialog, "BaseWindow" )) {
                WindowingMessage.fireOn(e.dialog, WindowEventEnum.ReportResult, {
                    result: false,
                    resultData: null,
                    close: true
                }); 
                e.dialog.closeWindow();
            }
        }
        this.$dialogs.splice(0);
    }
    DialogWindowBehavior.prototype.isOpen = function(op) { // TODO Chek if the logic is ok - dialogs are not kept alive - they are created on open and destroyed on close.
        var w = this.$findWindow(op);
        if (w != null) return true;
    }
    //#endregion IDialogShow
})();