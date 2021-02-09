
(function() {
    function WorkspaceWindowBase() {
        BaseWindow.apply(this, root);
    }
    WorkspaceWindowBase.Inherit(BaseWindow, "WorkspaceWindowBase");

    WorkspaceWindowBase.prototype.$defaultWindowStyles = WindowStyleFlags.fillparent | WindowStyleFlags.visible | WindowStyleFlags.adjustclient;

    WorkspaceWindowBase.prototype.$activateWindowFromDOMEvent = function (e) {
        //e.stopPropagation();
    };
    WorkspaceWindowBase.prototype.on_ActivateWindow = function (msg) {
        //e.stopPropagation();
        this.updateTargets();
        msg.handled = true;
    };
    WorkspaceWindow.prototype.on_Create = function () {
        this.springTrigger = new SpringTrigger(new Delegate(this, this.onBrowserResize), 100);
        $(window).resize(Delegate.createWrapper(this, this.windUp));
    
    };
})();