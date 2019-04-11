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
//DropperControlHolder.ImplementProperty("displayareakey", new InitializeStringParameter("The data-key of the area used by the display","./Header"));
DropperControlHolder.ImplementProperty("activeCss", new InitializeStringParameter("Active CSS class for the display area","f_select_enabled"));
//DropperControlHolder.ImplementProperty("contentareakey", new InitializeStringParameter("The data-key of the area holding a control/element shown when the dropper opens.","./Body"));
DropperControlHolder.prototype.displaydatachangedevent = new InitializeEvent("Fired when the displaydata is changed");
DropperControlHolder.prototype.$displaydata = null;
DropperControlHolder.prototype.finalinit = function() {
	this.root.style.position = "relative";
	this.$closeproc();
}

// We do not use active property because this is the purpose of the class and this way we have this simplified.
DropperControlHolder.prototype.set_displaydata = function(v) {
	this.$displaydata = v;
	if (BaseObject.is(this.get_header(),"Base")) {
		this.get_header().set_data(v);
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
	}
}
DropperControlHolder.prototype.$closeproc = function() {
	if (this.get_body() != null) {
		this.get_body().style.display = "none";
		this.$isbodyvisible = false;
	}
}
DropperControlHolder.prototype.handleDisplayDataEvent = function(sender,data) {
	if (data != null) {
		this.set_displaydata(data);
	} else if (BaseObject(sender, "IDisplayDataSupplier")) { // Just in case - the data should be sent with the message, but still ...
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

