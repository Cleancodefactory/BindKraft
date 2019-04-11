


/*INTERFACE*/
function IAjaxReportSinkImpl() { };
IAjaxReportSinkImpl.Interface("IAjaxReportSinkImpl");
IAjaxReportSinkImpl.prototype.ajaxOnStartOperation = null;  // __thiscall function (settings)
IAjaxReportSinkImpl.prototype.ajaxOnEndOperation = null;    // __thiscall function(settings, result, status)
IAjaxReportSinkImpl.prototype.ajaxOnSuccess = null;         // __thiscall function(result)
IAjaxReportSinkImpl.prototype.ajaxOnError = null;           // __thiscall function(setting, null, status)

IAjaxReportSinkImpl.prototype.ajaxonstartevent = null;      // handler(settings)
IAjaxReportSinkImpl.prototype.ajaxonendevent = null;        // handler(settings, result, status)
IAjaxReportSinkImpl.prototype.ajaxonsuccessevent = null;    // handler(result)
IAjaxReportSinkImpl.prototype.ajaxonerrorevent = null;      // handler(setting, null, status)
// Implementation helper
IAjaxReportSinkImpl.ajaxNotifyObject = function (obj, ajaxEvent) {
    if (BaseObject.is(obj, "IAjaxReportSinkImpl")) {
        var arg1 = ((arguments.length > 2) ? arguments[2] : null);
        var arg2 = ((arguments.length > 3) ? arguments[3] : null);
        var arg3 = ((arguments.length > 4) ? arguments[4] : null);
        switch (ajaxEvent.toLowerCase()) {
            case "start":
            case "onstart":
            case "onstartoperation":
                if (BaseObject.is(obj.ajaxonstartevent, "EventDispatcher")) obj.ajaxonstartevent.invoke(arg1);
                if (typeof obj.ajaxOnStartOperation == "function") return obj.ajaxOnStartOperation.call(obj, arg1);
                break;
            case "end":
            case "onend":
            case "onendoperation":
                if (BaseObject.is(obj.ajaxonendevent, "EventDispatcher")) obj.ajaxonendevent.invoke(arg1, arg2, arg3);
                if (typeof obj.ajaxOnEndOperation == "function") return obj.ajaxOnEndOperation.call(obj, arg1, arg2, arg3);
                break;
            case "error":
            case "onerror":
                if (BaseObject.is(obj.ajaxonsuccessevent, "EventDispatcher")) obj.ajaxonsuccessevent.invoke(arg1, arg2, arg3);
                if (typeof obj.ajaxOnSuccess == "function") return obj.ajaxOnSuccess.call(obj, arg1, arg2, arg3);
                break;
            case "success":
            case "onsuccess":
                if (BaseObject.is(obj.ajaxonerrorevent, "EventDispatcher")) obj.ajaxonerrorevent.invoke(arg1);
                if (typeof obj.ajaxOnError == "function") return obj.ajaxOnError.call(obj, arg1);
                break;
        }
    }
}