(function(){
    var WorkspaceWindow = Class("WorkspaceWindow");

    function BKinit_WorkspaceWindow() {
        BaseObject.apply(this, arguments);
    }
    BKinit_WorkspaceWindow.Inherit(BaseObject, "BKinit_WorkspaceWindow");

    /**
     * @param {integer} flgs - All the flags the window will have set
     */
    BKinit_WorkspaceWindow.prototype.setFlags = function(flgs) {
        WorkspaceWindow.prototype.$defaultWindowStyles = flgs;
    }
    /**
     * Configures the template the WorkspaceWindow will use when created by the boot script
     * @param {string} tmlName The template to use in the module/template notation
     */
    BKinit_WorkspaceWindow.prototype.useTemplate = function(tmlName) {
        if (typeof tmlName == "string" && tmlName.length > 0) {
            WorkspaceWindow.useTemplateConnector = new TemplateConnector(tmlName);
        } else if (tmlName == null) {
            WorkspaceWindow.useTemplateConnector = null;
        }
    }
})();