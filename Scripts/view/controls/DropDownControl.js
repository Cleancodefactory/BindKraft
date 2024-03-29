


/* STANDARD DROP DOWN */
function DropDownControl() {
    Base.apply(this, arguments);
    Messenger.Instance().subscribe("PageEvent",this.onHandlePageEvent);
}
DropDownControl.Inherit(Base, "DropDownControl");
DropDownControl.Implement(IUIControl);
DropDownControl.Implement(InterfaceImplementer("IAmbientDefaultsConsumerImpl"));
DropDownControl.prototype.obliterate = function () {
    Messenger.Instance().unsubscribe("PageEvent",this.onHandlePageEvent);
    Base.prototype.obliterate.call(this);
}
DropDownControl.prototype.onHandlePageEvent = new InitializeMethodDelegate("",function(msg) {
    if (BaseObject.is(msg, "PageEvent")) {
        // TODO Close if opened
    }
});
DropDownControl.prototype.defaultTemplateName = ".j_framework_control_dropdown";
DropDownControl.prototype.$init = function () {
    // Inject the predefined template
    var el = $(this.root);
    var tmlName = this.get_templateName();
    if (tmlName == null) tmlName = this.defaultTemplateName;
    var tml = $(tmlName);
    var tmlLocal = $(this.root).children();
	// This if looks crazy - check and correct it
    if (tmlLocal.length > 0) {
        var t_item = this.child("item").children().clone();
        if (t_item.length > 0) {
            var itemContainer = this.child("itemtemplate");
            itemContainer.empty();
            var ud = this.childObject("f_dropdown");
            if (ud != null) ud.set_itemTemplate(t_item.get(0));
        }
    }
    el.empty();
    el.append(tml.children().clone());
    Base.prototype.$init.apply(this, arguments);
};
DropDownControl.Implement(IDisablable);
DropDownControl.prototype.OnRebind = function () {
    Base.prototype.OnRebind.apply(this, arguments);
    var ti = $(this.root).prop("tabindex");
    if (ti != null && BaseObject.is(this.$lookuprep(), "LookupRepeater")) {
        this.$lookuprep().set_tabindex(ti);
    }
};
DropDownControl.prototype.set_disabled = function (v) {
    var lr = this.childObject("f_dropdown");
    if (lr != null) {
        lr.set_disabled(v);
    }
};
DropDownControl.prototype.get_disabled = function () {
    var lr = this.childObject("f_dropdown");
    if (lr != null) {
        return lr.get_disabled();
    }
    return false;
};
DropDownControl.prototype.keyproperty = new InitializeStringParameter("The name of the property that will be used as unique key to distinguish between the items.", "lookupkey");
DropDownControl.prototype.descproperty = new InitializeStringParameter("The name of the property that will be used as display name for the items (this is what is visible for the user).", "lookupdescription");
DropDownControl.prototype.titleproperty = new InitializeStringParameter("The name of the property that will be used as title for the items (this is what is visible for the user).", "");
DropDownControl.ImplementProperty("maxlen", new InitializeNumericParameter("Limit the display text of the items to the specified number of symbols. Default is 55", 55));
DropDownControl.ImplementProperty("captlen", new InitializeNumericParameter("Limit the display text of the items to the specified number of symbols. Default is 55", null));
DropDownControl.prototype.selchangedevent = new InitializeEvent("Fired every time the selection changes");
DropDownControl.prototype.activatedevent = new InitializeEvent("Fired whenever the selection is confirmed - enter pressed or when the user clicks on an item.");
DropDownControl.prototype.openevent = new InitializeEvent("Fired whenever the dropdown opens.");
DropDownControl.prototype.closeevent = new InitializeEvent("Fired whenever the dropdown closes.");
DropDownControl.ImplementProperty("templateName", new InitializeStringParameter("The id of the control template. Null denotes the standard built-in templates.", null));

DropDownControl.prototype.onOpen = function (e, dc) {
    this.openevent.invoke(e, dc);
}
DropDownControl.prototype.onClose = function (e, dc) {
    this.closeevent.invoke(e, dc);
}
DropDownControl.prototype.get_captlen = function () {
    if (this.$captlen != null) return this.$captlen;
    return this.get_maxlen();
};
DropDownControl.prototype.onSelectionChanged = function (sender, dc) {
    if (dc != null && dc.originalitem != null) {
        this.selchangedevent.invoke(sender, dc.originalitem);
    } else {
        this.selchangedevent.invoke(sender, dc);
    }
};
DropDownControl.prototype.onItemActivated = function (sender, dc) {
    if (dc != null && dc.originalitem != null) {
        this.activatedevent.invoke(sender, dc.originalitem);
    } else {
        this.activatedevent.invoke(sender, dc);
    }
};
DropDownControl.prototype.$lookuprep = function () {
    var lr = this.childObject("f_dropdown");
    if (lr == null) alert("The template for dropdown is missing or corrupted");
    return lr;
};
DropDownControl.prototype.focus = function () {
    this.$lookuprep().FocusHeader();
};
DropDownControl.prototype.get_items = function () {
    return this.$items;
};
DropDownControl.prototype.onDebugBinding = function(key, binding, obj, val) {
    var x = 1;
};
DropDownControl.prototype.$items = null;
DropDownControl.prototype.set_items = function (v) {
    this.$items = v;
    var self = this;
    var ml = this.get_maxlen();
    if (this.$items != null && BaseObject.is(this.$items, "Array")) {
        this.$lookuprep().set_items(this.$items.Select(function (idx, item) {
            return {
                key: item[self.keyproperty],
                description: String.Ellipsis(item[self.descproperty], ml), //item[self.descproperty],
                title: item[self.titleproperty],
                originalitem: item
            };
        }));
    } else {
        this.$lookuprep().set_items(null);
        if (this.$items != null) {
            jbTrace.log("DropDownControl: Attempt to set non-array value as items was made. Null has been set instead.");
        }
    }
};
DropDownControl.prototype.get_value = function () {
    return this.$lookuprep().get_value();
};
DropDownControl.prototype.set_value = function (v) {
    return this.$lookuprep().set_value(v);
};
DropDownControl.prototype.get_selectedindex = function () {
    return this.$lookuprep().get_selectedindex();
};
DropDownControl.prototype.set_selectedindex = function (v) {
    return this.$lookuprep().set_selectedindex(v);
};
DropDownControl.prototype.get_selecteditem = function () {
    var itm = this.$lookuprep().get_selecteditem();
    if (itm != null) return itm.originalitem;
    return itm;
};
DropDownControl.prototype.get_selectedproxyitem = function () {
    var itm = this.$lookuprep().get_selecteditem();
    return itm;
};
DropDownControl.prototype.set_selecteditem = function (v) {
    return this.$lookuprep().set_selecteditem(v);
};
