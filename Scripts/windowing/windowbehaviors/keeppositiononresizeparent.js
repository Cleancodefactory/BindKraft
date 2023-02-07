(function() {
    var GRect = Class("GRect"),
        GPoint = Class("GPoint");

    function KeepPositionInParentBehavior(criticalWidth, criticalHeight) {
        WindowBehaviorBase.call(this, true); // no multiuse
        this.criticalHeight = criticalHeight;
        this.criticalWidth = criticalWidth;
    }
    KeepPositionInParentBehavior.Inherit(WindowBehaviorBase,"KeepPositionInParentBehavior")
        .ImplementProperty("criticalwidth", new InitializeNumericParameter("Critical width under which the window is maximized", 500), "criticalWidth")
        .ImplementProperty("criticalheight", new InitializeNumericParameter("Critical height under which the window is maximized", 500), "criticalHeight");


    //#region Messages
   
    KeepPositionInParentBehavior.prototype.on_SizeChanged = function (msg) {
        this.$calcNewPos();
    }.Description("");

    KeepPositionInParentBehavior.prototype.on_PosChanged = function (msg) {
        this.$calcNewPos();
    }.Description("");
    
    KeepPositionInParentBehavior.prototype.on_ViewLoaded = function (msg) {
        this.$calcNewPos();
    }.Description("");
    
   
    //#endregion

    KeepPositionInParentBehavior.prototype.$calcNewPos = function(bdontswitch) {
        var wrect = new GRect(this.$window.get_windowrect());
        var wparent = this.$window.get_windowparent();
        var prect = new GRect(wparent.get_clientrect());
        if (wparent == null) return null; // do nothing
        if (!Math.bitsTest(this.$window.getWindowStyles(), WindowStyleFlags.fillparent)) { // Move around
            if (!GRect.nullOrEmpty(wrect) && !GRect.nullOrEmpty(prect)) { 
                var valid_wrect = prect.mapToInsides(wrect);
                if (GRect.nullOrEmpty(valid_wrect)) {
                    if (bdontswitch) return;
                    // The only way to deal with this is to maximize
                    this.$window.setWindowStyles(WindowStyleFlags.fillparent,"set");
                    return;
                }
                var anchor = new GPoint(0,0);
                anchor = anchor.mapFromTo(wrect, valid_wrect);
                anchor = valid_wrect.mapToInsides(anchor);
                if (anchor == null) {
                    if (bdontswitch) return;
                    // Fill parent
                    this.$window.setWindowStyles(WindowStyleFlags.fillparent,"set");
                    return;
                }
                wrect.set_left(anchor.x);
                wrect.set_top(anchor.y);
                this.$window.set_windowrect(wrect);
            }

        } else { // Track for critical
            var oldpos = this.$window.get_rememberedwindowrect();
            if (oldpos != null) {
                if (wrect.w > oldpos.w + 10 && wrect.h > oldpos.h + 10) {
                    // There should be enough room for normalizing
                    this.$window.setWindowStyles(WindowStyleFlags.fillparent,"reset");
                    this.$calcNewPos(true); 
                }
            }
            
        }
    }

})();