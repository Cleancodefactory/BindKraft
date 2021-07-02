/**
	For implementation by ajax request owners
	Usually implementer over the IAjaxHttpReportSink, fires events on each ajax event.
*/
function IAjaxHttpReportSinkEvents() {}
IAjaxHttpReportSinkEvents.Interface("IAjaxHttpReportSinkEvents");
IAjaxHttpReportSinkEvents.prototype.ajaxonstartevent = new InitializeEvent("on start");  
IAjaxHttpReportSinkEvents.prototype.ajaxonendevent = new InitializeEvent("on end"); 
IAjaxHttpReportSinkEvents.prototype.ajaxonsuccessevent = new InitializeEvent("on success");
IAjaxHttpReportSinkEvents.prototype.ajaxonerrorevent = new InitializeEvent("on error");