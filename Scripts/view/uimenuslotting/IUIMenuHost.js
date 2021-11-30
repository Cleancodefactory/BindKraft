(function() {

    /**
     * 
     * 
     * // TODO addMenu needs some global info to tell the host WHO is setting the menu. This is a problem only in certain scenarios
     * A good example is a total commander like UI where two views are exactly the same as functionality and obviously their menu are the same too.
     */
    function IUIMenuHost() {}
    IUIMenuHost.Interface("IUIMenuHost");

    IUIMenuHost.prototype.addMenu = function(m) { throw "not implemented"; }
    IUIMenuHost.prototype.removeMenu = function(cookie) { throw "not implemented"; }

})();