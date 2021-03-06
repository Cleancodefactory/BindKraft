


/*IMPL HELPER*/
function IStructuralQueryEmiterImpl() { }
IStructuralQueryEmiterImpl.InterfaceImpl(IStructuralQueryEmiter, "IStructuralQueryEmiterImpl");
// like the query router
IStructuralQueryEmiterImpl.classInitialize = function(cls, routingTypeName, getParentProc) {
    cls.prototype.throwStructuralQuery = function(query, processInstructions) {
        var cur = this;
        while (cur != null) {
            if (cur.is("IStructuralQueryRouter") && cur.get_structuralQueryRoutingType() != routingTypeName) {
                return cur.routeStructuralQuery(query, processInstructions);
            } else if (cur.is("IStructuralQueryProcessor")) {
                if (cur.processStructuralQuery(query, processInstructions)) {
                    return true;
                }
            }
            cur = getParentProc.call(cur);
        }
        return false;
    };
    cls.prototype.throwDownStructuralQuery = function(query, processInstructions) {
        var cur = getParentProc.call(this);
        while (cur != null) {
            if (cur.is("IStructuralQueryRouter") && cur.get_structuralQueryRoutingType() != routingTypeName) {
                return cur.routeStructuralQuery(query, processInstructions);
            } else if (cur.is("IStructuralQueryProcessor")) {
                if (cur.processStructuralQuery(query, processInstructions)) {
                    return true;
                }
            }
            cur = getParentProc.call(cur);
        }
        return false;
    };
};
