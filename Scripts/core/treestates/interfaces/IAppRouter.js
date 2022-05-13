(function() {

    /**
     * Terminology:
     * Route is:
     *    /element1stat/element2state/...
     *    it always starts from the root (absolute route - path)
     * Base route is:
     *    /map1stringified/map2stringified/
     *    Part of the route starting from the root
     *    it can specified as chain of states or as array of element names. In the second case it means part of the current route starting from the root.
     * Tail is:
     *      Either full route or the nodes that need to be appended to a base route 
     * 
     */
    function IAppRouter() {}
    IAppRouter.Interface("IAppRouter");

    /**
     * Case 1 (mandatory)
     * @param {Array<object>} base_or_route - route (tail is ignored) - state as decoded object set 
     * @param {null} tail - ignored
     * Case 2 (required*)
     * @param {Array<string>} base_or_route - base route (as element names - namedPath) 
     * @param {Array<object>} tail - state as decoded object set
     * 
     * Case 3 (optional)
     * @param {Array<string>} base_or_route - base route (as element names - namedPath) 
     * @param {string} tail - state as string automatically decoded by the internal serializer (only for internal app use)
     * 
     * @returns {) ??
     * 
     * [58, "profile", "personalinfo"]
     * 
     */
    IAppRouter.prototype.routeTreeState = function(base_or_route, tail) { throw "not implemented";}

    /**
     * @param {Array<string>|null} base - Optional array with element names. If they match an initial part of the current route - they are returned, null otherwise.
     *                               If omitted the full state object set is returned.
     * @returns {Array<object>} State object set
     * 
     * Examples:
     * var arr = app.currentTreeState(); // Will return array of objects matching the current state of the app (objSet)
     * 
     * var arr = app.currentTreeState(["hrm","profile"]) // will return array with two objects if the app's state is /hrm/profile or any state under this one.
     */
    IAppRouter.prototype.currentTreeState = function(/*optional*/base) { throw "not implemented";}

    /**
     * Called virtually always from outside when an instance that works on the "same thing" should be used to open the injected route.
     * This is usually viewed as a document/instance of work the app works with. If the route points to the same instance of work the app should return true.
     * E.g. HRM app opens HRMs by their ID. If the route has the same hrm ID the HRM app returns true. We assume the HRM app can be opened in multiple instances, 
     * but only one instance can be opened with a given hrm ID.
     * 
     * @param {Array<object>} route - the route to open.
     * 
     * @returns {boolean} - true to confirm, false to reject. Single instance apps SHOULD always return true.
     */
    IAppRouter.prototype.canOpenTreeState = function(route) { throw "not implemented";}

})();