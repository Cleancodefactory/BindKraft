/**
	This interface is introduced in 2018. Its purpose is to use the connector based template fetching mechanism instead of plain strings even for fallbacks (enf everyting else) unlike 
	the IWindowTemplate which is already considered dprecated and will be obsoleted soon.
	
	The interface is implemented by BaseWindow and is responsible for:
	- specifying an ultimate fallback template
	- default template for the particular window class
	- preferred template for the particular instance.
	It is queried by the BaseWindow early (in the constructor). All the templates are specified as Connectors (like TemplateConnector, DOMConnector, StringConnector etc.) - the connectors must return 
	a string resource.
	
	Some things to consider:
	There is a temptation to merge all templates through an interface like this one - this means components and controls for the views for instance, but if this ever happens we will preserve compatibility
	somehow. Yet, it is unlikely that this will happen variety of reasons: the template selection follows very different paths in both cases for a reason; Dynamic changes of the template are unlikely in
	windows in constrast to components, where this can be even a techinique that implements the desired functionality in a smart manner; Duw to the different purposes of windows and components ther lifecycles 
	are drastically different from the developer's point of view.
*/

function IWindowTemplatePreferences() {}
IWindowTemplatePreferences.Interface("IWindowTemplatePreferences");
/**
	Instance characteristic - can be set from outside. For cases when passing the template together with 
*/
IWindowTemplatePreferences.prototype.get_preferredwindowtemplate = function() { throw "not implemented"; }
IWindowTemplatePreferences.prototype.set_preferredwindowtemplate = function(v) { throw "not implemented"; }
/**
	The standard (default) template for the window class
*/
IWindowTemplatePreferences.prototype.get_classwindowtemplate = function() {throw "not implemented";}
IWindowTemplatePreferences.prototype.set_classwindowtemplate = function(v) {throw "not implemented";}
/**
	Class characteristic - MUST be set with something that does not involve fetching.
*/
IWindowTemplatePreferences.prototype.get_fallbackwindowtemplate = function() {throw "not implemented";}
//IWindowTemplatePreferences.prototype.set_fallbackwindowtemplate = function(v) {throw "not implemented";}
