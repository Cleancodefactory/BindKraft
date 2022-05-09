



/*
	This Interface enables classes to share/receive templates for "items". The item is a concern of the class (usually some kind of control) and depending on the functionality there
	could be different items supported. The Interface follows the concept that there can be many kinds of items and main item. Without arguments the methods of this Interface must
	return/set the template for that main item kind. With arguments they access templates for particular item types.
	
	If the concept of a main item is not appropriate as a secondary approach (when applicable) the functionality can treat the no-argument(index) case as template for all items together.
	This kind of implementation should be done only if the previous concepts are non-applicable to the class being written.
	
	Another allowed approach is to treat the set operation without arguments as setting all templates to the same template. Get operation in such cases should return null. This kind
	of implementation should be done only if the previous concepts are non-applicable to the class being written.
*/
/*INTERFACE*/
function IItemTemplateSource() {}
IItemTemplateSource.Description("Template(s) for item(s).");
IItemTemplateSource.Interface("IItemTemplateSource");

// These two were planned as places for implementation that are called by the other two (the offical ones).
// TODO: We want to remove from the interface these two - please DON't USE THEM anymore.
IItemTemplateSource.prototype.get_itemTemplate = function(index_or_null) { throw "not implemented";}.Description("Returns the item template. If a paramater is specified it should return the corresponding template. Indexing support depends on the control and may not be implemented. Without index this should be the main template (whatever makes it main).");
IItemTemplateSource.prototype.set_itemTemplate = function(value_or_index, null_or_value) { throw "set_itemTemplate is not implemented in " + this.fullClassType(); } 
// These should be the official ones.
IItemTemplateSource.prototype.get_itemtemplate = function() { return this.get_itemTemplate.apply(this,arguments); }.Description("Alias for get_itemTemplate. Do not change.").Sealed();
IItemTemplateSource.prototype.set_itemtemplate = function() { return this.set_itemTemplate.apply(this, arguments); }.Description("Alias for set_itemTemplate. Do not change.").Sealed();

IItemTemplateSource.prototype.get_singletemplateconsumerkey = function() { throw "not impl";}
IItemTemplateSource.prototype.set_singletemplateconsumerkey = function(v) { throw "not impl";}

IItemTemplateSource.collectItemTemplatesFromDom = function(dom) {
	dom = DOMUtil.toDOMElement(dom);
	if (dom instanceof HTMLElement) {
		var b = false;
		var result = {};
		var containers = [];
		for (var i = 0; i < dom.children.length; i++) {
			var el = dom.children[i];
			if (el instanceof HTMLElement) {
				if (/^\w+-\w+(-\w+)?$/.test(el.tagName)) {
					containers.push(el);
				}
			}
		}
		if (containers.length > 0) {
			for (var i = 0; i < containers.length; i++) {
				b = true;
				result[containers[i].tagName.toLowerCase()] = containers[i].innerHTML;
			}
			if (b) return result;
		} else {
			var key;
			for (var i = 0; i < dom.children.length; i++) {
				var el = dom.children[i];
				if (el instanceof HTMLElement) {
					key = el.getAttribute("data-key");
					if (key != null && key.length > 0) {
						b = true;
						result[key] = el.outerHTML;
					}
				}
			}
			if (b) return result;

		}
	} 
	return null;
}
