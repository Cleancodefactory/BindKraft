/*
	Quick info:
	
	Data suppliers are elements/controls (usually controls) that supply data for external display. The display is responsible to "know" what to expect.
	Interfaces:
	IDisplayDataSupplier - supplies all the data each time it changes
	IDisplayDataConsumer - consumes the displaydataevent from the suppliers
	
	The supplier should fire displaydataevent each time its state changes in a way that the data it supplies changes. The dc parameter of the message should be null (2-param of the event).
	The actual display data is obtained from the sender.get_displaydata property.
	
	This makes this both easily consumable by an object handling the event and binding(s) directly.
	
	The event displaydata is fired to enable controlled reation to data changes. Obviously one can simply set readdata option in the
	binding that connects to the get_displaydata property of the supplier, but let us not forget the purpose of this otherwise simple
	construct - to save UI real estate. This means there could be various scenario specific optimizations that can benefit of
	custom and partial refreshes or no refresh in certain states.

*/


function DropperControlHolder() {
	Base.apply(this,arguments);
}
DropperControlHolder.Inherit(Base, "DropperControlHolder");
DropperControlHolder.Implement(IUIControl);
DropperControlHolder.Implement(IDisplayDataConsumer);
DropperControlHolder.Implement(IOpenCloseFunctionalityImpl, 300, "$openproc","$closeproc");
// Unlike expander we do not want to change headers, because we want to be able to keep focus and possibly have other active elements in the header template
// The naming follows the same pattern though.
DropperControlHolder.ImplementProperty("inactiveCss", new InitializeStringParameter("Active CSS class for the display area","f_select_disabled"));
DropperControlHolder.ImplementProperty("activeCss", new InitializeStringParameter("Active CSS class for the display area","f_select_enabled"));
DropperControlHolder.ImplementProperty("maxitemsdisplayed", new InitializeNumericParameter("Max number of selected items to pass to the display",3));
DropperControlHolder.ImplementProperty("textproperties", new InitializeStringParameter("The properties to read in order when using a textual helper fomatter",null));
DropperControlHolder.ImplementProperty("numselected", new InitializeNumericParameter("Text for the number of selected items for countSelectedFormatter. Use %count% to mark the insertion place for the count.","%count% items selected"));
DropperControlHolder.ImplementProperty("noselection", new InitializeNumericParameter("Text for no selection.","nothing selected"));
DropperControlHolder.ImplementProperty("norepositioning", new InitializeBooleanParameter("Text for no selection.",false));

DropperControlHolder.prototype.displaydatachangedevent = new InitializeEvent("Fired when the displaydata is changed");
DropperControlHolder.prototype.$displaydata = null;
DropperControlHolder.prototype.finalinit = function() {
	this.root.style.position = "relative";
	this.$closeproc();
}

// We do not use active property because this is the purpose of the class and this way we have this simplified.
DropperControlHolder.prototype.set_displaydata = function(v) {
	this.$displaydata = v;
	if (BaseObject.is(this.get_displayarea(),"Base")) {
		this.get_displayarea().set_data(v);
	} else {
		jbTrace.log("DropperControlHolder should have a data-class on its header element.")
	}
	this.displaydatachangedevent.invoke(this, v); // When no Base class is set on the header - the event can be used to refresh the display elements
}
DropperControlHolder.prototype.get_displaydata = function() {
	return this.$displaydata;
}
DropperControlHolder.prototype.$displayarea = null; // Display area as raw DOM node
DropperControlHolder.prototype.get_displayarea = function() {
	return this.$displayarea;
}
DropperControlHolder.prototype.set_displayarea = function(v) {
	this.$displayarea = v;
}

