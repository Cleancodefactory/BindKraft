

function IAjaxHttpRequest() {}
IAjaxHttpRequest.Interface("IAjaxHttpRequest");
// Looks alike: IDataHolder
// Properties
IAjaxHttpRequest.prototype.get_owner = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.get_data = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_data = function(v) { throw "not impl"; }
IAjaxHttpRequest.prototype.get_verb = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_verb = function(v) { throw "not impl"; }
/**
	url:
		- string
		- BkUrl // schema, server,path,qrystring,fragment
*/
IAjaxHttpRequest.prototype.get_url = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_url = function(v) { throw "not impl"; }
// datacontract would be one or more interfaces that can be queried to a different degree of details
// about the expected answer, takes also the role of the dataType/responseType
/**
	The format contract is a procedure that covers "what I am sending and what I expect to receive - formatwise"
	
	- "json"|"xml"|"text"...
	- <IResponseUnderstander>  // Please give me a better term!
		IAjaxHttpFormatContract
*/
IAjaxHttpRequest.prototype.get_formatcontract = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_formatcontract = function(v) { throw "not impl"; }
/**
	Obtains the composer through the formatcontract
*/
IAjaxHttpRequest.prototype.get_requestcomposer = function(v) { throw "not impl"; }
IAjaxHttpRequest.prototype.get_async = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_async = function(v) { throw "not impl"; }
/**
	- true/false
	- ?<ICachePolicy> (only example name)
	- ?<ICachePolicy2> (only example name)
*/
IAjaxHttpRequest.prototype.get_cache = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_cache = function(v) { throw "not impl"; }
IAjaxHttpRequest.prototype.get_contenttype = function() { throw "not impl"; }
IAjaxHttpRequest.prototype.set_contenttype = function(v) { throw "not impl"; }

// Indexed property - parameter set for the query string (explicitly)
IAjaxHttpRequest.prototype.get_getparams = function(idx) { throw "not impl"; }
IAjaxHttpRequest.prototype.set_getparams = function(idx, v) { throw "not impl"; }
// Indexed property - headers
IAjaxHttpRequest.prototype.get_headers = function(idx) { throw "not impl"; }
IAjaxHttpRequest.prototype.set_headers = function(idx, v) { throw "not impl"; }

//
/**
	Usually set by the format contract (on openRequest) or the Transaction itself (on initialize)
*/
IAjaxHttpRequest.prototype.get_communicator = function() { throw "not impl";}
IAjaxHttpRequest.prototype.set_communicator = function(v) { throw "not impl";}

// TODO: Crossdomain
// Overrides

// Methods
/**
	Init request function - we can hide this behind the constructor depending on future decisions
	Sets defaults and supplied data to the request fields
*/
IAjaxHttpRequest.prototype.init = function(initvalues) {
	throw "not impl";
}


/*
IAjaxHttpRequest.DeclarationBlock({
	//crossdomain: "rw boolean * Set this to true for cross domain requests"
});
*/