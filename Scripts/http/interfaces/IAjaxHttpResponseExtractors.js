/**
	Contains slots for methods that extract typical chunnks of information from a response.
	The response may be encoded in various ways, sometimes it might be easier to process it directly witout these.
	When the helpers are used they should be contained in separate classes whith constructors initialized with the response encoded in the
	form expected by the given class abd then queried through the interface's methods.
*/
function IAjaxHttpResponseExtractors() {}
IAjaxHttpResponseExtractors.Interface("IAjaxHttpResponseExtractors");
/**
	This method extracts the status stated in the response - often called the application reported status or logical status.
	It has to be further corellated with the http status by the onreceive method to form the final result.
*/
IAjaxHttpTransactionProcessing.prototype.extractResponseStatus = function() { throw "not impl"; }

IAjaxHttpTransactionProcessing.prototype.extractResponseData = function() { throw "not impl"; }
IAjaxHttpTransactionProcessing.prototype.extractResponseViews = function() { throw "not impl"; }
IAjaxHttpTransactionProcessing.prototype.extractResponseResources = function() { throw "not impl"; }
IAjaxHttpTransactionProcessing.prototype.extractResponseLookups = function() { throw "not impl"; }
	