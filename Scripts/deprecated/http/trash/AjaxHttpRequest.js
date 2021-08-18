
/**
	This class holds the information needed, but should not be executed directly if one wants to
	benefit of all the features of the communication subsystem.
*/


function AjaxHttpRequest() {
	BaseObject.apply(this, arguments);
}
AjaxHttpRequest.Inherit(BaseObject).
Implement(IAjaxHttpRequest).
DeclarationBlock({
	method: {type: "rw string HTTP method", init: "GET" },
	data: "rw any Holds the data to be sent to the server.",
	url: "rw string Holds the Url for the request",
	responseType: "rw string The expected type of response json|text|xml",
	async: { type: "rw boolean Use async request if true (default)", init: true },
	cache: "rw boolean Should we cache or not",
	contenttype: "rw string The content type of the data being sent - applies to post",
	crossdomain: "rw boolean Set this to true for cross domain requests",
	
	
});