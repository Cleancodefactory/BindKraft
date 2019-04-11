/* This interface is implemented by senders, batch collectors and other classes that provide request sending-like behavior (no matter what they actually do)

*/
/*INTERFACE*/
function IAjaxRequestSender() { }
IAjaxRequestSender.Interface("IAjaxRequestSender");
IAjaxRequestSender.prototype.sendRequest = function(req) { 
	throw "not implemented"; 
}.Description("Sends/schedules the request")
	.Returns("IAsyncResult");