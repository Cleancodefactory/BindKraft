


/*INTERFACE*/
// The query router when found takes over the query routing
function IStructuralQueryRouter() { }
IStructuralQueryRouter.Interface("IStructuralQueryRouter");
IStructuralQueryRouter.prototype.get_structuralQueryRoutingType = function() { return null; };
IStructuralQueryRouter.prototype.routeStructuralQuery = function(query, processInstructions) {
    // todo: Implement custom routing of the query.
    // The get_structuralQueryRoutingType() can be used to obtain the router type and pass it along in the processInstruction object (a router can create one if null is received and pass it further)
    //  The processInstructions is a plain object with the property routingType reserved for routers that need to to honour different routing strategies.
    //  Implementation specifics: 1) Navigate the hierarchy of objects for this route up toward its root, 
    //                            2) pass for processing the query to each obejct that supports the IStructuralQueryProcessor Interface
    //                            3) If the processor returns true return, otherwise continue
    //                            4) If the current node supports the IStructuralQueryRouter Interface and its get_structuralQueryRoutingType() 
    //                               is different than the current pass the control to its routeStructuralQuery method and on return also return immediatelly.
};