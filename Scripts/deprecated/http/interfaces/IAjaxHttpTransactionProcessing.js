/**
	Contains the main methods involved in the transaction procedure
	Additional helpers that can be used by the onsend and onreceive procedures are slotted in additional interfaces
*/
function IAjaxHttpTransactionProcessing() {}
IAjaxHttpTransactionProcessing.Interface("IAjaxHttpTransactionProcessing");
// REQUEST SENDING
/**
	Start the sending procedure
*/
IAjaxHttpTransactionProcessing.prototype.send = function() {
	throw "not impl";
}
/**
	Sending processing function - it will use a number of the other functions around here
	and potentially some others (not defined in the interface)
*/
IAjaxHttpTransactionProcessing.prototype.onsend = function() { throw "not impl";}
/**
	Called when the request returns with ot without errors - drives the response receiving process
*/
IAjaxHttpTransactionProcessing.prototype.onreceive = function() { throw "not impl";}


