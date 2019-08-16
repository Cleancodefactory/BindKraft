/**
	This is an API interface and will be extended in future verstions
*/
function IAppInfoApi() {}
IAppInfoApi.Interface("IAppInfoApi", "IManagedInterface");
/**
	Returns a new reader for content files IContentMemoryFile
*/
IAppInfoApi.prototype.getContentReader = function(appClass) { throw "not  impl"; }.ReturnType("IAppInfoApiContentReader");