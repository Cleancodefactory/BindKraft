(function(){
    var IMediaQueryNotificator = Interface("IMediaQueryNotificator");


    function IMediaQueryTracker(){}
    IMediaQueryTracker.Interface("IMediaQueryTracker", "IManagedInterface");
    /**
     * @param {string} name Name of a previously registered media query (through add)
     * @returns {boolean} Indicates if the media query matches current state.
     */
    IMediaQueryTracker.prototype.checkQuery = function(name) { throw "not implemented"; }
    /**
     * @param {string} name Name of a previously registered media query (through add)
     * @returns {boolean} Indicates if a media query with the given name is registered (through add)
     */
    IMediaQueryTracker.prototype.exists = function(name) { throw "not implemented"; }
    /**
     * @param {string} name Name under which to register the media query
     * @param {string} query The media query code. See MDN for the syntax and browser support.
     * @returns {boolean} Indicates if the registration is successful. In case of false returned LASTERROR 
     *          contains the detailed error information.
     */
    IMediaQueryTracker.prototype.add = function(name, query) { throw "not implemented"; }
    /**
     * @param {string} name Name of previously registered query to remove from the list.
     * @returns {boolean} Indicates if removal actually occurred.
     */
    IMediaQueryTracker.prototype.remove = function(name) { throw "not implemented"; }
    /**
     * REmoves all the media queries from the tracker.
     */
    IMediaQueryTracker.prototype.clear = function() { throw "not implemented"; }
    /**
     * Used mostly internally this invokes all the registered notificators to check the current state of the media queries.
     * Can be used externally to forcibly invoke notifications to all the current parties.
     * @param {boolean} [force] If set to true will force notificators to issue notification for the current state. Will impact all the consumers.
     */
    IMediaQueryTracker.prototype.queryChange = function(force) { throw "not implemented";}
    /**
     * @param {string} name The name under which to register the notificator
     * @param {string|?} condition A condition expression or a preconfigured notificator instance (this is somewhat questionable)
     * @param {string} [type]   Optional class name for the notificator to create and initialize. If not specified the base class is used.
     * @returns {}
     */
    IMediaQueryTracker.prototype.addNotificator = function(name, condition, type) { throw "not implemented";}.ReturnType(IMediaQueryNotificator);
    IMediaQueryTracker.prototype.removeNotificator = function(name) { throw "not implemented";}
    IMediaQueryTracker.prototype.removeAllNotificators = function() { throw "not implemented";}
    IMediaQueryTracker.prototype.getNotifcator = function(name) { throw "not implemented"; }.ReturnType(IMediaQueryNotificator);
    IMediaQueryTracker.prototype.askNotificator = function(name) { throw "not implemented"; }
})();