DropperControlHolder.prototype.$body = null; // Display area as raw DOM node
DropperControlHolder.prototype.get_body = function() {
	return this.$body;
}
DropperControlHolder.prototype.set_body = function(v) {
	this.$body = v;
}
DropperControlHolder.prototype.$isbodyvisible = false;
DropperControlHolder.prototype.$openproc = function() {
	if (this.get_body() != null) {
		this.get_body().style.display = "block";
		this.$isbodyvisible = true;
		if (!this.get_norepositioning()) {
			JBUtil.adjustPopupInHost(this, $(this.get_body()), 0, -30);
		}
		var el = this.get_displayarea();
		if (BaseObject.is(el,"Base")) {
			el = el.root;
		}
		DOMUtil.addClass(el,this.get_activeCss());
		DOMUtil.removeClass(el,this.get_inactiveCss());
	}
}
DropperControlHolder.prototype.$closeproc = function() {
	if (this.get_body() != null) {
		this.get_body().style.display = "none";
		this.$isbodyvisible = false;
		var el = this.get_displayarea();
		if (BaseObject.is(el,"Base")) {
			el = el.root;
		}
		DOMUtil.addClass(el,this.get_inactiveCss());
		DOMUtil.removeClass(el,this.get_activeCss());
	}
}
DropperControlHolder.prototype.handleDisplayDataEvent = function(sender,data) {
	if (data != null) {
		this.set_displaydata(data);
	} else if (BaseObject.is(sender, "IDisplayDataSupplier")) { // Just in case - the data should be sent with the message, but still ...
		this.set_displaydata(sender.get_displaydata());
	}
}
// Public open/close starters
DropperControlHolder.prototype.open = function() {
	this.$schedulePending("open");
}
DropperControlHolder.prototype.close = function() {
	this.$schedulePending("close",true);
}
DropperControlHolder.prototype.toggle = function() {
	if (!this.$isbodyvisible) {
		this.open();
	} else {
		this.close();
	}
}
DropperControlHolder.prototype.handleClickEvent = function() {
	this.toggle();
}
DropperControlHolder.prototype.handleKeyEvent = function(e, dc) {
	if (e.which == 13 || e.which == 32) { // Togle on enter or space
		this.toggle();
	} else if (e.which == 40) { // down arrow
		if (!this.$isbodyvisible) {
			this.open();
		}
	} else if (e.which == 38) { // up arrow
		if (this.$isbodyvisible) {
			this.close();
		}
	}
}
// Handy formatters
DropperControlHolder.prototype.countSelectedFormatter = {
	ToTarget: function(v,bind,params) {
		// TODO: Have to localize these from somewhere
		if (BaseObject.is(v, "Array") && v.length > 0) {
			var txt = this.get_numselected();
			if (txt != null) {
				return txt.replace("%count%",v.length);
			} else {
				return v.length + " selected";
			}
		} else if (BaseObject.is(v,"object")) {
			return this.displaySelectedItemsText.ToTarget.call(this,v,bind,params);
		}
		return this.get_noselection() || "none selected";
	},
	FromTarget: function(v,bind,params) {
		return v;
	}
};
DropperControlHolder.prototype.displaySelectedItems = {
	ToTarget: function(v,bind,params) {
		// TODO: Have to localize these from somewhere
		if (BaseObject.is(v, "Array") && v.length > 0) {
			return Array.createCopyOf(v,0,this.get_maxitemsdisplayed());
		} else if (BaseObject.is(v,"object")) {
			return v;
		}
		return null;
	},
	FromTarget: function(v,bind,params) {
		return v;
	}
};
DropperControlHolder.prototype.displaySelectedItemsText = {
	ToTarget: function(v,bind,params) {
		if (BaseObject.is(this.get_textproperties(), "string")) {
			var arr = this.get_textproperties().split(",");
			if (arr != null && arr.length > 0) {
				if (BaseObject.is(v, "Array") && v.length > 0) {
					var me = this;
					return v.Select(function(idx, item) {
						if (idx < me.get_maxitemsdisplayed()) {
							var r = "";
							for (var j = 0;j <arr.length;j++) {
								r += item[arr[j]] + ((j < arr.length - 1)?" ":"");
							}
							return r;
						} else {
							return null;
						}
					}).join(",") + ((v.length > this.get_maxitemsdisplayed())?"...":"");					;
				} else if (BaseObject.is(v, "object")) {
						var r = "";
						for (var j = 0;j <arr.length;j++) {
							r += item[arr[j]] + ((j < arr.length - 1)?" ":"");
						}
						return r;
				}
			}
		}
		return null;
	},
	FromTarget: function(v,bind,params) {
		return v;
	}
};

