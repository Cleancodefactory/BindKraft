


// Should be deprecated or refactored, avoid if possible, alternatives exist in constructor set.


// Heavy duty lookups
// These lookup controls are actually constructs based on data areas and

function DataLookupControl() {
    Base.apply(this, arguments);
    this.$markfilterchange = new SpringTrigger(new Delegate(this, this.indicateFilterChange), 500);
}
DataLookupControl.Inherit(Base, "DataLookupControl");
DataLookupControl.Implement(IUIControl);
DataLookupControl.Implement(IDisablable);
DataLookupControl.ImplementProperty("identification", new InitializeStringParameter("The field by which the items are identified uniquely. Usually an ID/Key field in the db.", null));
DataLookupControl.ImplementProperty("contentaddress", new InitializeStringParameter("The connector address for the content.", null));
DataLookupControl.ImplementProperty("countaddress", new InitializeStringParameter("The connector address for the count.", null));
DataLookupControl.ImplementProperty("itemaddress", new InitializeStringParameter("The connector address for the single item extraction. The key name must be @id.", null));
DataLookupControl.ImplementProperty("itemparamname", new InitializeStringParameter("The name of the parameter that needs to be constructed from the value and sent to extract a single item - see: itemaddress.", "id"));
DataLookupControl.ImplementProperty("connectorType", new InitializeStringParameter("The connector type to use.", "AjaxXmlConnector"));
DataLookupControl.ImplementProperty("bindhost", new Initialize("Binding host for the connector. If null the DataArea will set itself as host.", null));

DataLookupControl.ImplementActiveProperty("opened", new InitializeBooleanParameter("Is the selector opened,", false));
DataLookupControl.ImplementActiveProperty("internalselectedvalue", new InitializeParameter("The selected value for in-template usage. Set only under certain circumstances", null));

DataLookupControl.prototype.itemloadedevent = new InitializeEvent("Fires when the current item detailed info has been updated");
DataLookupControl.prototype.filterchangedevent = new InitializeEvent("Fires when a change in the filter data is indicated.");


DataLookupControl.prototype.onSelectItem = function (e, dc) {
    this.set_selecteditem(dc);
};
DataLookupControl.prototype.Open = function () {
    if (this.get_disabled()) {
        this.set_opened(false);
    } else {
        this.set_opened(true);
    }
};
DataLookupControl.prototype.Close = function () {
    this.set_opened(false);
};
DataLookupControl.prototype.Toggle = function () {
    if (this.get_disabled()) {
        this.set_opened(false);
    } else {
        this.set_opened(!this.get_opened());
    }
};
DataLookupControl.prototype.$markfilterchange = null; // SpringTrigger
DataLookupControl.prototype.$prevVal = null; // Previous filter value
DataLookupControl.prototype.ClearFilterCache = function (e, dc, bind) {
	this.$prevVal = null;
}
DataLookupControl.prototype.$getCurrentValue = function(e, bind) {
	var val = null;
	if (bind != null) {
		val = bind.getRef("text");
	}
	if (val == null && e != null && e.target != null && e.target.tagName != null && 
		e.target.tagName.toLowerCase() == "input" && e.target.type == "text") {
		val = e.target.value;
	}
	return val || "";
}
DataLookupControl.prototype.MarkFilterChange = function (e, dc, bind) {
	var val = this.$getCurrentValue(e,bind);
	if (val != this.$prevVal) {
		this.$prevVal = val;
		if (this.$markfilterchange != null) this.$markfilterchange.windup();
	}
};
DataLookupControl.prototype.indicateFilterChange = function () {
    this.filterchangedevent.invoke(this, null);
};
DataLookupControl.prototype.$selecteditem = null;
DataLookupControl.prototype.get_selecteditem = function () {
    return this.$selecteditem;
};
DataLookupControl.prototype.set_selecteditem = function (v) {
    this.$selecteditem = v;
    this.$selectedvalue = ((this.$selecteditem != null) ? this.$selecteditem[this.get_identification()] : null);
    this.itemloadedevent.invoke(self, v);
    this.set_internalselectedvalue(this.$selectedvalue);
};
DataLookupControl.prototype.$selectedvalue = null;
DataLookupControl.prototype.get_value = function () {
    if (this.$selectedvalue != null) return this.$selectedvalue;
    return ((this.$selecteditem != null) ? this.$selecteditem[this.get_identification()] : null);
};
DataLookupControl.prototype.set_value = function (v) {
    this.$selectedvalue = v;
    this.set_internalselectedvalue(this.$selectedvalue);
    if (this.$selecteditem != null && this.$selecteditem[this.get_identification()] == v) return;
    this.$selecteditem = null;
    if (this.$selectedvalue != null) {
        // Send request for the item
        var host = this.get_bindhost();
        if (host == null) host = this;
        var mon = Function.createInstance(this.get_connectorType(), this.get_itemaddress(), host);
        mon.set_parameters({});
        mon.set_parameters(this.get_itemparamname(), this.$selectedvalue);
        var self = this;
        mon.bind(function (resource, success, err_info) {
            if (success !== false) {
                if (resource != null && resource[self.get_identification()] == self.$selectedvalue) {
                    // Set it only if the request is for the same identification key
                    self.$selecteditem = resource;
                    self.itemloadedevent.invoke(self, resource);
                }
            }
        });
    }

};