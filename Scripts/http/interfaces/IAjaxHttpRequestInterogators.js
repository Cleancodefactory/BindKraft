/**
	Holds slots for helper methods that implement the pre-send pipline BindKraft procedures
	Many of the procedures are required in order to provide the expected standard behavior when communicating
	with Kraft servers.
*/
function IAjaxHttpRequestInterogators() {}
IAjaxHttpRequestInterogators.Interface("IAjaxHttpRequestInterogators");
// PRESENDING UTILITY PROCEDURES
// These implement techniques used by most onsend implementations
/**
	Interrogates the owner and hierarchy/ies behind it for the supported
	contextual parameters, obtaining information about their names and possible values
*/
IAjaxHttpRequestInterogators.prototype.determineSupportedContextParameters = function() {
	throw "not impl";
}
/**
	Using the information from determineSupportedContextParameters interrogates the owner for
	the actual values.
*/
IAjaxHttpRequestInterogators.prototype.collectContextParameters = function() {
	throw "not impl";
}
/**
	Ask owner through IAjaxQueryStringParams if supported
*/
IAjaxHttpRequestInterogators.prototype.collectOownerQueryParameters = function() {
}