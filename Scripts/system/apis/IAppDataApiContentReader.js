function IAppDataApiContentReader() {}
IAppDataApiContentReader.Interface("IAppDataApiContentReader", "IManagedInterface");
/**
	@param filename 			 	{string} 	The file name to read - full path from te app's directory e.g. "texts/news/news1"
	@param [requiredContentType]	{string}	The required contentType, if specified null will be returned if the file's contentType is different
*/
IAppDataApiContentReader.prototype.content = function(filename, requiredContentType) { throw "not impl"; }
IAppDataApiContentReader.prototype.contentTypeOf = function(filename) { throw "not impl"; }
IAppDataApiContentReader.prototype.isAvailable = function(filename) { throw "not impl"; }
IAppDataApiContentReader.prototype.restore = function(filename) { throw "reserved - should just return (not implemented)"; }
