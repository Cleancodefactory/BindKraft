


/*
	This class can supply one or more constructed templates.
	The templates are just jquery sets of elements extracted by data-keys from a base template containing multiple parts with different data-keys (sourcetemplates property).
	A single main key set (data-key) is supported for easy usage and is enough for the most scenarios.
	In some rare cases where multiple different templates need to be constructed from the same source templates by using multiple different key sets.
	This is supported through the indexed property keyset.
	Note that the standard routines for template source interfaces return null explicitly only when a missing template is addressed.
	Otherwise they return whatever is set for that keyset and it may be an empty one, but cannot be null.
*/
/*CLASS*/
function TemplateSource() {
	Base.apply(this, arguments);
}
TemplateSource.Inherit(Base, "TemplateSource");
TemplateSource.Implement(ITemplateSource);
TemplateSource.Implement(IItemTemplateSource);
TemplateSource.Implement(IFreezable);
TemplateSource.Implement(IFreezableHelper);
TemplateSource.ImplementProperty("containerelement", new InitializeStringParameter("Optional. If specified points to a data-key in the sourcetemplate whos children form the set of templates. If specified whenever a sourcetemplate is set, it is retained as wrapping and the set of templates is acquired from the specified element.", null));
TemplateSource.prototype.keysetchangedevent = new InitializeEvent("Fired every time any key set changes.");
TemplateSource.prototype.templatesourcechangedevent = new InitializeEvent("Fired when the source templates changes");
TemplateSource.prototype.wrappingchangedevent = new InitializeEvent("Fired whenever the wrapping changes");
TemplateSource.prototype.$init = function() {
	// Clean the internals always
	var internals = $(this.root).children().clone();
	// We will lose all the internals if the template is set as a parameter - not typical use for this element, but completely legal.
	if (this.get_sourcetemplates() == null) {
		this.$frozeEventsBlock(function() {
			this.set_sourcetemplates(internals);
		});
	}
	Base.prototype.init.call(this);
};
// TemplateSource.prototype.$wrapping = null;
// TemplateSource.prototype.get_wrapping = function() {
	// return this.$wrapping;
// }
// TemplateSource.prototype.set_wrapping = function(v) {
	// this.$wrapping = v;
	// this.wrappingchangedevent.invoke(this, null);
// }
// Indexed property - managing a main keyset by default (no index) or a specific keyset (with string index)
TemplateSource.prototype.$mainkeyset = null; // this must be an array
TemplateSource.prototype.$keysets = new InitializeObject("Additional keysets");
TemplateSource.prototype.get_keyset = function(idx) {
	if (idx == null) {
		return this.$mainkeyset;
	} else if (typeof idx == "string") {
		return this.$keysets[idx];
	}
	return null;
}
TemplateSource.prototype.set_keyset = function(idx, v) {
	this.$itemtemplates_cached = null;
	this.$template_cached = null;
	if (arguments.length > 1 && idx != null) { // Indexed case
		if (BaseObject.is(v, "Array")) {
			this.$keysets["" + idx] = v;
			this.keysetchangedevent.invoke(this, "" + idx);
		} else if (typeof v == "string") { // Assuming a single key
			this.$keysets["" + idx] = [v];
			this.keysetchangedevent.invoke(this, "" + idx);
		} else if (v == null) {
			this.$keysets["" + idx] = null;
			this.keysetchangedevent.invoke(this, "" + idx);
		} else {
			throw "Unsupported keyset value (must be array, string or null)";
		}
	} else {
		if (BaseObject.is(idx, "Array")) {
			this.$mainkeyset = idx;
			this.keysetchangedevent.invoke(this, null);
		} else if (typeof idx == "string") { // Assuming a single key
			this.$mainkeyset = [idx];
			this.keysetchangedevent.invoke(this, null);
		} else if (idx == null) {
			this.$mainkeyset = idx;
			this.keysetchangedevent.invoke(this, null);
		} else {
			throw "Unsupported keyset value (must be array, string or null)";
		}
	}
}
TemplateSource.prototype.$sourcetemplates = null;
TemplateSource.prototype.get_sourcetemplates = function() {
	return this.$sourcetemplates;
}
TemplateSource.prototype.set_sourcetemplates = function(v) {
	this.$itemtemplates_cached = null;
	this.$template_cached = null;
	this.$sourcetemplates = v;
	this.templatesourcechangedevent.invoke(this, null);
}
// Returns clonned result - no need to clone it further
TemplateSource.prototype.$get_sourcetemplates = function() {
	if (this.$sourcetemplates != null) {
		var cekey = this.get_containerelement();
		if (cekey != null && cekey.length > 0) {
			var container = this.$sourcetemplates.filter('[data-key="' + cekey + '"]');
			if (container.length == 0) container = this.$sourcetemplates.find('[data-key="' + cekey + '"]');
			return container.children().clone();
		} else {
			return this.$sourcetemplates.clone();
		}
	} else {
		return null;
	}
}
// Returns clonned result - no need to clone it further
TemplateSource.prototype.$wrapResult = function(jqset) {
	var cekey = this.get_containerelement();
	if (this.$sourcetemplates != null && cekey != null && cekey.length > 0) {
		var srcclone = this.$sourcetemplates.clone();
		var container = srcclone.filter('[data-key="' + cekey + '"]');
		if (container.length == 0) container = srcclone.find('[data-key="' + cekey + '"]');
		container.Empty();
		container.append(jqset);
		return srcclone;
	} else { // Nothing to wrap with
		return jqset; 
	}
}
TemplateSource.prototype.constructTemplate = function(keys) {
	var k = null;
	if (BaseObject.is(keys, "Array")) {
		k = keys;
	} else if (typeof keys == "string") {
		k = [keys];
	}
	var result = $();
	if (k != null) {
		var $sourcetemplates = this.$get_sourcetemplates();
		if ($sourcetemplates != null) {
			for (var i = 0; i < k.length; i++) {
				var some = $sourcetemplates.filter('[data-key="' + k[i] + '"]');
				if (some.length > 0) {
					for (var j = 0;j < some.length; j++) {
						result.push(some[j]);
					}
				}
			}
		}
	}
	return this.$wrapResult(result);
}
TemplateSource.prototype.$template_cached = null;
// These interfaces are implemented read-only (silently by swallowing all writes).
TemplateSource.prototype.get_template = function() {
	if (this.$template_cached == null) {
		this.$template_cached = this.constructTemplate(this.$mainkeyset);
	}
	return this.$template_cached.clone();
}
TemplateSource.prototype.set_template = function() {
	// Do nothing - no exception is thrown.
}
TemplateSource.prototype.$itemtemplates_cached = null;
TemplateSource.prototype.get_itemTemplate = function(idx) {
	if (idx == null) return this.get_template();
	if (this.$itemtemplates_cached == null) this.$itemtemplates_cached = {};
	if (this.$keysets != null && this.$keysets[idx] != null) {
		if (this.$itemtemplates_cached[idx] == null) {
			this.$itemtemplates_cached[idx] = this.constructTemplate(this.$keysets[idx]);
		}
		return this.$itemtemplates_cached[idx].clone();
	}
	return null;
}
TemplateSource.prototype.set_itemTemplate = function(idx, v) {
	// Do nothing - the template source cannot be changed through this Interface
}