function StaticContentCrate() {
	BaseObject.apply(this, arguments);
}
StaticContentCrate.Inherit(BaseObject, "StaticContentCrate");
StaticContentCrate.Implement(IContentCrate);
StaticContentCrate.$contents = {}; // { ctN: renderingN }
/**
	The content types provided.
	@param syncAsync {bool|null} - If null must return all content types (ActionUnitContentTypeEnum) the provider can return. If true - only those it can return synchronously, if false - only those it
									can provide asynchronously.
									
	@returns {Array<ActionUnitContentTypeEnum>}	- an array of all the content types the provider can return (honoring the syncAsync parameter)
*/
IContentCrate.prototype.availableContentTypes = function(syncAsync) { 
	var result = [];
	if (this.$contents != null) {
		for (var k in this.$contents) {
			if (this.$contents.hasOwnProperty(k)) {
				if (syncAsync !== false) {
					result.push(k);
				}
			}
		}
	}
	return result;
}
/**
	@param ct {ActionUnitContentTypeEnum} - the content type requested.
	@returns {any|Operation} - If the content is available synchronously returns it, if not returns an Operation that resolves to the content when complete.
*/
IContentCrate.prototype.getContent = function(ct) { 
	if (this.$contents.hasOwnProperty(ct)) {
		return this.$contents[ct];
	}
	return null;
}