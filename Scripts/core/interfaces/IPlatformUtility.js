/*
	Platform specific URL genration for BindKraft aware servers.
	
	moduleUrl static method must be implemented in the platform module for the system adapted to run with this home server.
	Example:
	IPlatformUtility.moduleUrl = function( moduleName, readWrite, pack, nodePath) { ... implementation ...}
	If additional servers have to be supported one such function (unnamed) has to be registerd uder servers e.g.
	IPlatformUtility.servers["myserver2"] = function( moduleName, readWrite, pack, nodePath) { ... implementation ...}
	
	These functions should be able to construct the URL for ajax requests from the 4 parts supplied:
	module name - the name of the BindKraft module on the server (should be case insesitive - see the notes about nodepath, the same applies here for the allowed names)
	readwrite - a string with first character 'w' for write and 'r' for read. If not supplied (null) read is to be assumed
	pack - name of the nodeset in which is th entry point (also called end point in service oriented terms) desired (case insensitive - see below)
	nodepath - can be omited if the root of the specified nodeset is the entry point. If some subnode is the end point a string with chain
				of node names delimited with '.'. By default there is a strongly recommended limitation of the characters allowed in node names:
				[a-z0-9_\-] and this should be processed as case insensitive (some WEB servers or WEB applications may be case insensitive and it is not
				a good idea to mix both, so the recommendation aims at bypassing the potential problems this can cause.
				
	The supplied standardModuleUrlParse function also supports the so called 'module url' which is a way to specify the 4 parts in a single string. This is useful
	in code that implements reusable components that get the URL as parameter - a single string is easier to use, so intrenally they use this method to support these
	module Url from which the actual can be generated with the same moduleUrl routine.
	
	
	HOW TO USE

		1. Initialize system wide the $platformBaseModulesPath and $platformProcessorName
			Best places to do so will be adapters or modules-configuration.js (in the modules root directory)
			Do this there:
			
			IPlatformUtility.prototype.$platformBaseModulesPath = "/your modules base path eg. /apps/modules/";
			IPlatformUtility.prototype.$platformProcessorName = "the path to the processor e.g. /apps/pack.asp";
		
		2. Write IPlatformUtilityImpl implementer like the one below. You may need to change the way the URL is generated
			The best place to do so is in the platformutility module.

	function IPlatformUtilityImpl() {}
	IPlatformUtilityImpl.InterfaceImpl(IPlatformUtility);
	IPlatformUtilityImpl.classInitialize = function(cls,moduleName) {
		cls.prototype.$platformModuleName = moduleName;
		cls.prototype.moduleUrl = function(readWrite, pack, nodePath) {
			var r = this.$platformProcessorName + "?$" + ((readWrite.charAt(0) == "w")?"write":"read") +
				"=" + this.$platformBaseModulesPath + this.$platformModuleName + ":" + pack;
			if (nodePath != null) r += nodePath;
			return r;
		}
	}




	
*/

function IPlatformUtility() {}
IPlatformUtility.Interface("IPlatformUtility");
// DEPRECATED - too specific and hard to compute under some circumstances
//IPlatformUtility.prototype.$platformBaseModulesPath = "{path not set}";
//IPlatformUtility.prototype.$platformProcessorName = "{path not set}";
// CURRENT
IPlatformUtility.prototype.$platformModuleServer = null;
IPlatformUtility.prototype.$platformModuleName = null;
IPlatformUtility.prototype.moduleUrl = function(readWrite,  pack, nodePath) {
	throw "Not implemented.";
}
IPlatformUtility.prototype.resourceUrl = function(restype, path) {
	throw "Not implemented.";
}

// STATIC METHODS for implementation for the specific platform

// TODO:  Nodeset resolution routine (implement for the specific platform(s) in the PlatformUtility module!)
// function (string moduleName,string readWrite,string nodeset[, string nodePath]) => string url
IPlatformUtility.moduleUrl = function (moduleName, readWrite, pack, nodePath) {
	throw "Not implemented. A IPlatformUtility.moduleUrl must be implemented and loaded in the PlatformUtility module to supply URL construction logic for your specific setup.";
}.Description("The default URL constructor - constructs an URL to an entry point as string");

// TODO:  Resource (usually public) fetching URL generator routine (implement for the specific platform(s) in the PlatformUtility module!)
// function (string moduleName,string readWrite,string nodeset[, string nodePath]) => string url
// Supported resource types (system defined)
//	$template - static templates, usually pre-loaded and never unloaded, typically partial html files
//	$view	  - work templates, potentially dynamically changed for lon running server platforms (cache controlled)
//	$images	  - various images for UI usage
//  $docs	  - documentation files (.md/.html/.txt and others) served as textual content.
// User defined resources must use keynames without starting '$' which are reserved and defined by BindKraft

IPlatformUtility.resourceUrl = function (moduleName, readWrite, restype, resPath) {
	throw "Not implemented. A IPlatformUtility.resourceUrl must be implemented and loaded in the PlatformUtility module to supply URL construction logic for your specific setup.";
}.Description("The default resource URL constructor - constructs an URL to a resource as string");

// If the system is using multiple BindKraft servers - an function structured like moduleUrl for each of them.
IPlatformUtility.servers = {};
IPlatformUtility.resourceservers = {};

// STATIC standard methods presenting an abstract independent of the specific URL schema URL-like constructs

// 1.Nodesets

