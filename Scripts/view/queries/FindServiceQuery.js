


// Service provider query. The consumer obtains a reference to an object supporting the requested servcice. Usually (the standard implementations) this is the closest parent that
// can provide it. iface is the name of the Interface requested, reason is optional and should be (if possible) a string (but can be anything) which helps the handlers to determine
// if they are the best service provider for the reason specified. When handling use simple comparison == or check carefuly for the reason's type before peroforming something more specific.
/*CLASS*/ /*QUERY*/
function FindServiceQuery(iface, reason) {
    this.Interface = iface;
    this.reason = reason;
    this.result = null;
}
FindServiceQuery.Inherit(BaseObject, "FindServiceQuery");
// Handling implementation helper
// Usage inside processStructuralQuery: if (FindServiceQuery.handle(this,query)) return true;
// In many cases it may be desired to allow only certain interfaces to be treated as services. Pass a list of Interface names to define which:
// inside processStructuralQuery or onStructuralQuery: if (FindServiceQuery.handle(this,query, ["Prot1", "Prot2"])) return true;
// The reasons are supported, but at this moment not ever used. They might enable us to provide the same service under different context (for different reasons).
FindServiceQuery._handle = function (_this, query, ifacelist, reasonlist) {
    if (BaseObject.is(query, "FindServiceQuery")) {
        if (BaseObject.is(_this, query.Interface)) {
            // Check if the protocolrequested is in the ifacelist (interfaces we serve as services)
            if (BaseObject.is(ifacelist, "Array")) {
                if (ifacelist.FirstOrDefault(function (idx, item) {
                    if (item == query.Interface) return true;
                    return null;
                }) != true) {
                    return false;
                }
            }
            // Check if the reason is in the reasonlist
            if (BaseObject.is(reasonlist, "Array")) {
                if (query.reason != null) {
                    if (reasonlist.FirstOrDefault(function (idx, item) {
                        if (item == query.reason) return true;
                        return null;
                    }) != true) {
                        return false;
                    }
                }
            }
            query.result = _this;
            return true;
        }
    }
    return false;
};


FindServiceQuery.handleEx = function(_this, query, /*optional*/ ifacelist, /*optional*/ reasonlist) {
	if (BaseObject.is(query, "FindServiceQuery")) {
		var r = null;
		if (BaseObject.is(_this, "IServiceLocator")) {
			r = _this.locateService(query.Interface, query.reason);
			if (r != null) {
				query.result = r;
				return true;
			}
		}
		// if we are here we can try the old way
		if (ifacelist != null) {
			return this._handle(_this, query, ifacelist,reasonlist);
		}
	}
	return false;
}
// Client helper
FindServiceQuery.findService = function (el, iface, reason) {
    var p = new FindServiceQuery(iface, reason);
    if (BaseObject.is(el, "IStructuralQueryEmiter")) {
        if (el.throwStructuralQuery(p)) return p.result;    
    } else {
        if (JBUtil.throwStructuralQuery(el, p)) return p.result;    
    }
    return null;
};
FindServiceQuery.findService_old = function(_this, iface, reason) {
    var el = null;
    if (BaseObject.is(_this, "Base")) {
        el = _this.root;
    } else {
        el = _this;
    }
    var p = new FindServiceQuery(iface,reason);
    if (JBUtil.throwStructuralQuery(el, p)) return p.result;
    return null;
};

FindServiceQuery.handle = FindServiceQuery.handleEx; // Preparation for future changes
/* New version of pre-implemented processing of find service queries.
	Call this in your:
		- processStructuralQuery method if you are processing queries on lower level. It may look like:
			YourClass.prototype.processStructuralQuery = function(query, processingInstructions) {
				....
				else if (BaseObject.is (query, "FindServiceQuery") {
					FindServiceQuery.handleEx(this, query);
				}
				....
			}
		- YourClass.onStructuralQuery("FindServiceQuery", function (query, processingInstructions) {
			FindServiceQuery.handleEx(this, query);
		}
	This processing performs the new procedure which is backward compatible with the old one. However, the compatibility 
	is achieved not here (like it was before - see handle above), but on the other side - in the interface implementation
	in the class of the object (the this you are passing). 
	
	So, this kind of reverses the logic a little, which was intended, the old logic (handle method) was concentrated in 
	the handle method itself in order to make it easier to upgrade (which is now happening) without searching and 
	reimplementing a number of classes.
	
	Proto:
	FindServiceQuery.handleEx(_this, query [, ifacelist [,reasonlist]]);
	
	handleEx will check for the interface IServiceLocator the _this and call the service. If the service is not implemented or can't find the service requested it will use the 
	ifacelist and reasonlist (if supplied) like the old handle method.
	This behavior is designed to implement gradual move from the old processing to the new one even in a single class
		
*/