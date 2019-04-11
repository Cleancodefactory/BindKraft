


/*CLASS*/

function ValueRepeater(viewRootElement) {
    ViewBase.apply(this, arguments);
}

ValueRepeater.Inherit(ViewBase, "ValueRepeater");
ValueRepeater.Implement(ITemplateSource);
ValueRepeater.Implement(IItemTemplateSource);
ValueRepeater.prototype.obliterate = function() {
    if (this.root != null && this.root.jboundItemTemplate != null) {
        delete this.root.jboundItemTemplate;
    }
    ViewBase.prototype.obliterate.call(this);
};
ValueRepeater.prototype.itemTemplate = null;
ValueRepeater.prototype.multiTemplate = new InitializeBooleanParameter("Enables/disables support for multi rooted templates. Default is false.", false);
ValueRepeater.prototype.isTemplateRoot = function() { return false; };
// the repeater cannot be used as template root! This will cause endless recursion.
ValueRepeater.prototype.$init = function() {
    // In the repeater we need to cut the innerHTML and keep it as a template for repeating items
    var el = $(this.root);
    if (this.get_itemTemplate() == null) {
        // this.set_itemTemplate(el.Clean().children(":first-child").clone().get(0));
        this.set_itemTemplate(el.Clean().children().clone());
    }
    el.Empty();
    this.init();
    this.rebind(); // Default behaviour, items controls should override this
};
ValueRepeater.prototype.get_itemTemplate = function(n) {
	if (n == null) return this.root.jboundItemTemplate;
	return null;
};
ValueRepeater.prototype.get_template = function() {
    return this.get_itemTemplate();
};
ValueRepeater.prototype.set_itemTemplate = function(n,v) {
	if (arguments.length > 1) {
		if (n == null) {
			this.root.jboundItemTemplate = v;
		}
	} else {
		this.root.jboundItemTemplate = n;
	}
    
};
ValueRepeater.prototype.set_template = function(v) {
    this.set_itemTemplate(v);
};
ValueRepeater.prototype.$items = null;
ValueRepeater.prototype.get_items = function() {
    return this.$items;
};
ValueRepeater.prototype.set_items = function(newData) {
    //if (!BaseObject.equals(newData,this.$items)) {
    if (typeof newData == "object" || BaseObject.is(newData, "Array")) {
        this.$items = newData;
    } else {
        this.$items = null;
    }
    // Recreate, rebind and update
    this.$createChildren();
    this.rebind();
    this.updateTargets();
    //}
};
ValueRepeater.prototype.$createChildren = function() {
    var el = $(this.root);
    el.Empty();
    if (this.get_itemTemplate() == null) return;
    if (this.$items != null) {
        var item;
        var o, d;
        if (BaseObject.is(this.$items, "Array")) {
            for (var i = 0; i < this.$items.length; i++) {
                d = new DataPair(this.$items, i);
                o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), d, this.multiTemplate); // var o = $(this.itemTemplate).clone();
                if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
                    BaseObject.setProperty(d, this.storeIndexIn, i);
                }
            }
        } else {
            for (item in this.$items) {
                d = new DataPair(this.$items, item);
                o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), d, this.multiTemplate);
                if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
                    BaseObject.setProperty(d, this.storeIndexIn, item);
                }
            }
        }

    }
};