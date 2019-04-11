BaseObject.ajaxDefaults = {
    "default": {
        cache: false,
        error: BaseObject.defaultAjaxErrorHandler,
        onStartOperation: null,
        onEndOperation: null
    }
};

BaseObject.prototype.get_ajaxDefaults = function (kind) {
    var k = (kind != null) ? kind : "default";
    var c = this.constructor;
    do {
        if (c.ajaxDefaults != null && c.ajaxDefaults[k] != null) return c.ajaxDefaults[k]; 
        c = c.parent.constructor;
    } while(c != null && c.constructor != Object)
    return null;
}.Description("...")
 .Param("kind","...")
 .Returns("object or null");

/*
	Implementation considerations:
	settings is enriched with a number of properties we are using, which are ignored by jquery.
	... TODO: complete this ...
	confData property is reserved for use by custom extensions implemented in the conf file.
		It is not initialized by the framework, if the conf handlers need it always initialized onStartOperation should do the initialization.		
*/
BaseObject.prototype.ajax = function (settings, kind) { // base transfer method

    var localThis = this;
    var defs = this.get_ajaxDefaults(kind);
    if (defs == null) defs = this.get_ajaxDefaults();
	
    if (defs != null) {
        for (var k in defs) {
            if (settings[k] == null) settings[k] = defs[k];
        }
    }
	
    if (settings.mapUrl) settings.url = mapPath(settings.url);
	
    var userCallBack = settings.success;
    var userErrorHandler = settings.error;
	
    settings.success = function (result, statusText, jqXHR) {
		if (localThis.__obliterated) return; // Cancel any processing.
        var processedResult = null;
        if (settings.onEndOperation) processedResult = settings.onEndOperation.call(localThis, settings, result, { success: true, status: 200, statusText: "OK", description: null, xhr: jqXHR });
        if (settings.AbortAllProcessing) return;
        if (settings.failRequest != null) {
            if (settings.failRequest.skipErrorProcessing !== true) {
                settings.error(jqXHR, settings.failRequest.statusText, settings.failRequest.description);
            } else {
                IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, result, { success: false, status: 200, statusText: settings.failRequest.statusText, description: settings.failRequest.description });
            }
        } else {
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, result, { success: true, status: 200, statusText: "OK", description: null });
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "success", settings);
            if (userCallBack != null && !settings.AbortAllProcessing) userCallBack.call(localThis, (processedResult != null) ? processedResult : result);
        }
    };
	
    settings.error = function (xmlHttpReq, textStatus, errDescription) {
		if (localThis.__obliterated) return; // Cancel any processing.
        if (settings.onEndOperation) settings.onEndOperation.call(localThis, settings, null, { success: false, status: xmlHttpReq.status, statusText: textStatus, description: errDescription, xhr: xmlHttpReq });
        if (settings.AbortAllProcessing) return;
        if (userErrorHandler != null) userErrorHandler.call(localThis, xmlHttpReq, textStatus, errDescription, settings);
        IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, null, { success: false, status: xmlHttpReq.status, statusText: textStatus, description: errDescription });
        IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "error", settings, null, { success: false, status: xmlHttpReq.status, statusText: textStatus, description: errDescription });
    };
	
    if (settings.onStartOperation) {
        if (settings.onStartOperation.call(localThis, settings) === true) {
            // Operation is redundand or cancelled
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "start", settings);
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, settings.immediateResult, { success: true, status: 200, statusText: "OK", description: null });
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "success", settings.immediateResult);
            settings.success(settings.immediateResult);
            return;
        }
    }
	
    IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "start", settings);
	
    $.ajax(settings);	
}.Description("...")
 .Param("settings","Array with settings")
 .Param("kind","...");

// These two static methods should be overriden by the application to append any app specific
// OOB parameters to the URL (first method) and returns the meaningful part of these parameters (the second metod).
// This is usually done by using regullar expressions.
// Details: Most applications need some kind of OOB app wide data to be passed in the server requests, such as role, group, mode etc.
//  These methods must be used by the application's ajax pre/post callbacks, caching code and other modules that may need to identify
//  certain elements by URL used to load/init them. As the OOB data may (or may not depending on the design) be part of the data needed
//  to identify such an element uniquely the application needs some help from the framework both to inject the data and to identify it back
//  whenever the URL must be "recognized" and matchaed against cache managers or other keyed stores.
//  Performance recommendation: When keying data this way it is recommended to put the element supplied part of the URL hash first (in the start of the key string) because
//  it is likely that this part is much more unique than the application OOB part.
// ajaxDecorateUrl( this, url in preparation)
BaseObject.ajaxDecorateUrl = function (obj, url) { return url; };
BaseObject.ajaxDecorateUrlHash = function (obj, url) { return ""; };
// note about ajaxDecorateUrlHash. Although this routine has the same arguments like the first one, depending on the application design the first argument may
//  or may not be needed.

// Communication specialization
/* Note that these are a bit more specialized than one would expect in a base class.
    However the communication pattern specified here is quite convenient and can be used in different apps.
*/

BaseObject.prototype.ajaxGetXml = function (url, data, callback, cache, failonoperations, isBackgroundRequest) {
    this.ajax({
        url: url,
        dataType: 'xml', // expect xml
        // contentType: "application/json; charset=utf-8", // This should not be needed in Get request
        data: data, // will be translated to parameters
        cache: ((cache) ? true : false),
        success: callback,
        failonoperations: failonoperations,
        isbackgroundrequest: isBackgroundRequest
    },"xml");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success")
 .Param("cache","...")
 .Param("failonoperations","...");

BaseObject.prototype.ajaxPostXml = function (url, data, callback, cache, sync, failonoperations, isBackgroundRequest) {
    this.ajax({
        url: url,
        type: "POST",
        dataType: 'xml', // we expect data and control notifications packed in xml
        contentType: "application/json; charset=utf-8", // we aresending stringified json as post body
        data: data,
        cache: ((cache) ? true : false),
        success: callback,
        async: !sync,
        failonoperations: failonoperations,
        isbackgroundrequest: isBackgroundRequest
    }, "xml");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success")
 .Param("cache","...")
 .Param("sync","Indicates if the call is async")
 .Param("failonoperations","...");

BaseObject.prototype.ajaxPostXmlSync = function (url, data, callback, cache) {
    this.ajaxPostXml(url, data, callback, cache, true);
}.Description("...")
 .Param("url","Url path")
 .Param("data","Data object to be sent")
 .Param("callback","...")
 .Param("cache","...");

// These are out of fashion - we communicate with XML packed json now
BaseObject.prototype.ajaxGetJson = function (url, data, callback, cache) {
    this.ajax({
        url: url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: data,
        cache: ((cache) ? true : false),
        success: callback
    }, "json");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success")
 .Param("cache","...");

BaseObject.prototype.ajaxPostJson = function (url, data, callback) {
    this.ajax({
        url: url,
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: data,
        cache: false,
        success: callback
    }, "json");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")