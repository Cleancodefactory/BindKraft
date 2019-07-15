function ActionUnit() {
	BaseObject.apply(this, arguments);
}
ActionUnit.Inherit(BaseObject, "ActionUnit");
ActionUnit.Implement(IActionUnit);
ActionUnit.Implement(IUsingValueCheckersImpl);
ActionUnit.$actionChecker = new TypeChecker("string");
ActionUnit.prototype.$sealed = false;
ActionUnit.prototype.seal = function() { 
	this.$sealed = true;
}
ActionUnit.prototype.issealed = function() { 
	return this.$sealed?true:false;
}
ActionUnit.prototype.$sealcheck = function() {
	if (this.$sealed) throw "The operation is not allowed, because the ActionUnit is sealed";
}
ActionUnit.prototype.$action = null;
ActionUnit.prototype.get_action = function() { 
	return this.$action;
}
ActionUnit.prototype.set_action = function(a) { 
	this.$sealcheck();
	if (this.checkValueWith(ActionUnit.$actionChecker,a) {
		this.$action = a;
	} else {
		throw "set_action accepts only strings";
	}
}
ActionUnit.prototype.$actionFlags = 0;
ActionUnit.prototype.get_actionFlags = function() { return this.$actionFlags; }
ActionUnit.prototype.set_actionFlags = function(v) { 
	this.$sealcheck();
	if (typeof v == "number") {
		this.$actionFlags = v;
	} else {
		throw "actionFlags must be a number";
	}
}
ActionUnit.prototype.$executor = null;
ActionUnit.prototype.get_executor = function() { return this.$executor;}
ActionUnit.prototype.set_executor = function(v) { 
	this.$sealcheck();
	if (TypeChecker.BaseObject.checkType(v)) {
		this.$executor = v;
	} else {
		throw "The executor has to be null or BaseObject";
	}
}
ActionUnit.prototype.$userselection = false;
ActionUnit.prototype.get_userselection = function() { return this.$userselection; }
ActionUnit.prototype.set_userselection = function(v) {
	this.$sealcheck();
	this.$userselection = v?true:false;
}
ActionUnit.prototype.$contentKind = null;
ActionUnit.prototype.get_contentKind = function() { return this.$contentKind; }
ActionUnit.prototype.set_contentKind = function(v) { 
	this.$sealcheck();
	if (this.checkValueWith(ActionUnit.$actionChecker,a) {
		this.$action = a;
	} else {
		throw "set_contentKind accepts only strings";
	}
}

ActionUnit.prototype.get_contentTypes = function() { 
	if (BaseObject.is(this.$contentCrate,"IContentCrate")) {
		return this.$contentCrate.availableContentTypes();
	} else {
		return [];
	}
}

ActionUnit.prototype.$contentCrate = null;
ActionUnit.prototype.getContent = function(contentType) { 
	if (BaseObject.is(this.$contentCrate,"IContentCrate")) {
		return Operation.From(this.$contentCrate.getContent(contentType));
	} else {
		return Operation.Failed("no content available");
	}
}

ActionUnit.prototype.setContent = function(crate) { 
	if (crate == null || BaseObject.is(crate,"IContentCrate")) {
		this.$contentCrate = crate;
	} else {
		// TODO: Implement some crate autocreation
	}
}
	