function ActionUnit() {
	BaseObject.apply(this, arguments);
}
ActionUnit.Inherit(BaseObject, "ActionUnit");
ActionUnit.Implement(IActionUnit);

IActionUnit.prototype.seal = function() { throw "not implemented"; }
IActionUnit.prototype.issealed = function { throw "not implemented"; }

IActionUnit.prototype.get_action = function() { throw "not impl";}
IActionUnit.prototype.set_action = function(a) { throw "not impl";}

IActionUnit.prototype.get_actionFlags = function() { throw "not impl"; }
IActionUnit.prototype.set_actionFlags = function(v) { throw "not impl"; }

IActionUnit.prototype.get_executor = function() { throw "not impl";}
IActionUnit.prototype.set_executor = function(v) { throw "not impl";}

IActionUnit.prototype.get_userselection = function() {throw "not impl"; }
IActionUnit.prototype.set_userselection = function(v) {throw "not impl"; }

IActionUnit.prototype.get_contentKind = function() { throw "not impl"; }
IActionUnit.prototype.set_contentKind = function(v) { throw "not impl"; }

IActionUnit.prototype.get_contentTypes = function() { throw "not impl"; }

IActionUnit.prototype.getContent = function(contentType) { throw "not impl"; }

IActionUnit.prototype.setContent = function(crate) { throw "not impl"; }
	