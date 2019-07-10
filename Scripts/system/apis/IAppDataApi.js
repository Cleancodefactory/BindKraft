/**
	This is an API interface and will be extended in future verstions
*/
function IAppDataApi() {}
IAppDataApi.Interface("IAppDataApi", "IManagedInterface");
/**
	Returns a new reader for content files IContentMemoryFile
*/
IAppDataApi.prototype.getContentReader = function(appClass) { throw "not  impl"; }.ReturnType("IAppDataApiContentReader");