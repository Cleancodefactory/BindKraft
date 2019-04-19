function DockerSlotsWindowBehavior() {
	WindowBehaviorBase.call(this, true);
}
DockerSlotsWindowBehavior.Inherit(WindowBehaviorBase,"DockerSlotsWindowBehavior");

// Init and uninit overrides
DockerSlotsWindowBehavior.prototype.oninit = function(wnd) {
	
}
DockerSlotsWindowBehavior.prototype.onuninit = function(wnd) {
	
}
// Utilities
DockerSlotsWindowBehavior.prototype.get_main = function() {
	if (BaseObject.is(this.$window,"BaseWindow")) {
		return this.$window.get_clientcontainer();
	}
	return null;
}
DockerSlotsWindowBehavior.prototype.get_slot = function(name) {
	if (BaseObject.is(this.$window,"BaseWindow")) {
		return this.$window.get_clientcontainer(name);
	}
	return null;
}


// Subscribe containers
DockerSlotsWindowBehavior.prototype.$slots = new InitializeCloneObject("Controlled slots",{ // We do not need clone object, but I want to have it before my eyes
	// Docks
	left: null,
	top: null,
	right: null,
	bottom: null
});
DockerSlotsWindowBehavior.prototype.$slotSettings = new InitializeCloneObject("Controlled slots",{ // We do not need clone object, but I want to have it before my eyes
	default: {
		width: 10,	// width of the band in pixels or percents (see percents)
		percents: true,	// Is the width in percents (true) or in pixels (false)
		persistent: false // Reserves the space (true) on top (false)
	}
});
DockerSlotsWindowBehavior.prototype.get_dockprop = function(prop,dock) {
	if (this.$slotSettings[dock] && this.$slotSettings[dock][prop] != null) {
		return this.$slotSettings[dock][prop];
	}
	return this.$slotSettings.default[prop];
}
DockerSlotsWindowBehavior.prototype.set_dockprop = function(prop,dock) {
	if (this.$slotSettings[dock] && this.$slotSettings[dock][prop] != null) {
		return this.$slotSettings[dock][prop];
	}
	return this.$slotSettings.default[prop];
}
/**
	@param name {string} - the name of the slot - see BaseWindow.prototype.get_clientcontainer(name);
	@param role {string} - the kind of management applied, it may require certain CSS charateristics. roles: left, top, right, bottom
	
*/
DockerSlotsWindowBehavior.prototype.control = function(name, role) {
	if (this.$slots.hasOwnProperty(role)) {
		if (this.$slots[role] != null) {
			this.$slots[role] = name;
			return true;
		}
	}
	return false;
}
DockerSlotsWindowBehavior.prototype.uncontrol = function(name) {
	if (this.$slots.hasOwnProperty(role)) {
		if (this.$slots[role] != null) {
			this.$slots[role] = null;
			return true;
		}
	}
	return false;
}
// Actions
DockerSlotsWindowBehavior.prototype.showdock = function(name) {
	if (this.$slots.hasOwnProperty(name) &&  typeof this.$slots == "string") {
		var slot_el = this.get_slot(name);
		if (slot_el != null) {
			var persistent = this.get_dockprop("persistent", name);
			var ispercentage = this.get_docprop("percents", name);
			var _width = this.get_docprop("width", name);
			
		}
	}		
}
