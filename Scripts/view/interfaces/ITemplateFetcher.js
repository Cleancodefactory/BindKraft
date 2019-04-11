
/*
	Fetches a HTML fragment template for further usage through methods like
	ViewBase.cloneTemplate, .materialize and so on. It must return textual or raw DOM
	representation, ready for materialization.
	Where the template comes from? It depends on the implementation and can be anything
	from DOMConnector, a connector calling a server, fragment from the already existent DOM
	in the workspace, extract from some register and so forth.
*/
function ITemplateFetcher() {}
ITemplateFetcher.Interface("ITemplateFetcher");
ITemplateFetcher.prototype.fetchTemplate = function(callback) {
	throw "Not implemented";
}