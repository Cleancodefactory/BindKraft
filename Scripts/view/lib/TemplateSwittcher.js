

/*CLASS*/

function TemplateSwitcher(domEl) {
    ViewBase.apply(this, arguments);
    this.$template = null;
}

TemplateSwitcher.Inherit(ViewBase, "TemplateSwitcher");
TemplateSwitcher.Implement(ITemplateSource);
TemplateSwitcher.Implement(IItemTemplateSource);
TemplateSwitcher.prototype.obliterate = function() {
    delete this.$template;
    ViewBase.prototype.obliterate.call(this);
};
TemplateSwitcher.prototype.templateSource = null;
TemplateSwitcher.prototype.requireData = null;
TemplateSwitcher.ImplementProperty("requiredata", new InitializeBooleanParameter("IF true remains empty if set_item sets null", null),"requireData");
TemplateSwitcher.prototype.multiTemplate = false;
TemplateSwitcher.ImplementProperty("multitemplate", new InitializeBooleanParameter("Enables/disables support for multi rooted templates. Default is false.", false), "multiTemplate");
TemplateSwitcher.prototype.select = null;
TemplateSwitcher.ImplementProperty("select", new Initialize("A callback to choose the template to use depending on the data. Provided with bindind like data-on-$select={bind source=some path=MethodName}", null), "select");
TemplateSwitcher.prototype.nullTemplate = new InitializeStringParameter("The data-key of the template for missing/null data. Use with nullTemplateSwitch internal selector.", "null");
TemplateSwitcher.prototype.notNullTemplate = new InitializeStringParameter("The data-key of the template for existing data. Use with nullTemplateSwitch internal selector.", "data");
TemplateSwitcher.prototype.$template = null;
TemplateSwitcher.prototype.isTemplateRoot = function() { return false; };
TemplateSwitcher.prototype.switchevent = new InitializeEvent("Fired every time the template is instantiated/reinstnatiated and data updated");
TemplateSwitcher.prototype.preswitchevent = new InitializeEvent("Fired every time the before template is instantiated/reinstnatiated and data updated");
// the repeater cannot be used as template root! This will cause endless recursion.
TemplateSwitcher.prototype.$init = function() {
    // In the repeater we need to cut the innerHTML and keep it as a template for repeating items
    var el = $(this.root);
    if (this.get_template() == null) {
        var c = el.Clean().children();
        this.set_template(c);
        el.Empty();
        // c.Remove();
    }
    this.init();
    this.rebind(); // Default behaviour, items controls should override this
};
TemplateSwitcher.prototype.getTemplateByKey = function(v) {
    var a = $(this.get_template());
    var el;
    if (a != null && a.length > 0) {
        for (var i = 0; i < a.length; i++) {
            el = $(a[i]);
            if (el.attr("data-key") == v) return el;
        }
    }
    return null;
};
TemplateSwitcher.prototype.$item = null;
TemplateSwitcher.prototype.$selectTemplate = function() {
    // dummy selection - 1-st template
    if (this.select == null) {
        var tmls = this.get_template();
        return tmls;
    } else {
        if (BaseObject.is(this.select, "Delegate")) {
            return this.select.invoke(this, this.get_template());
        } else {
            return this.select.call(this, this, this.get_template());
        }
    }
};
// ... data-on-$select="{bind source=<any> path=selectorMethod}"
TemplateSwitcher.prototype.$createChild = function() {
    var el = $(this.root);
    el.Empty();
    if (BaseObject.parseBool(this.requireData) && this.get_item() == null) return;
    var tml = this.$selectTemplate();
    if (tml == null) return;
    var o = ViewBase.cloneTemplate(el, tml, this.get_item(), this.multiTemplate);
};
// Public methods
TemplateSwitcher.prototype.get_template = function() {
    if (this.templateSource != null) {
		// TODO: findParent is obsolete now - use getRelatedElements/getRelatedObjects ( <parent_or_special_key>[/<childinparent_key] )
        var o = this.findParent(this.templateSource);
        if (BaseObject.is(o, "ITemplateSource")) {
            return o.get_template();
        } else if (BaseObject.is(o, "BaseObject")) {
            return null;
        }
        return o;
    } else {
        return this.$template;
    }
};
TemplateSwitcher.prototype.set_template = function(v) { this.$template = v; };
TemplateSwitcher.prototype.set_itemTemplate = function(n,v) {
	if (arguments.length > 1) { // Indexed
		if (n == null) { // Equivalent to "everything"
			this.set_template(v);
		} else if (typeof n == "string") {
			var templates = $(this.get_template());
			for (var i = 0; i < templates.length; i++) {
				var el = $(templates[i]);
				if (el.attr("data-key") == n) {
					//templates
					el.Remove();
				}
			}
			if (v != null) {
				var t = $(v);
				t.attr("data-key", n);
				templates.push(t);
				this.set_template(templates);
			}
			
		}
	} else { // Non-indexed
		this.set_template(n);
	}
}
TemplateSwitcher.prototype.get_itemTemplate = function(n) {
	if (n != null) {
		var templates = $(this.get_template());
		for (var i = 0; i < templates.length; i++) {
			var el = $(templates[i]);
			if (el.attr("data-key") == n) {
				return el;
			}
		}
	} else {
		return this.get_template();
	}
	return null;
}
TemplateSwitcher.prototype.get_item = function() {
    return this.$item;
};
TemplateSwitcher.prototype.set_item = function(newData) {
    //if (!BaseObject.equals(newData,this.$items)) {
    this.$item = newData;
    this.$reset();
    // Recreate, rebind and update

    //}
};
TemplateSwitcher.prototype.$reset = function() {
    this.preswitchevent.invoke(this, this.get_item());
    this.$createChild();
    this.rebind();
    this.updateTargets();
    this.switchevent.invoke(this, this.get_item());
};
TemplateSwitcher.prototype.set_packeditem = function(v) {
    var o = { value: v };
    var d = new DataPair(o, "value");
    this.set_item(d);
};
TemplateSwitcher.prototype.get_packeditem = function() {
    return this.get_item();
};
TemplateSwitcher.prototype.itemTemplateSwitch = function(sender, template) {
    var item = sender.get_item();
    if (typeof item == "string") {
        return this.getTemplateByKey(item);
    } else {
        return null;
    }
}
// Built-in template selection mechanisms
// null/non-null switch
TemplateSwitcher.prototype.nullTemplateSwitch = function(sender, template) {
    if (sender.get_item() == null) {
        return this.getTemplateByKey(this.nullTemplate);
    } else {
        return this.getTemplateByKey(this.notNullTemplate);
    }
}.Description("Standard $select handler which will select between two templates depending on item == null");
TemplateSwitcher.prototype.boolTemplateSwitch = function(sender, template) {
    if (sender.get_item()) {
        return this.getTemplateByKey(this.notNullTemplate);
    } else {
        return this.getTemplateByKey(this.nullTemplate);
    }
}.Description("Standard $select handler which will select between two templates depending on item == true and not true. Uses the same templates like the nullTemplateSwitch");
// Explicit template switching
TemplateSwitcher.prototype.$explicittemplate = "default";
TemplateSwitcher.prototype.get_explicittemplate = function() {
    return this.$explicittemplate;
};
TemplateSwitcher.prototype.set_explicittemplate = function(v) {
    if (this.$explicittemplate != v) {
        this.$explicittemplate = v;
        this.$reset();
    }
};
TemplateSwitcher.prototype.explicitTemplateSwitch = function(sender, template) {
    return this.getTemplateByKey(this.get_explicittemplate());

}.Description("Standard $select handler which will select the template specified by the $explicittemplate property.");
TemplateSwitcher.prototype.explicitTemplate = function(sender, dc, binding, bindingParameter) {
    if (bindingParameter != null) {
        this.set_explicittemplate(bindingParameter);
    } else {
        this.set_explicittemplate("default");
    }
}.Description("Outlet for direct event handling - bind an event to this method and specify the template to switch to in the binding parameter.");
