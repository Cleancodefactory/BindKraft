
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
    WorkspaceWindowBase.prototype.on_Create = function () {
        if (window.addEventListener) {
            window.addEventListener("resize",Delegate.createWrapper(this.BrowserResize, this.BrowserResize,windup));
        } else if (window.attachEvent) {
            window.attachEvent("resize",Delegate.createWrapper(this.BrowserResize, this.BrowserResize,windup));
        }
    };

    WorkspaceWindow.prototype.BrowserResize = new InitializeMethodTrigger("triggers resize event", function() {
        WindowingMessage.fireOn(this, WindowEventEnum.SizeChanged, {});
    }, 200);
    
})();