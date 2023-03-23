

// This file is supposed to contain code that configures (or "kind of" configures) the framework thus specialising it for the current project.
// This approach enables the planning of some features to be performed in more abstract manner and thus avoid overspecialization and other
// negative effects.
// The configuration involves definitions of certain constants, definition and attachment of certain functions as callbacks in processing pipelines
// maintained behind the scenes by the framework. These routines and corresponding constants Implement the application specific OOB data management and other implicit
// operations ...

// NOTE!!! This file must be inncluded just after the core of the framework and before any more specialized classes are defined (including the cardspace management ones). 
// For example include this afte the lib and misc framework files.

// Enitity state configuration
// Binding.updateEntityState = true;
// Binding.entityStatePropertyName = "state";
// Binding.entityStateValues = DataStateEnum;
//{ 
//    Unchanged: "0",
//    Insert: "1",
//    Update: "2",
//    Delete: "3"
//};


/* GLOBAL CONSTANTS - ACCESSIBLE EVERYWHERE */
// Next gen content stuffing flags (the same as on the server side - these must be synched if something changes!!!)
var STUFFRESULT = {
    VIEWS:		0x0001,
    RESOURCES:	0x0002,
    LOOKUPS:	0x0004,
    RULES:		0x0008,
    SCRIPTS:	0x0010,
    DATA:		0x0020,
    METADATA:	0x0040,
    RVIEWS:		0x0080, // Read only views
    ALL:		0xFFFF
};
var PACKETSTUFFING_BRANCHESANDFLAGS = {
    views:		STUFFRESULT.VIEWS,
    resources:	STUFFRESULT.RESOURCES,
    lookups:	STUFFRESULT.LOOKUPS,
    rules:		STUFFRESULT.RULES,
    scripts:	STUFFRESULT.SCRIPTS,
    metadata:	STUFFRESULT.METADATA,
    rviews:		STUFFRESULT.RVIEWS
};


/* INFO:
    For each branch (kind) of cached data two functions can be defined (both are optional, but depending on the actual data usage they may be vital).
    
	_thiscall onApplyToInstance(item, hash) - invoked by the code that processes the ajax call to enable the caching mechanism to attach cached data to objects which use it.
        For example the ajax caller can invoke:  CacheManager.Default.applyToInstance(result, _object)
        where result is the entire result returned and the _object is the object (just created or already existing) for which data is fetched and needs to be provided for easy access from its methods
        The method is responsible to attach certain branches or items in them into properties, collections or whatever is designed to hold it on the instance passed as _object. The
        onApplyToInstance function is called with this set to the object to which the data needs to be attached, so it works like a member method of the target object.
    
	onCacheItem(oldItem, newItem, hash) - invoked implicitly by the Cache manager to enable custom actions with the parts of the data. The function receives the old and new
        branch of the data. The structure of the branches depends on the particular implementation and can be a set of items or a single item, tree etc. In any case the function receives the
        old branch or null (the previous entry in the cache) and the new entry and also receives the hash under which this is recorded in the cache manager.
		
        This function is usually responsible for making the data transfered in this branch usable - for example it can instantiate scripts in page, replace some items in a global data storage etc.
        The hash value can be used as an id if the item needs to be placed and replaced in the DOM as the cache content changes. If the branch contains a set of elements (such as scripts) the function
        may need to use both the hash and their dictionary key (in the set) for the <script> element's id.
*/
var PACKETSTUFFING_BRANCH_HANDLERS = {
    rviews: {},
    views: {},
    resources: {
        onApplyToInstance: function (item, hash) {
            if (item == null) return;
            // This is the point where we can attach the resources to the global store
            
            this._resources = item.data;
        }
    },
    lookups: {
        onApplyToInstance: function (item, hash) {
            if (this.is("ViewBase")) {
                this.lookups = item.data;
            }
        }
    },
    rules: {
        onCacheItem: (function () {
            // Keep some globals well hidden
            var currentId = 0;
            function _getnextId(prefix) {
                return (prefix + (currentId++));
            }
            return function (oldItem, newItem, hash) {
                if (oldItem != null && oldItem.domId != null) {
                    // Remove the old item
                    Function._rules[oldItem.domId] = null;
                    $("#" + oldItem.domId).remove();
                }
                if (newItem != null) {
                    if (Function._rules == null) Function._rules = {};
                    // Add the new item to the dom
                    newItem.domId = _getnextId("rule");
                    var script = '<script type="text/javascript" id="' + newItem.domId + '">' + ' Function._rules["' + newItem.domId + '"] = ' + newItem.data + ';' + '</script>';
                    $('body').append(script);
                }
            };
        })(),
        onApplyToInstance: function (item, hash) {
            if (item != null && item.domId != null && this.is("IRuleSource")) {
                this._rules = Function._rules[item.domId];
            }
        }
    },
    scripts: {
        onCacheItem: (function () {
            // Keep some globals well hidden
            var currentId = 0;
            function _getnextId(prefix) {
                return (prefix + (currentId++));
            }
            return function (oldItem, newItem, hash) {
                var n;
                if (oldItem != null && oldItem.halfDomId != null) {
                    // Remove the old items
                    for (n in oldItem) {
                        $("#" + oldItem.halfDomId + n).remove();
                    }

                }
                if (newItem != null && newItem.data != null) {
                    // Add the new item to the dom
                    newItem.halfDomId = _getnextId("script");
                    for (n in newItem.data) {
                        if (newItem.data[n] != null && newItem.data[n].length > 0) {
                            var script = '<script type="text/javascript" id="' + newItem.halfDomId + n + '">' + newItem.data[n] + ';' + '</script>';
                            $('body').append(script);
                        }
                    }
                }
            };
        })()
    },
    metadata: {
        onApplyToInstance: function (item, hash) {
            if (item != null && this.is("ViewBase")) {
                this.metadata = item.data;
            }
        }
    }
};








