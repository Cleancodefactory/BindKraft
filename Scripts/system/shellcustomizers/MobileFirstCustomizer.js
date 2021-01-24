(function(){
    function MobileFirstCustomizer() {
        BaseObject.apply(this, arguments);
    }
    MobileFirstCustomizer.Inherit(BaseObject, "MobileFirstCustomizer")
        .Implement(IShellCustomizerPlacer)
        .ImplementProperty("shell")
        .ImplementProperty("workspacewindow");
        

    MobileFirstCustomizer.prototype.placeWindow = function(wnd, options) { 
        if (options != null && options.role == "shell") {
            if (typeof options.position == "string") {
                this.$shell.workspaceWindow.addChild(w,options.position);
            }
        } else {
            this.$shell.workspaceWindow.addChild(w);
        }
    }
    MobileFirstCustomizer.prototype.displaceWindow = function(wnd) { 
        this.$shell.workspaceWindow.removeChild(w);
    }

})();