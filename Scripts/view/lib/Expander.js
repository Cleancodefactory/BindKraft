

(function() {

// Imports
var Panel = Class("Panel"), 
    IDisablable = Interface("IDisablable"), 
    InitializeStringParameter = Class("InitializeStringParameter"),
    InitializeNumericParameter = Class("InitializeNumericParameter"),
    InitializeEvent = Class("InitializeEvent");

/*CLASS*/
function Expander() {
    Panel.apply(this, arguments);
    this.$isopen = false;
}

Expander.Inherit(Panel, "Expander");
Expander.Implement(IDisablable);
Expander.$rootParameters = ["activeHeader","disabled", "inactiveHeader", "bodyElement", "initialState", "animation", "radioSet", "disabled", "updateMode", "liveParts", "noClick", "allowCollapse"];
Expander.prototype.setObjectParameter = function(name, value) {
    if (name.inSet(Expander.$rootParameters)) {
		return true;
		// Returning true we tell the parameterizer to do exactly the same on its own.
        // if (name.inSet(Expander.$rootParametersSet)) {
            // this["set_" + name](value);
        // } else {
            // this[name] = value;
        // }
    } else {
        this.$parameters[name] = value;
    }
};
Expander.prototype.activeHeader = new InitializeStringParameter("parent[/child] key of the active header element", "./ActiveHeader");
Expander.prototype.inactiveHeader = new InitializeStringParameter("parent[/child] key of the inactive header element", "./InactiveHeader");
Expander.prototype.bodyElement = new InitializeStringParameter("parent[/child] key of the body element", "./Body");
Expander.prototype.initialState = new InitializeStringParameter("Initial state of the expander, can be 'collapsed' (default) or 'expanded'", "collapsed");
Expander.prototype.animation = new InitializeStringParameter("Body animation: slow, fast, none", "none");
Expander.prototype.radioSet = new InitializeStringParameter("parent[/child*] set of expanders to collapse automatically, collapse is diabled, use allowCollapse=true if needed.", null);
Expander.prototype.allowCollapse = new InitializeBooleanParameter("Allows collapse when it is disabled by default", false);
Expander.prototype.updateMode = new InitializeNumericParameter("If set to non-zero value will cause the expander to perform updateTargets only when opened.", 0);
Expander.prototype.liveParts = new InitializeNumericParameter("If set to non-zero value will cause the parts of the expander to be determined anew each time something happens", 0);
Expander.prototype.noClick = new InitializeBooleanParameter("Does not listen for clicks, can turn only programmatically.", false);
//Example for disabled: #disabled='1'
// evnets
Expander.prototype.statechangedevent = new InitializeEvent("Fired when the expander opens or closes. The data is true/false meaning open/close");
Expander.prototype.expandeddevent = new InitializeEvent("Fired when the expander opens. The data is true meaning open");
Expander.prototype.obliterate = function() {
    delete this.$activeHeader;
    delete this.$inactiveHeader;
    delete this.$bodyElement;
    Panel.prototype.obliterate.call(this);
};
Expander.prototype.init = function() {
    if (!this.noClick) {
        this.on(this.activeHeader, "click", this.Collapse);
        this.on(this.inactiveHeader, "click", this.Expand);
    }
    this.$activeHeader = this.getRelatedElements(this.activeHeader);
    this.$inactiveHeader = this.getRelatedElements(this.inactiveHeader);
    this.$bodyElement = this.getRelatedElements(this.bodyElement);
    this.$animation = (this.animation == "none") ? null : this.animation;
	this.freezeEvents(this, function() {
		if (this.initialState == "collapsed") {
			this.Collapse();
		} else {
			this.Expand();
		}
	});
};
Expander.prototype.updateTargets = function() {
    if (this.updateMode) {
        if (this.get_expanded()) {
            Panel.prototype.updateTargets.apply(this, arguments);
        }
    } else {
        Panel.prototype.updateTargets.apply(this, arguments);
    }
};
Expander.prototype.get_body = function() {
	if (this.liveParts) {
		this.$bodyElement = this.getRelatedElements(this.bodyElement);
	}
    return this.$bodyElement;
};
Expander.prototype.get_inactiveHeader = function() {
	if (this.liveParts) {
		this.$inactiveHeader = this.getRelatedElements(this.inactiveHeader);
	}
    return this.$inactiveHeader;
};
Expander.prototype.get_activeHeader = function() {
	if (this.liveParts) {
		this.$activeHeader = this.getRelatedElements(this.activeHeader);
	}
    return this.$activeHeader;
};
Expander.prototype.Expand = function(e, dc) {
    if (e != null) {
        if (this.$disabledUI) return;
    }

    this.$isopen = true;
    if (this.updateMode) this.updateTargets();
    this.get_inactiveHeader().hide();
    this.get_activeHeader().show();
    this.get_body().show(this.$animation);
    if (this.radioSet != null) this.$updateRadioSet();

    this.expandeddevent.invoke(this, true);
    this.statechangedevent.invoke(this, true);
};
Expander.prototype.Collapse = function(e, dc) {
    if (e != null) {
        if (!this.allowCollapse) {
            if (this.radioSet != null || this.$disabledUI) return;
        }
    }
    this.$isopen = false;
    if (this.updateMode) this.updateSources();
    this.get_inactiveHeader().show();
    this.get_activeHeader().hide();
    this.get_body().hide(this.$animation);

    this.statechangedevent.invoke(this, false);
};
Expander.prototype.Toggle = function() {
    if (this.$isopen) {
        this.Collapse();
    } else {
        this.Expand();
    }
}
Expander.prototype.$updateRadioSet = function() {
    var others = this.getRelatedElements(this.radioSet);
    var lt = this;
    others.each(function(idx) {
        if (BaseObject.is(this.activeClass, "Expander") && this.activeClass != lt) {
            this.activeClass.Collapse();
        }
    });
};
Expander.prototype.get_expanded = function() { return this.$isopen; };
Expander.prototype.set_expanded = function(v) {
    if (v) {
        this.Expand();
    } else {
        this.Collapse();
    }
};
Expander.prototype.get_collapsed = function() { return !this.$isopen; };
Expander.prototype.set_collapsed = function(v) {
    if (v) {
        this.Collapse();
    } else {
        this.Expand();
    }
};

})();