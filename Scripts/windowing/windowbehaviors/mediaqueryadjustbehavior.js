(function() {
    var WindowBehaviorBase = Class("WindowBehaviorBase"),
        MediaChangedMessage= Class("MediaChangedMessage");


    /**
     * Window behavior reacting to media query notifications sent through the Messenger. To use this one has to setup 
     * in the workspace boot script MediaQueryNotificatorBroadcaster notificators under the names configured in the rules
     * argument. See more information about the MediaQueries and notificators in their documentation.
     * 
     * @param {object} rules - Configures what to do when certain media query expression is on or off.
     * rules scheme:
     * {
     *  "expressionname": {... actions see below ...} positive rules
     *  "!expressionname": {... actions see below ...} negative rules
     * }
     * 
     * Positive rules are applied when the expression matches and during windowing events and the expression is still in matched state.
     * Negative rules are applied when the expression unmatches
     * 
     * actions:
     * {
     *      match:{
     *          <instructions>
     *          events: {
     *              eventname: <instructions>
     *          }
     *      },
     *      unmatch:{
     *          <instructions>
     *          events: {
     *              eventname: <instructions>
     *          }
     *      }
     * }
     * instructions are uniform no matter where specified, however in certain scenarios, certain instructions will not make sense.
     * 
     * 
     */
    function MediaqueryAdjustBehavior(rules) {
        WindowBehaviorBase.apply(this, arguments);
        if (typeof rules != "object") {
            throw "MediaqueryAdjustBehavior must be created with rules object.";
        }
        this.$rules = rules;
    }
    MediaqueryAdjustBehavior.Inherit(WindowBehaviorBase, "ResponsiveWindowBehavior");
    MediaqueryAdjustBehavior.ImplementReadProperty("rules", new InitializeObject("object containing rules for reaction to queries."));
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

