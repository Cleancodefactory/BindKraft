/**
	Composes request/packet for sending to the server
	Implementations must pass to the constructor the IAjaxHttpRequest with which this should work
*/
function IAjaxHttpRequestComposer() {}
IAjaxHttpRequestComposer.Interface("IAjaxHttpRequestComposer");
/**
	Must fill the request.$communicator and fill it with the data contained in the request, encoding it appropriately.
	$communicator is usually xmlhttprequest.
*/
IAjaxHttpRequestComposer.prototype.composeRequest = function() { throw "not impl"; }