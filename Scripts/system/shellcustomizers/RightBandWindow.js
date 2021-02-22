(function() {
    var GRect = Class("GRect");

    function RightBandWindow() {
        BaseWindow.apply(this,arguments);
        this.remSize = window.getComputedStyle(document.documentElement).fontSize;
    }
    RightBandWindow.Inherit(BaseWindow, "RightBandWindow");

    RightBandWindow.prototype.arrangeChildren = function() {
        this.callAsync(function() {
            var rect = new GRect(this.get_clientrect());
            rect.h = 40 * parseInt(this.remSize, 10);
            rect.x = 0;
            rect.y = 0;
            for (var i = this.children.length - 1; i >= 0; i--) {
                var w = this.children[i];
                if (w.isWindowVisible()) {
                    w.set_windowrect(rect);
                    rect.y += rect.h + 5;
                }
            }
        });
    }
    RightBandWindow.prototype.handleWindowEvent = function(msg, currentResult) {
        var result = this.handleWindowEventDefault(msg, currentResult);
        switch (msg.type) {
            case WindowEventEnum.SetStyles:
                // For later
            break;
            case WindowEventEnum.SizeChanged:
                this.arrangeChildren();
            break;
            case WindowEventEnum.Show:
                if (msg.data.visible) {
                    this.arrangeChildren();
                }
            break;
            case WindowEventEnum.ChildAdded:
            case WindowEventEnum.ChildRemoved:
                this.arrangeChildren();
            break;
        }
        return result;
    }
})();