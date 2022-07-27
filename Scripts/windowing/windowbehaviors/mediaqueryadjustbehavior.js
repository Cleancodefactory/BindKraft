(function() {

    function MediaqueryAdjustBehavior(queryName) {
        WindowBehaviorBase.apply(this, arguments);
        if (typeof queryName != 'string' || /^\s*$/.test(queryName)) {
            throw "MediaqueryAdjustBehavior must be created with a name of notification to listen for.";
        }
        this.$queryName = queryName;
    }
    MediaqueryAdjustBehavior.Inherit(WindowBehaviorBase, "ResponsiveWindowBehavior");
    MediaqueryAdjustBehavior.ImplementReadProperty("queryName", new InitializeStringParameter("The name of the query expression messaged through the Messenger. See mediamessenger command.",null));
    MediaqueryAdjustBehavior.prototype.obliterate = function () {
        Class("Messenger").Instance().unsubscribe("MediaChangedMessage",this.$mediaQueryListener);
        WindowBehaviorBase.prototype.obliterate.apply(this, arguments);
    }

    MediaqueryAdjustBehavior.prototype.$mediaQueryListener = new InitializeMethodDelegate(
        "Checks MediaChangedMessage received",
        function(msg) {
            if (msg.get_name() == this.$queryName) {
                if (msg.get_matched()) {

                } else {
                    
                }
            }
        });

    MediaqueryAdjustBehavior.prototype.on_Create = function (msg) {
        Class("Messenger").Instance().subscribe("MediaChangedMessage",this.$mediaQueryListener);
    }.Description("");
    MediaqueryAdjustBehavior.prototype.on_Destroy = function (msg) {
        Class("Messenger").Instance().unsubscribe("MediaChangedMessage",this.$mediaQueryListener);
    }.Description("");

    MediaqueryAdjustBehavior.prototype.on_FirstShown = function (msg) {
        this.$setWindowSize(msg.target);
    }.Description("");
    
    MediaqueryAdjustBehavior.prototype.on_SizeChanged = function (msg) {
        this.$setWindowSize(msg.target);
    }.Description("");
    
    MediaqueryAdjustBehavior.prototype.on_ViewLoaded = function (msg) {
        this.$setWindowSize(msg.target);
    }.Description("");
    
    MediaqueryAdjustBehavior.prototype.on_ChildAdded = function (msg) {
        this.$setWindowSize(msg.target);
    }.Description("");


    MediaqueryAdjustBehavior.prototype.$setWindowSize = function(wnd){
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

})();

