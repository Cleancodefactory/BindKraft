/**
	Implemented by owners of ajax operations. When they implement it, the respective method is called to inform them for everything that happens
	Each method receives one argument - the ajax transaction
	See also IAjaxHttpReportSinkEvents
*/
function IAjaxHttpReportSink() {}
IAjaxHttpReportSink.Interface("IAjaxHttpReportSink");
IAjaxHttpReportSink.prototype.ajaxOnStartOperation = function(t) {}
IAjaxHttpReportSink.prototype.ajaxOnEndOperation = function(t) {}
IAjaxHttpReportSink.prototype.ajaxOnSuccess = function(t) {}
IAjaxHttpReportSink.prototype.ajaxOnError = function(t) {}
