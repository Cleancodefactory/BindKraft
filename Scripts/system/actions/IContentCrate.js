/**
	IContentCrate interface is implemented by objects that are provided as sources of content that is (or at least can) be provided in multiple formats.
	Instead of the content or all its representations in different formats such an object is supplied so that the content can be requested in one of the formats later.
	This enables implementations that do not consume memory for copies from which most will remain unused - the recommended implementation is to generate the requested representations
	when requested - i.e. when the getContent is called.
*/
function IContentCrate() {}
IContentCrate.Interface("IContentCrate");
/**
	The content types provided.
	@param syncAsync {bool|null} - If null must return all content types (ActionUnitContentTypeEnum) the provider can return. If true - only those it can return synchronously, if false - only those it
									can provide asynchronously.
									
	@returns {Array<ActionUnitContentTypeEnum>}	- an array of all the content types the provider can return (honoring the syncAsync parameter)
*/
IContentCrate.prototype.availableContentTypes = function(syncAsync) { throw "not impl"; }
/**
	@param ct {ActionUnitContentTypeEnum} - the content type requested.
	@returns {any|Operation} - If the content is available synchronously returns it, if not returns an Operation that resolves to the content when complete.
*/
IContentCrate.prototype.getContent = function(ct) { throw "not impl"; }