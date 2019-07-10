/*
	This interface is for a local API dealing with URL command URL generation and querying.
	It is implemented in sync with their processing and uses the same settings
*/
function IGenerateCommandUrl() {}
IGenerateCommandUrl.Interface("IGenerateCommandUrl", "IManagedInterface");
IGenerateCommandUrl.prototype.getAliasesForApp = function(appcls, id) { throw "not impl"; }
IGenerateCommandUrl.prototype.generateUrl = function(usealias, owncommands, options) { throw "not impl"; }
IGenerateCommandUrl.prototype.getCommandURLGenerator = function(usealias, options) { throw "not impl"; }