



/*
	Controls using templates usually pick them from inside, but in most cases it is also practical to share them with others and even allow setting them from the outside.
	The ITemplateSource is the simplest way to achieve that. Most classes that use templates can treat those templates as one (e.g. the template is searched for marked segments
	used for items) and this way a concept for a single template is usually enough. Whenever more detailed access is necessary the IItemTemplateSource should be implemented.
	IItemTemplateSource should be also implemented to repeat the functionality of ITemplateSource whenever the role of the template used by the class is item oriented (items 
	repeated for example). This gives more semantic coherence even if it actually provides the same function through a different sets of methods.
*/
/*INTERFACE*/
function ITemplateSource() { }
ITemplateSource.Interface("ITemplateSource");
ITemplateSource.prototype.get_template = function () { return null; };
ITemplateSource.prototype.set_template = function (v) { throw "set_template is not implemented in " + this.fullClassType(); };