// Begin System specialization
/*virtual*/
System.prototype.loadSystemSettings = function () {
	this.settings = {};
};
/*virtual*/
// data - data to save, pass null to store the entire dc
// pathIn - nodepath to call, leave null to call the one from metadata, pass object to set query string params, if there is a path prop. in that object it is treated as nodepath.
GenericViewBaseEx.prototype.serverStoreData = function(data, pathIn, callback, callbackFailure, sync, failonoperations) { // The 4-th arg failure callback is optional
	if (this.metadata != null && typeof this.metadata == "object") {
		if (this.metadata.execinfo != null) {
			var execinfo = this.metadata.execinfo;
			if (typeof execinfo == "object") {
				if (execinfo.executor != null && execinfo.packageid != null) {
					var url;
					if (execinfo.opmode == "private") {
						url = execinfo.executor + "?$pwrite=" + execinfo.packageid;
					} else {
						url = execinfo.executor + "?$write=" + execinfo.packageid;
					}
					var path = null;
					if (pathIn != null) {
						if (typeof pathIn == "string") {
							path = pathIn;
						} else if (typeof pathIn == "object") {
							path = pathIn.path;
						}
					}
					if (path != null) {
						url += "/" + path;
					} else {
						if (execinfo.nodepath != null) {
							url += "/" + execinfo.nodepath;
						}
					}
				} else {
					alert("serverStoreData cannot determine packageId or/and executor");
					return;
				}
				
				var getparams = null;
				if (pathIn != null && typeof pathIn == "object") {
					getparams = pathIn.params;
				}
				
				var d;
				if (data == null) {
					d = this.get_data();
				} else {
					d = data;
				}
				
				this.ajax({
					url: url,
					type: "POST",
					dataType: 'xml', // we expect data and control notifications packed in xml
					contentType: "application/json; charset=utf-8", // we are sending stringified json as post body
					data: d,
					cache: false,
					getparams: getparams,
					success: function(result) {
						if (result.status.issuccessful && callback != null) {
							callback.call(this, result.data, path);
						} else {
							if (callbackFailure != null) {
								// note: please do not optimize these lines, they are this way for clarity
								if (callbackFailure.call(this, result.status, path) === false) {
									// Do nothing
								} else {
									Messenger.Default.post(new WorkspaceNotificationMessage("AJAX Error", "AJAX Error", "Operation failure reported: " + result.status.message, true));
								}
							} else {
								Messenger.Default.post(new WorkspaceNotificationMessage("AJAX Error", "AJAX Error", "Operation failure reported: " + result.status.message, true));
							}
						}
					},
					async: !sync
				}, "xml");
			} else {
				alert("serverStoreData cannot find any execinfo in the metadata");
			}
		} else {
			alert("serverStoreData cannot find metadata");
		}
	} else {
		alert("serverStoreData cannot find metadata. The metadata is usually loaded together with the data context returned by the server when the view opens. If you do not follow the appropriate pattern you cannot use serverStoreData and you should use ajaxPostXml directly.");
	}
}


