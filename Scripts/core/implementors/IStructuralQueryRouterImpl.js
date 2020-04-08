


function IStructuralQueryRouterImpl() { }
IStructuralQueryRouterImpl.InterfaceImpl(IStructuralQueryRouter, "IStructuralQueryRouterImpl");
// routingTypeName - string, the routing type implemented by this class
// getParentProc - a func designed for _thiscall on instances of the implementor class. Must return the parent of the object as appropriate.
//      Very often query routers have different kinds of possible parents and the routine must analyze and return the correct one.
//      E.g. a window can be a root window of an app and then the app is the parent, but the window can be a subwindow and then the correct parent is its parent window.
IStructuralQueryRouterImpl.classInitialize = function (cls, routingTypeName, getParentProc) {
    cls.prototype.get_structuralQueryRoutingType = function () { return routingTypeName; };
    cls.prototype.routeStructuralQuery = function(query, processInstructions) {
        var cur = this; // getParentProc.call(this);
        while (cur != null) {
            if (BaseObject.is(cur, "IStructuralQueryRouter") && cur.get_structuralQueryRoutingType() != routingTypeName) {
				if (BaseObject.is(query,"IQueryStructuralQuery")) {
					if (!query.AgreeQueryRouteChange(routingTypeName,cur.get_structuralQueryRoutingType())) return false;
				}
                return cur.routeStructuralQuery(query, processInstructions);
            } else if (BaseObject.is(cur, "IStructuralQueryProcessor")) {
                if (cur.processStructuralQuery(query, processInstructions)) return true;
            }
            cur = getParentProc.call(cur);
        }
        return false;
    };
};