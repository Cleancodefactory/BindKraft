/*
	As with others during the auditing the implementation has been moved to IPlatformUrlMapperImpl
	UPDATE YOUR CODE if you depended on the interface, just change
	XXX.Implement(IPlatformUrlMapper) 
	to
	XXX.Implement(IPlatformUrlMapperImpl) 
*/

// This is ready to use interface mostly for Base derived classes (planned with them in mind, but can be used in others as well)
// The purpose of the interface is to translate standard module URL to full usable URL
// E.g. post:read:mynodeset/node1.node2 to something like /node/mymodle/mynodeset/node1.node2
// This should be used in code that allows the developer who uses it to specify such an abstract URL and separately to which module and server it belongs
// Note that servername is currently not supported! It is just reserved for future use.

function IPlatformUrlMapper() {}
IPlatformUrlMapper.Interface("IPlatformUrlMapper");
IPlatformUrlMapper.prototype.get_modulename = function() { throw "not impl"; }
IPlatformUrlMapper.prototype.set_modulename = function(v) { throw "not impl"; }
IPlatformUrlMapper.prototype.get_servername = function() { throw "not impl"; }
IPlatformUrlMapper.prototype.set_servername = function(v) { throw "not impl"; }
IPlatformUrlMapper.prototype.mapModuleUrl = function(url) { throw "not impl"; }
IPlatformUrlMapper.prototype.mapResourceUrl = function(url) { throw "not impl"; }

// Static helper methods
IPlatformUrlMapper.mapModuleUrl = function(url, module, server) {
	var r;
	if (module == null || module.length == 0) {
		return url;
	} else {
		return IPlatformUtility.standardModuleUrlParse(url,module,server)?.mapped;
	}
}
IPlatformUrlMapper.mapResourceUrl = function(url, module, server) {
	var r;
	if (module == null || module.length == 0) {
		return url;
	} else {
		return IPlatformUtility.standardResourceUrlParse(url,module,server)?.mapped;
	}
}