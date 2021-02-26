(function(){
    var RightBandWindow = Class("RightBandWindow");


    var IShellCustomizerPlacer = Interface("IShellCustomizerPlacer"),
        GRect = Class("GRect");

    function MobileFirstCustomizer() {
        BaseObject.apply(this, arguments);
    }
    MobileFirstCustomizer.Inherit(BaseObject, "MobileFirstCustomizer")
        .Implement(IShellCustomizerPlacer)
        .ImplementProperty("shell")
        .ImplementProperty("workspacewindow");
    MobileFirstCustomizer.prototype.initialize = function() {
        var op = new Operation(null, 5000);
        var w = this.get_workspacewindow();
        this.band = new RightBandWindow(
            WindowStyleFlags.fillparent | WindowStyleFlags.visible | WindowStyleFlags.adjustclient | WindowStyleFlags.parentnotify,
            new StringConnector('<div data-key="_window" style="background-color: orange; overflow-y: auto;"></div>'),
            {
                on_Create: function(msg) {
                    op.CompleteOperation(true, msg.target);
                }
            }
        );
        w.addChild(this.band, "right");
        return op;
    }
    MobileFirstCustomizer.prototype.$lastPos = 0;
    MobileFirstCustomizer.prototype.placeWindow = function(wnd, options) { 
        var ww = Shell.get_workspacewindow();
        // var slot = ww.get_clientcontainer("right");
        // var rect = GRect.fromDOMElementClient(slot);
        // rect.y += this.$lastPos;
        // this.$lastPos += 30;
        // rect = new Rect(rect.l, rect.y,rect.w,rect.h);
        if (options != null) {
            this.$shell.workspaceWindow.addChild(wnd);
        } else {
            this.band.addChild(wnd);
            // this.$shell.workspaceWindow.addChild(wnd, "right");
            //wnd.set_windowrect(rect);
        }
    }
    MobileFirstCustomizer.prototype.displaceWindow = function(wnd) { 
        this.band.removeChild(w);
        this.$shell.workspaceWindow.removeChild(w);
    }

})();