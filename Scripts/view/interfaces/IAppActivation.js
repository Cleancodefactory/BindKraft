(function() {
    /**
     * This interface serves two purposes: 
     * - specifies how to bring the application into "focus" and optionally provides a method for custom activation.
     * - Enables starting/stopping of certain services (mostly applicable to apps designed to run as daemons).
     */
    function IAppActivation() {}
    IAppActivation.Interface("IAppActivation");

    /**
     * Returns a string constant telling how to activate the app (obeyed by shell.activateApp and further means to do so)
     * Possible return values:
     * "custom" - customAppActivation must be called to activate/deactivate the app
     * "hidden" - do nothing
     * "default" and any unrecognized result - show all windows and activate them.
     */
    IAppActivation.prototype.howToActivateTheApp = function() {return "default";}
    IAppActivation.prototype.customAppActivation = function(activate) { throw "not implemented";}
    /**
     * start/stop can be called without any arguments - this must be implemented as starting/stopping all provided services.
     * With arguments, they should be types or type names - typically the interfaces of the services. Empty interface definitions should be used
     * for services not provided through service calls (whatever this actually means in any specific case). Example of the latter can be a daemon that
     * hooks into the system and tracks certain events in order to interfere in some manner - such a daemon will make service calls, but may or may not
     * expose any - so a dummy empty interface definition can be used to identify it.
     * 
     * Currently there is no standard implementation concerning daemon apps. They are just started with the system and even not required to support this interface.
     * Custom daemon management can vary and this interface is introduced to provide a convention for part of that. There is no reason to expect a standard mandatory 
     * daemon management in the future, but reusable shell apps can be created by some developers or provided as optional modules that include daemon management with 
     * the aim to provide a base for different projects that will benefit from the "OS with apps and daemons" kind of structure. These will be projects providing multiple 
     * apps and daemons from which some are always in use, but others will depend on specific user scenarios etc.
     * 
     * So, the implementation of the following two methods is not mandatory, but may be necessary if the app/daemon will be used in projects like the ones described above.
     */
    IAppActivation.prototype.startProvidingServices = function(/* services list */) { throw "not implemented";}
    IAppActivation.prototype.stopProvidingServices = function(/* services list */) { throw "not implemented";}
    
    /**
     * Not normally called by the system. Should return a string specifying the app role:
     * "app" - normal application
     * "daemon" - daemon app working in the background.
     * "shell" - shell app
     * "userhelper" - a daemon-like app that shows UI sometimes (usually in response to a service all) to help the user do something with/within other apps
     */
    IAppActivation.prototype.appSystemRole = function() { return "app";}
})();