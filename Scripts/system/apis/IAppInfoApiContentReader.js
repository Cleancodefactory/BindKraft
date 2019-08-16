function IAppInfoApiContentReader() {}
IAppInfoApiContentReader.Interface("IAppInfoApiContentReader", "IManagedInterface");
/**
	@param filename 			 	{string} 	The file name to read - full path from te app's directory e.g. "texts/news/news1"
	@param [requiredContentType]	{string}	The required contentType, if specified null will be returned if the file's contentType is different
*/
IAppInfoApiContentReader.prototype.content = function(filename, requiredContentType) { throw "not impl"; }
IAppInfoApiContentReader.prototype.contentTypeOf = function(filename) { throw "not impl"; }
IAppInfoApiContentReader.prototype.isAvailable = function(filename) { throw "not impl"; }
IAppInfoApiContentReader.prototype.restore = function(filename) { throw "reserved - should just return (not implemented)"; }
