(function() {
    var IAppRouter = Interface("IAppRouter"),
        TreeStates = Class("TreeStates");
    /**
     */
    function IAppRouterTrivialImpl() {}
    IAppRouterTrivialImpl.InterfaceImpl(IAppRouter,"IAppRouterTrivialImpl");

    IAppRouterTrivialImpl.prototype.routeTreeState = function(base_or_route, tail) { 

    }
    IAppRouterTrivialImpl.prototype.currentTreeState = function(/*optional*/base) { 
        return [];
    }
    IAppRouterTrivialImpl.prototype.canOpenTreeState = function(route) { return true;}
    IAppRouterTrivialImpl.classInitialize = function(cls) {
        var treeStates = new TreeStates(function (maps, map, node, unit, condition) {
            return maps();
        });
        cls.getStateMap = function() { return treeStates; }
    }
})();