/**
 * Adding resize height behaviour of the window 
 */
function HeightWindowBehavior(height, resizeVal) {
     WindowBehaviorBase.apply(this, arguments);
     this.height = height;
     this.resizeVal = resizeVal;
}

HeightWindowBehavior.Inherit(WindowBehaviorBase, "HeightWindowBehavior");

// use like this:
//x = this.$window.attachedBehavior(HeightWindowBehavior.$getresponsivewindowbehavior); //will return null if not found
HeightWindowBehavior.$getresponsivewindowbehavior = function(beh) {
    if (BaseObject.is(beh, "ResponsiveWindowBehavior")) return true;
    return false;
}

HeightWindowBehavior.prototype.on_SizeChanged = function (msg) {
    this.$setWindowHeight(this.$window);
}.Description("");

HeightWindowBehavior.prototype.on_ViewLoaded = function (msg) {
    this.$setWindowHeight(this.$window);
}.Description("");

//This is special for TabsetWindow
HeightWindowBehavior.prototype.on_ChildAdded = function(){
    this.$setWindowHeight(this.$window);
}.Description("");


/**
 * If parent window is smaller set right height of window
 * @param {*} window - window to set size
 */
HeightWindowBehavior.prototype.$setWindowHeight = function(wnd){
    var GRect = Class("GRect");
    if(wnd.get_windowparent() != null){
        var windowRect = new GRect(wnd.get_windowrect());
        var parentWindowRect = new GRect(wnd.get_windowparent().get_clientrect());

        if(windowRect.h > parentWindowRect.h && !Math.bitsTest(wnd.getWindowStyles(), WindowStyleFlags.fillparent))
        {
            wnd.set_windowrect(parentWindowRect.center(new Rect(windowRect.x,windowRect.y, windowRect.w, parentWindowRect.h - this.resizeVal)));
        }
        if(!Math.bitsTest(wnd.getWindowStyles(), WindowStyleFlags.fillparent) && parentWindowRect.h > this.height + this.resizeVal && windowRect.h < this.height){
            if (BaseObject.is(wnd.createParameters.sizelimits, "SizeLimits")){
                wnd.set_windowrect(parentWindowRect.center(new Rect(windowRect.x,windowRect.y, windowRect.w,wnd.createParameters.sizelimits.h)));
            }
        }
    }
}.Description("If parent window is smaller set right height of window");