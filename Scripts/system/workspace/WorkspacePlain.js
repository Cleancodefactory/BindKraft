(function () {

    /*
        Parameters:
            windowClass     string      The class name of the workspace window
            windowTemplate  Connector   Template
            windowFlags     number
    */


    var WorkspaceBase = Class("WorkspaceBase");

    /**
     * Plain workspace manager. The workspace has only one client area in a single root window.
     */
    function WorkspacePlain() {
        WorkspaceBase.apply(this, arguments);
    }
    WorkspacePlain.Inherit(WorkspaceBase, "WorkspaceBase");
        

    WorkspacePlain.prototype.$rootwindow = null;

    WorkspacePlain.prototype.initialize = function(domroot, parameters) {
        var op = new Operation(null, 10000);
        WorkspaceBase.prototype.initialize.apply(this, arguments);
        var wcls = Class(this.getParameter() || "WorkspaceWindowBase");
        this.LASTERROR("Cannot determine the class of the workspace window", "initialize");
        if (wvls == null) throw "Cannot determine the class of the workspace window";
        var template = this.getParameter("windowTemplate");
        var flags = this.getParameter("windowFlags");
        this.$rootwindow = new wcls(function(w) {
                w.attachInDOM(domroot);
                w.fireInitialResize();
                op.CompleteOperation(true, null);
            },
            ((typeof flags == "number")?flags:null),
            (BaseObject.is(template, "Connector")?template:null),

        );
        return op;
    }
})();