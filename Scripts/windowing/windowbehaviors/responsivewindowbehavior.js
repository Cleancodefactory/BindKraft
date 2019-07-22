/**
 * Adding responsive behaviour of the window 
 * @param {*} width needed size of window
 */
function ResponsiveWindowBehavior(width, toggleStyleFlagsMask) {
     WindowBehaviorBase.apply(this, arguments);
     this.width = width;
     this.$toggleStyleFlagsMask = toggleStyleFlagsMask || (WindowStyleFlags.draggable | WindowStyleFlags.sizable);
}
ResponsiveWindowBehavior.Inherit(WindowBehaviorBase, "ResponsiveWindowBehavior");

ResponsiveWindowBehavior.prototype.$toggleStyleFlagsMask = 0;
ResponsiveWindowBehavior.prototype.$toggleStyleFlagsState = 0;

ResponsiveWindowBehavior.prototype.on_SizeChanged = function (msg) {
    this.$setWindowSize(msg.target);
}.Description("");

ResponsiveWindowBehavior.prototype.on_ViewLoaded = function (msg) {
    this.$setWindowSize(msg.target);
}.Description("");

ResponsiveWindowBehavior.prototype.on_ChildAdded = function (msg) {
    this.$setWindowSize(msg.target);
}.Description("");

/**
 * Set right flag of window
 * @param {*} window - window to set size
 */
ResponsiveWindowBehavior.prototype.$setWindowSize = function(wnd){
    var size = this.width;
    if(!size){throw "Please set window size";}
    if(wnd.get_windowparent() != null){
        var clientRectOfParent = wnd.get_windowparent().get_clientrect();
        if(clientRectOfParent.w < size && !Math.bitsTest(wnd.getWindowStyles(), WindowStyleFlags.fillparent)){
            // Set fill parent flag
            wnd.maximizeWindow();
            //Save current style flags
            this.$toggleStyleFlagsState = (wnd.getWindowStyles() & this.$toggleStyleFlagsMask);
            //Reset style flags (By default style mask for flags are WindowStyleFlags.draggable | WindowStyleFlags.sizable)
            wnd.setWindowStyles(this.$toggleStyleFlagsMask,"reset")
        }else if(clientRectOfParent.w > size && Math.bitsTest(wnd.getWindowStyles(), WindowStyleFlags.fillparent)){
            // Remove fill parent flag
            wnd.normalizeWindow();
            //Restore style flags as developer is set them
            wnd.setWindowStyles(this.$toggleStyleFlagsState,"set");
            // Setting position of window to center in client rect of parent
            wnd.set_windowrect(clientRectOfParent.center(wnd.get_windowrect()));
        }
    }
}.Description("Set right flag of window");