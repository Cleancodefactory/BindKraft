(function(){
    var IShellCustomizerPlacer = Interface("IShellCustomizerPlacer"),
        GRect = Class("GRect");

    function MobileFirstCustomizer() {
        BaseObject.apply(this, arguments);
    }
    MobileFirstCustomizer.Inherit(BaseObject, "MobileFirstCustomizer")
        .Implement(IShellCustomizerPlacer)
        .ImplementProperty("shell")
        .ImplementProperty("workspacewindow");
        
    MobileFirstCustomizer.prototype.$lastPos = 0;
    MobileFirstCustomizer.prototype.placeWindow = function(wnd, options) { 
        var ww = Shell.get_workspacewindow();
        var slot = ww.get_clientcontainer("right");
        var rect = GRect.fromDOMElementClient(slot);
        rect.y += this.$lastPos;
        this.$lastPos += 30;
        rect = new Rect(rect.l, rect.y,rect.w,rect.h);
        if (options != null) {
            this.$shell.workspaceWindow.addChild(wnd);
        } else {
            this.$shell.workspaceWindow.addChild(wnd, "right");
            wnd.set_windowrect(rect);
        }
    }
    MobileFirstCustomizer.prototype.displaceWindow = function(wnd) { 
        this.$shell.workspaceWindow.removeChild(w);
    }

})();