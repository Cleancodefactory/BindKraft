/*
    File: configuration.js
    The root most file of the workspace javascript construct.

    This file contains some mode adjustment constants which affect the general behavior of the framework.
    Also some anchor objects are created here to make them available as early as possible.
	
	To run the framework with customized settings include a javascript file before the framework
*/
'strict'

var JBFrameworkVersion = { 
	core: { major: 2, minor: 27, revision: 0 }
};
// Apply default settings, can be overriten (see in the header of the file how)
(function() {
	var settings = window.g_BindKraftConfiguration || window.JBCoreConstants || {};
	
	// Add new constants here and describe them.
	// Copy the list in the settings example file 
	var defaults = {
		"InstanceData": {},
		"Debug": false,
		"LastErrorConsoleLog": true,
		"CheckTypeDuplicates": true, // Enforces a number of checks for defined types - duplicate type names, method names (when implementing interfaces) etc. Will throw exceptions (not all at once)
		"SystemSchedulerFreq": 25, // 25 milliseconds for the system task scheduler
		"ClientViewTasksMaxAge": 120000, // 2 minutes max life of visual asynchronous tasks. Lower is recommended, but this is good for debugging and other dev.
		"PagersAutoNormalize": false, // For the pagers (and similar controls working with data areas) which support normalization of the data area pos. sets the normalization mode.
		"ReverseSources": false, // 1.4.3: Reverses the update sources to update from leaf-to-root. This will NOT (EVER!) become default in future versions.
		// Why? Because one of the features we need is the ability of the bindings to literally create data structures and these need to grow from roots.
		"StrictParameters": false, // Recommended to turn off this in production (it costs performance), but keep it on in dev. envs. (could cause some false positives)
		"CompileTimeConsoleLog": true, // Log to browser console compile time messages, deploy recommended: false
		"CompileTimeLogSize": 1000, // Number of log entries in the buffer (to enable viewing), deploy recommended: 50
		"CompileTimeLogTypes": {
		  // Which kind of messages to log (CompileTime console logger honors this, the others should too)
		  "log": false,
		  "warn": true,
		  "err": true,
		  "info": false,
		  "notice": true,
		  "trace": false
		},
		"CompileTimeThrowOnErrors": true,
		"CollectDiagnostics": false,
		"CompileTimeValidationTasks": true, // Better disable this for production. If true additional compile time validation checks are runned to log (mostly warnings) information for discovered problems.
		"AlwaysCalcBasePath": false, // Always set g_ApplicationBasePath to the base path calculated from the initial load URL, if false this will happen only if the variable is missing.
		"DontSetPageBase": false, // Do not create/replace the base element of the workspoace page and its href.
		"StrictLocalProxies": true,
		"JQFallBack": false, // OBSOLETE, will be removed soon. Where available use the JQuery fallbacks. This will be removed when all dependencies on jquery are removed.
		"DontCatchTickerExceptions": false, // v:2.21.0
		"EventHelperRegisterProp": "$__eventHelperRegister", // Root object on which helper registers attach (this enables us to reserve only a single name on the main this)
		"TrackingDefaultMode": "pointer", // Sets the PointerTracker to simulate capture with mouse or pointer messages (or touch ad hoc implementation in future)
		"TrackTouchEvents": true, // Enable disable touch events tracking by PointerTracker and all the dependent classes
		"NormalOperationTimeout": 30000, // Whenever timeout is set to operations, this one is used by default
		"LongOperationTimeout": 120000, // Timeout for operations that require longer one.
		"entityStatePropertyName": "state",
		"updateEntityState": false
	  };
	
	for (var k in defaults) {
		if (settings[k] == null) {
			settings[k] = defaults[k];
		}
	}
	window.JBCoreConstants = settings;
})();

// Anchor for the diagnostic - if it does not exists they are not collected - use the constant.
if (window.JBCoreConstants.CollectDiagnostics) {
	var DIAGNOSTICS = {
		all : {},
		totalCounter: 0 // All objects
	};
}

// Anchor for global DOM related framework routines. This must be treated as non-registered (non-reflectible) static class.
// TODO: It might be better to move this anchor further inside the framework - where it is really used.
//      Reasons why is it still here: The obliteration process and the means to invoke it from the DOM.
function JBUtil() { }; 

// !V:2.14.0 - WILL BE DEPRECATED SOON with the new ajax API completion
// Stub (fallback) for the supported system-wide ajax parameters. These should be replaced in on an adapter level with the actual setActive
// For more information lookup answers in the documentation related to the support for automatic extraction of ajax related parameters common for the entire system
var AjaxContextParameterFlags = {
};