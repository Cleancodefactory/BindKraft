
/*
	This interface is implemented by various request processors. They inspect a request and update it as necessary (according to their purpose).

*/
/*INTERFACE*/
function IAjaxRequestProcessor() { }
IAjaxRequestProcessor.Interface("IAjaxRequestProcessor");
IAjaxRequestProcessor.prototype.processAjaxRequest = function(req) { throw "not implemented"; }