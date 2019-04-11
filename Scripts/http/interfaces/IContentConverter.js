
/**
	Denotes the API for conversion of content from one type to another
	It is possible that this interface will move to the core later.
*/
function IContentConverter() {}
IContentConverter.Interface("IContentConverter");
IContentConverter.prototype.ConvertContent = function(input) {
	throw "IContentConverter.ConvertContent is not implemented";
}