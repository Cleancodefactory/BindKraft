
(function() {
    function WorkspaceWindowBase() {
        BaseWindow.apply(this, root);
    }
    WorkspaceWindowBase.Inherit(BaseWindow, "WorkspaceWindowBase");

    WorkspaceWindowBase.prototype.$defaultWindowStyles = WindowStyleFlags.fillparent | WindowStyleFlags.visible | WindowStyleFlags.adjustclient;

})();