function jb_initFramework(globalProvider) { // The global provider is being asked for certain parameters as a last resort through ad-hoc properties
    var gp = globalProvider;
    // Prepare cached data access points
    Function._rules = {};
	/* Deprecated in 2.20.0
    Binding.resources = new StringResources({}); // Pass the preloaded static system wide resources
    Binding.dynamicresources = new StringResources(); // Not currently used (Feb 2012). We should probably deprecate this
	*/
    // Init the cache manager singleton
    CacheManager.Default = new CacheManager(PACKETSTUFFING_BRANCHESANDFLAGS, PACKETSTUFFING_BRANCH_HANDLERS);
    if (System.Default().settings.DisableClientSideCaching) {
        for (var i in CacheManager.Default.disableCacheBranches) {
            CacheManager.Default.disableCacheBranches[i] = true;
        }
    }
    
    // AJAX standard handlers for the project
    function corehelper_addParameter(url, name, val) {
        if (val == null) { return url; }
        if (url != null) {
            if (url.indexOf("?") >= 0) {
                url = url + "&" + name + "=" + val;
            } else {
                url = url + "?" + name + "=" + val;
            }
        }
        return url;
    };
    function corehelper_escapeParamString(val) {
        if (val != null) {
            return ("'" + encodeURIComponent(val) + "'");
        } else {
            return "";
        }
    };
    function ajaxContextParameter(obj, param) {
        var p = null;
        if (BaseObject.is(obj, "IAjaxContextParameters")) {
            return obj.get_ajaxcontextparameter(param);
        }
        if (gp != null && BaseObject.is(gp, "IAjaxContextParameters")) {
            return gp.get_ajaxcontextparameter(param);
        }
        return null;
    }
    BaseObject.ajaxDecorateUrl = function (obj, url) {
		var onBehalfUserIdName = "sysonbehalfuser";
		var currentItemName = "syscurrentitem";
		
		url = corehelper_addParameter(url, onBehalfUserIdName, ajaxContextParameter(obj, AjaxContextParameterFlags.OnBehalfUserId));
		url = corehelper_addParameter(url, currentItemName, ajaxContextParameter(obj, AjaxContextParameterFlags.CurrentItemId));
        return url;
    };

    // Cleans the URL from the schema and the server, leaving only the serve path and the parameters
    var urlCleanUpExpression = /^(?:[a-z][a-z0-9\+\-\.]*\:\/\/\S*?(?:\/|\?))?(\S*)$/i;
    BaseObject.ajaxCleanURLForHashOperations = function (url) {
        var cleanedUrl = urlCleanUpExpression.exec(url);
        if (cleanedUrl != null) {
            return cleanedUrl[1];
        }
        return url;
    };
    
    function core_ajaxAddRequestParameters(settings, obj) {
        if (obj == null) return;
        for (var k in obj) {
            switch (typeof obj[k]) {
				// Remove the "no"-s to passthrough minimal encoding (if the server supports it)
                case "no_string":
                    settings.url = corehelper_addParameter(settings.url, k, corehelper_escapeParamString(obj[k]));
                    break;
                case "no_number":
                    settings.url = corehelper_addParameter(settings.url, k, (isNaN(obj[k]) ? "0" : obj[k].toString()));
                    break;
                default:
                    var v = obj[k];
                    if (v != null) {
                        settings.url = corehelper_addParameter(settings.url, k, obj[k].toString());
                    } else {
                        // TODO: Is the null a problem?
                        // settings.url = corehelper_addParameter(settings.url, k, "''");
                        settings.url = corehelper_addParameter(settings.url, k, null);
                    }
                    break;
            }
        }
    }
	// BEGIN CONNECTION PROBLEM RESOLUTION PIPELINE
	function core_ajaxTotalProblems(settings) {
		var problems = settings.confData.problems;
		var n = 0;
		for (var k in problems) {
			n += BaseObject.getProperty(problems, k + ".count", 0);
		}
		return n;
	}
	function core_ajaxProblemResolver(ownerObject, settings, problemKey, logMessage, problemData) { // must be called after the report, but before further processing.
		// Problem resolution constants
		var maxTotalProblems = 3;	// Total problems with the same ajax operation before giving up. (3 retries - give up before 4-th)
		var maxSpecificProblem = 2;	// The number of repetitions of a specific problem before giving up. (2 retries - give up before 3-d)
		var useRetry = ["zerostatus", "apperror"];
		
		var problems = settings.confData.problems;
		var problem = problems[problemKey];
		if (typeof problem == "object") {
			var ask = false;
			if (core_ajaxTotalProblems(settings) > maxTotalProblems) ask = true; 
			if (problem.count != null && problem.count > maxSpecificProblem) ask = true;
			// Schedule repetition for specific problems
			if (useRetry.findElement(problemKey) >= 0) {
				// We should centralize this with the probing request.
				settings.RequestRpeatCount = (BaseObject.getProperty(settings, "RequestRpeatCount",0) + 1);
				if (ask) {
					if (!confirm("Critical network or server side error has occured. The request has been retried, click OK to retry the request again or Cancel to stop trying.")) {
								settings.AbortAllProcessing = false;
								return false;
					}
				}
				var ar = new ControllableAsyncResult(EventPump.Default(), new Delegate( ownerObject, function() {$.ajax(settings);}));
				ar.ownerObject = ownerObject;
				ar.apply();
				jbTrace.log(problemKey + " retry is scheduled, this is attempt " + problem.count + " of total " + core_ajaxTotalProblems(settings));
				settings.AbortAllProcessing = true;
				return true;
			} 
		}
		return false;
	}
	function core_ajaxUnreportProblem(ownerObject, settings, problemKey) {
		var problems = settings.confData.problems;
		if (problems[problemKey] != null) {
			delete problems[problemKey];
		}
	}
	function core_ajaxReportProblem(ownerObject, settings, problemKey, logMessage, problemData) {
		var problems = settings.confData.problems;
		if (problems[problemKey] != null) {
			var problem = problems[problemKey];
			if (problem.count != null) {
				problem.count++;
			} else {
				problem.count = 1;
			}
			problem.data = problemData;
			if (!BaseObject.is(problem.log, "Array")) problem.log = [];
			problem.log.push(logMessage);
		} else {
			// First time
			problems[problemKey] = {
				count: 1, // How many times this has happened so far.
				log: [logMessage],
				data: problemData // Only the latest data is kept. We do not want to overdo it.
			};
		}
		return core_ajaxProblemResolver(ownerObject, settings, problemKey, logMessage, problemData);
	}
	// END CONNECTION PROBLEM RESOLUTION PIPELINE
	
    function core_ajaxOnStartOperation(settings) { // _thisCall (ajaxsettings) - this is the same object over which the ajaxGet/PostXml is called
        ShowProgressBeforeAjax();
        jbTrace.log("AJAX START: " + settings.url, 0xFF8002);
		// An empty skeleton object for custom extensions. Initialized for easy usage (without additional checks for existence).
		settings.confData = {
			problems: {
			}
		};
        var RequestContentFlags = "sysrequestcontent";
        settings.url = BaseObject.ajaxDecorateUrl(this, settings.url);

        var stuffFlags = STUFFRESULT.DATA;
        if (this.is("IAjaxQueryRequestContent")) {
            // Has a chance to stop the operation if data is not needed and everything is cached
            stuffFlags = this.getRequestContentFlags(settings);
        }
        stuffFlags = (stuffFlags == null) ? 0 : stuffFlags;
        var cachableFlags = CacheManager.Default.get_cachableflags();
		var overrideFlags = settings.requestedContentFlags || 0;
        stuffFlags = stuffFlags & ((cachableFlags ^ stuffFlags) | CacheManager.Default.onBeginRequest(settings));
		stuffFlags |= overrideFlags;
		settings.requestedContentFlags = stuffFlags;
		
        // EXPLANATION: Our policy is to be able to request what we need by returning the appropriate flags from IAjaxQueryRequestContent.getRequestContentFlags
        // It whould be possible to request everything we "might" ever need or only what we need "right now". For instance we may need everything when we want to open a view,
        // but from inside the view we will probably need only data and nothing else. In all the cases the cache manager acts as virtual server that can reset certain flags (if they are present)
        // because it has the corresponsing content cached.
        //stuffFlags = stuffFlags | CacheManager.Default.onBeginRequest(settings); // WAS WRONG!!!
        if (stuffFlags != null) {
            settings.url = corehelper_addParameter(settings.url, RequestContentFlags, stuffFlags.toString(16)); // include requests for content as hex number
        }

        if (this.is("IAjaxQueryStringParams")) {
            var params = this.get_queryParameters();
            if (params != null) {
                for (var i in params) {
                    if (BaseObject.is(params[i], "Array")) {
                        for (var j = 0; j < params[i].length; j++) {
                            settings.url = corehelper_addParameter(settings.url, i, params[i][j]);
                        }
                    } else {
                        settings.url = corehelper_addParameter(settings.url, i, params[i]);
                    }
                }
            }

        }
        // Info: We support an additional dedicated property in settings where parameters for GET can be passed
        if (settings.getparams != null && typeof settings.getparams == "object") {
            core_ajaxAddRequestParameters(settings, settings.getparams);
        }
        if (settings.type == "POST") {
            if (settings.data != null && typeof settings.data != "string" && !settings.serializationDone) {
                settings.data = JSON.stringify(settings.data);
            } else if (settings.data == null) {
                settings.data = "{}"; // Empty data object to distinguish from IE behaviour with NTLM empty body probing
            }
        } else {
            if (stuffFlags & STUFFRESULT.ALL) {
                if (settings.data != null && typeof settings.data != "string") {
                    core_ajaxAddRequestParameters(settings, settings.data);
                    settings.data = null;
                }
            } else {
                // Nothing to do - produce a fake result
                settings.immediateResult = {
                    status: {
                        issuccessful: true,
                        message: null,
                        returnurl: null,
                        httpSuccess: true,
                        httpStatus: 304,
                        httpStatusText: "Not Modified",
                        httpDescription: "Nothing is actually requested from the server. The request has been shortcircuited."
                    }
                };
                return true;
            }
        }
    };
    function core_nextgenAjaxRedirect(result, status) {
        if (result != null && result.status != null && !result.status.issuccessful) {
            if (result.status.returnurl != null && result.status.returnurl.length > 0) {
                window.location = mapPath(result.status.returnurl);
                // logout may be needed depending on the setup
            }
        }
    }
    function core_ajaxOnEndOperation(settings, result, status) { // _thisCall (ajaxsettings, result?)        
        HideProgressAfterAjax();
        settings.AbortAllProcessing = false;
        jbTrace.log("AJAX END: " + settings.url, 0xFF8020);
        var o = {
            status: {
                issuccessful: false, // defaults
                message: null,
                returnurl: null,
                httpSuccess: status.success,
                httpStatus: status.status,
                httpStatusText: status.statusText,
                httpDescription: status.description
            }
        };  // the result

        if (status.success) {
            if (result != null) {
                // Parse the XML packet
                var node, xml = $(result);
                node = xml.find("packet>status"); // Status result
                if (node != null && node.length > 0) {
                    var s = node.attr("issuccessful");
                    s = (s != null) ? parseInt(s, 10) : 0;
                    s = (!isNaN(s) && s != 0) ? true : false;
                    var r = node.attr("isreadonly");
                    r = (r != null) ? parseInt(r, 10) : 0;
                    r = (!isNaN(r) && r != 0) ? true : false;
                    var pr = node.attr("isprobing");
                    pr = (pr != null) ? parseInt(pr, 10) : 0;
                    pr = (!isNaN(pr) && pr != 0) ? true : false;
                    o.status = {
                        issuccessful: s,
                        isreadonly: r,
                        isprobing: pr,
                        message: node.find("message").text(),
                        returnurl: node.find("returnurl").text(),
                        title: node.find("title").text()
                    };
                    node = node.find("messages"); // JSON data
                    if (node != null && node.length > 0) {
                        o.status.messages = jQuery.parseJSON(node.text());
                    }
                    node = xml.find("packet>status>operations");
                    if (node != null && node.length > 0) {
                        o.status.operations = jQuery.parseJSON(node.text());
                    }
                } else { // Missing status is considered failure
                    o.status = {
                        issuccessful: false,
                        message: "Missing status section in the server response", // This string should not be localized (this is a core error and localization may not be working when this happnes)
                        returnurl: null
                    };
                }
                if (o.status.returnurl != null && o.status.returnurl.length == 0) o.status.returnurl = null; // normalize to null
                if (o.status.message != null && o.status.message.length == 0) o.status.message = null; // normalize to null
                // Add additional status info
                if (BaseObject.is(o.status.messages, "Array")) {
                    for (var i = 0; i < o.status.messages.length; i++) {
                        var m = o.status.messages[i];
                        InfoMessageQuery.emit(this, m);
                    }
                }
                if (!o.status.issuccessful) {
                    if (o.status.isprobing && (settings.RequestRpeatCount == null || settings.RequestRpeatCount < 3)) {
                        // repeat the request
                        jbTrace.log("received isprobing status - repeating request");
                        settings.AbortAllProcessing = true;
                        settings.RequestRpeatCount = 1;
                        $.ajax(settings);
                        return o;
                    }
                    if (window.g_JDebug) {
                        InfoMessageQuery.emit(this, "Server operation unsuccessful: " +
                            "HTTP status: " + (o.status.status || "") +
                            "\nstatus text: " + (o.status.message || "...") +
                            "\ndescription: " + (o.status.description || "...") +
                            ((settings.url != null) ? ("\nurl: " + settings.url) : ""), 0x8002, "error");
                    } else {
                        InfoMessageQuery.emit(this, (o.status.title || "Error occurred!") + " " + o.status.message || "General error", 0x8002, "error");
                    }
                    core_nextgenAjaxRedirect(o);
                    return o;
                } else {
                    if (settings.failonoperations != null && o.status.operations != null) {
                        for (var op in settings.failonoperations) {
                            if ((op != "skipErrorProcessing") &&
                                (settings.failonoperations[op] == o.status.operations[op])) {
                                settings.failRequest = {
                                    statusText: "Conditional failure",
                                    description: "The operation " + op + " failed while processing the request",
                                    skipErrorProcessing: settings.failonoperations.skipErrorProcessing
                                };
                                break;
                            }
                        }
                    }
                }

                node = xml.find("packet>views"); // HTML views
                var c;
                if (node != null && node.length > 0) {
                    c = node.children();
                    if (c.length > 0) {
                        o.views = {};
                        for (var i = 0; i < c.length; i++) {
                            o.views[c[i].tagName] = $(c[i]).text().trim();
                        }
                    }
                }
                node = xml.find("packet>rviews"); // HTML views (read-only aspect)
                if (node != null && node.length > 0) {
                    var c = node.children();
                    if (c.length > 0) {
                        o.rviews = {};
                        for (var i = 0; i < c.length; i++) {
                            o.rviews[c[i].tagName] = $(c[i]).text().trim();
                        }
                    }
                }
                node = xml.find("packet>data"); // JSON data
                if (node != null && node.length > 0) {
                    o.data = jQuery.parseJSON(node.text());
                }
                node = xml.find("packet>metadata"); // JSON metadata
                if (node != null && node.length > 0) {
                    o.metadata = jQuery.parseJSON(node.text());
                }
                node = xml.find("packet>rules"); // naked script { func: body, func: body ....}
                if (node != null && node.length > 0) {
                    o.rules = node.text();
                }
                node = xml.find("packet>resources"); // JSON object { key: val, key: val ... }
                if (node != null && node.length > 0) {
                    o.resources = jQuery.parseJSON(node.text());
                }
                node = xml.find("packet>lookups"); // JSON object, containing arrays: { l1: [{el1}, {el2} ...], l2: [{el1}, {el2} ...] }
                if (node != null && node.length > 0) {
                    o.lookups = jQuery.parseJSON(node.text());
                }
                node = xml.find("packet>scripts"); // Naked script to load into the page
                if (node != null && node.length > 0) {
                    c = node.children();
                    if (c != null && c.length > 0) {
                        o.scripts = {};
                        for (var i = 0; i < c.length; i++) {
                            o.scripts[c[i].tagName] = $(c[i]).text().trim();
                        }
                    } else {
                        o.scripts = node.text().trim();
                    }
                }
            } else {
                // Empty result - adjust the status according to the http status
                o.status.issuccessful = o.status.httpSuccess ? true : false;
            }
            CacheManager.Default.onEndRequest(settings, o);
        } else {
            o.status.issuccessful = false;
			if (o.status.httpStatus == 500) {
				if (core_ajaxReportProblem(this, settings, "apperror", "Application error (500)", null)) {
					if (status.xhr != null) {
						jbTrace.log("AJAX ERROR: HTTP status: " + status.xhr.status +
						"\nstatus text: " + o.status.httpStatusText +
						"\ndescription: " + o.status.httpDescription +
						((settings.url != null) ? ("\nurl: " + settings.url) : "") +
						"\n------\n" + status.xhr.responseText);
					} else {
						jbTrace.log("Application error - 500");
					}
					return o;
				}
            }
            else if (o.status.httpStatus == 401) {
                Class("AjaxGlobalHooks").Default().onHttpError(401, o).onsuccess(function(r) {
                    if (r === false) {
                        // Its done - nothing more to do.
                    } else {
                        window.location.href = mapPath('/account/signin') + '?returnUrl=' + encodeURIComponent(BKUrl.getInitialFullUrl());
                        settings.AbortAllProcessing = true;
                    }
                })
                //var local_apis = new LocalAPIClient();
                //local_apis.getAPI()
                //make a full request to the build in method in CoreKraft
                
            }
        }
		// if ((o != null && o.status != null && !o.status.issuccessful) && (o.status.httpStatus == 0)) {
		// 	if (core_ajaxReportProblem(this, settings, "zerostatus", "Request returned incorrect status 0", null)) {
		// 		// There is a problem resolution pending
		// 		jbTrace.log("received status - 0");
		// 		// settings.AbortAllProcessing = true; // The resolver must set this. We keep the line just FYI
		// 		return o;
		// 	}
		// }
        core_nextgenAjaxRedirect(o);
        return o;
    };
    

    function core_nextgenAjaxErrorHandler(xmlHttpReq, textStatus, errDescription, setttings) {
        if (this.LASTERROR) {
            this.LASTERROR("AJAX Error: " +
            "HTTP status: " + xmlHttpReq.status +
            "\nstatus text: " + textStatus +
            "\ndescription: " + errDescription +
            ((setttings.url != null) ? ("\nurl: " + setttings.url) : ""));
        };
        if (window.JBCoreConstants.JDebug) {
            if (BaseObject.is(this, "IStructuralQueryEmiter")) {
                
                
                this.throwStructuralQuery(new InfoMessageQuery("AJAX Error: " +
                                                    "HTTP status: " + xmlHttpReq.status +
                                                    "\nstatus text: " + textStatus +
                                                    "\ndescription: " + errDescription +
                                                    ((setttings.url != null) ? ("\nurl: " + setttings.url) : ""), 0x8001, "error"));

            } else {
                Messenger.Default.post(new WorkspaceNotificationMessage("AJAX Error", "AJAX Error",
                                                    "HTTP status: " + xmlHttpReq.status +
                                                    "\nstatus text: " + textStatus +
                                                    "\ndescription: " + errDescription +
                                                    ((setttings.url != null) ? ("\nurl: " + setttings.url) : "") +
                                                    "\n------\n" + xmlHttpReq.responseText, true));
            }
            jbTrace.log("AJAX ERROR: HTTP status: " + xmlHttpReq.status +
                        "\nstatus text: " + textStatus +
                        "\ndescription: " + errDescription +
                        ((setttings.url != null) ? ("\nurl: " + setttings.url) : "") +
                        "\n------\n" + xmlHttpReq.responseText);
        }
        var loc;
        if (xmlHttpReq.status == 302) {
            var loc = xmlHttpReq.getResponseHeader("Location");
            window.location.href = loc; // To avoid mix ups
        }
    };
    //BaseObject.ajaxDefaults["default"].error = core_nextgenAjaxErrorHandler;
    BaseObject.ajaxDefaults = {
        xml: {
            cache: false,
            error: core_nextgenAjaxErrorHandler,
            onStartOperation: core_ajaxOnStartOperation,
            onEndOperation: core_ajaxOnEndOperation,
            mapUrl: true
        }
    };
};
function InitCulture() {
    if (!System.Default().settings.CurrentLang) {
        System.Default().settings.CurrentLang = 'en';
    }
    var g_UTCDate = false;//default UTC time
    Globalize.Default = new Globalize(System.Default().settings.CurrentLang, g_UTCDate);
	Globalize.UTCMode = new Globalize(System.Default().settings.CurrentLang, true);
	Globalize.LocalMode = new Globalize(System.Default().settings.CurrentLang, false);
}











