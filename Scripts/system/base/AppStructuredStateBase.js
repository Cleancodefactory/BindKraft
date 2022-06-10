(function() {


    /**
     * A higher level base class for apps using TreeStates and pre-created windows structure.
     *  - TreeStates - routed state (see more in TreeStates)
     *  - Pre-created windows - all the windows are created when the application starts and are only hidden and shown during its lifecycle.
     * 
     * This is ONE OF MANY APPROACHES toward app architecture and not all apps use it. Choose this base class if appropriate for your case.
     * 
     */
    function AppStructuredStateBase() {
        AppBaseEx.apply(this, arguments);
    }
    AppStructuredStateBase.Inherit(AppBaseEx, "AppStructuredStateBase");

    

})();