

// +Version 1.5


// (Under development - do not use yet!)
// This Interface is used by the structural query mechanism to query the queries during their routing.
// A query class (a class intended for such usage) can Implement it if the class needs to have a say about the routing and execution
// In future versions the Interface can be extended to support more queries, but its purpoese will always remain narrowed to the routing and execution.
// NOT YET FULLY implemented
/*INTERFACE*/
function IQueryStructuralQuery() {}
IQueryStructuralQuery.Interface("IQueryStructuralQuery");
IQueryStructuralQuery.prototype.AgreeQueryRouteChange = function(oldrouteType, newrouteType, router) {
	return true; // The default implementation just agrees with everything.
}.Description("Notifies the query about routing type change. The query must return true if it agrees with that and false otherwise. Disagreeing with the change will stop the propagation.")
	.Param("oldrouteType","String - the old routing type (e.g. dom, window, app)")
	.Param("newrouteType","String - the new routing type (e.g. dom, window, app)")
	.Param("router","(recommended, but optional) A reference to the object that performs the routing (it is the caller's object, actually). ")
	.Returns("true for agreement, false for disagreement");
	
IQueryStructuralQuery.prototype.AgreeQueryProcessing = function(processor,processInstructions) {
	return true; // The default implementation agrees with everything.
}.Description("Notifies the query that it is about to be processed. The query can agree (true) or disagree (false) with that. The disagreement produces the equivalent effect as if a processor has not been found.")
	.Param("processor", "A reference to the processor object")
	.Param("processInstructions", "The process instructions whith which the query has been thrown.")
	.Returns("true for agreement and false for disagreement");