/*
	Abstrasct nodeset URL looks like this:
	[post:|get:][read|write]/<pack_name>[/<nodepath>]
	it is parsed internally (or explicitly if you write low level system utilities) by
	IPlatformUtility.standardModuleUrlParse function to this structure:
	{
			action: "write"|"read",
			method: "post"|"get",
			pack: 	<nodesetname>,
			nodepath: <nodepath>|null,
			server: <servername>|null, // When null, this is the home server
			module: <modulename>|null,
			start: 	<startindex>, // where the URL def starts in the passed string (currently it is always 0)
			length: <urllength>,  // how long is the abstract URL
			// Generated*:
			mappedRaw: <rawURL>,  // The generated URL through the PlatformUtility supplied IPlatformUtility.moduleUrl routine
			mapped: <verbedURL>	  // like mappedRaw, but starting with  post: if post method is specified in the abstract URL (this prefix is supported by various routines in BondKraft)
	}
	* - the part after the parsed part of the abstract URL is retained and appended to the generated url. It is not recommended to use that option to supply query string parameters.
	
	
	*/

// [post:|get:][read|write]/<pack_name>[/<nodepath>]
// Example: post:read/mydefinition/node1.node2
//			post:write/mydef2/node1?param1=v1&param2=v2
//			read/def3
IPlatformUtility.standardModuleUrlParse = function(url, module, server) {
	var re = /^(?:(post|get)\:)?(?:(read|write)\/)?([a-z0-9_\-]+)(?:\/([a-z0-9_\-\.]+))?(?=$|\?.*$)/i;
	var m = re.exec(url);
	if (m != null) {
		
		var r = {
			// In case different composition is needed
			action: ((m[2] == "write")?"write":"read"),
			method: ((m[1] == "post")?"post":"get"),
			pack: m[3],
			nodepath: ((m[4] == null || m[4].length == 0)?null:m[4]),
			server: (server?server:null), // When null this is the home server
			module: (module?module:null),
			start: m.index, // where is found
			length: m[0].length, // how long it is
			// URL with replaced beginning and mapped id module is supplied, otherwise these will be null.
			// Without the post:/get:
			mappedRaw: null,
			mapped: null
		};
		if (module != null && module.length > 0) {
			r.mappedRaw = IPlatformUtility.standardModuleUrlMap(url, r, false);
			r.mapped = IPlatformUtility.standardModuleUrlMap(url, r, true);
		}
		return r;
		
	} else {
		return null; // Error should be handled outside. We don't know if the component that uses this wants to fall back to something or not.
	}
}
// Parses Pseudo-URL - see above standardModuleUrlParse and returns real url
IPlatformUtility.standardModuleUrlMap = function(url, parsedURL, bWithMethod) {
	// Can we do some clever error handling here?
	var murlproc = ((parsedURL.server != null)?IPlatformUtility.servers[parsedURL.server]:IPlatformUtility.moduleUrl);
	var mpart = murlproc(parsedURL.module, parsedURL.action,parsedURL.pack,parsedURL.nodepath);
	if (mpart == null) BaseObject.LASTERROR("Failed to map a node logical URL. url=" + url,"IPlatformUtility.standardModuleUrlMap");
	var result = mpart + url.slice(parsedURL.length);
	if (bWithMethod && parsedURL.method != "get") {
		return (parsedURL.method + ":" + result);
	}
	return result;
}

// 2. Resources

// [post:|get:][(read|write)/]<restype>/<respath>
// Example: post:read/$image/baseimages/img.jpg
//			$template/dialogs/namedlg
//			post:write/$image/userimgs/imagex.jpg
//	Writable resources are not typically (and currently) supported through this interface, but the syntax exists just in case.
IPlatformUtility.standardResourceUrlParse = function(url, module, server) {
	// TODO: Add some restrictions to the respath
	var re = /^(?:(post|get)\:)?(?:(read|write)\/)?([a-z0-9_\$\-]+)(?:\/([a-z0-9\$_\-\.\/]+))(?=$|\?.*$)/i;
	var m = re.exec(url);
	if (m != null) {
		
		var r = {
			// In case different composition is needed
			action: ((m[2] == "write")?"write":"read"),
			method: ((m[1] == "post")?"post":"get"),
			restype: m[3],
			respath: ((m[4] == null || m[4].length == 0)?null:m[4]),
			server: (server?server:null), // When null this is the home server
			module: (module?module:null),
			start: m.index, // where is found
			length: m[0].length, // how long it is
			// URL with replaced beginning and mapped id module is supplied, otherwise these will be null.
			// Without the post:/get:
			mappedRaw: null,
			mapped: null
		};
		if (module != null && module.length > 0) {
			r.mappedRaw = IPlatformUtility.standardResourceUrlMap(url, r, false);
			r.mapped = IPlatformUtility.standardResourceUrlMap(url, r, true);
		}
		return r;
		
	} else {
		return null; // Error should be handled outside. We don't know if the component that uses this wants to fall back to something or not.
	}
}

// Parses Pseudo resource-URL - see above standardModuleUrlParse and returns real url
IPlatformUtility.standardResourceUrlMap = function(url, parsedURL, bWithMethod) {
	// Can we do some clever error handling here?
	var murlproc = ((parsedURL.server != null)?IPlatformUtility.resourceservers[parsedURL.server]:IPlatformUtility.resourceUrl);
	var mpart = murlproc(parsedURL.module, parsedURL.action,parsedURL.restype,parsedURL.respath);
	if (mpart == null) BaseObject.LASTERROR("Failed to map a resource logical URL. url=" + url,"IPlatformUtility.standardResourceUrlMap");
	var result = mpart + url.slice(parsedURL.length);
	if (bWithMethod && parsedURL.method != "get") {
		return (parsedURL.method + ":" + result);
	}
	return result;
}