/**
	This is a kind of proxy for specific purposes. It is available for API implementations that need to pass "safe" instances to components/code that is highly pluggable.
	
	Unlike the local proxies generated through LocalAPI and/or appGate this mechanism is AdHoc and intended for specific internal purposes.
	Any code that receives InterfaceObjects is not aware of this fact and does not need to release it or do anything else special. 
	
	FYI: This can be seen the other way around - the interface object is a public interface for an object which is never seen directly. We considered an OOP approach along these line, but
	we don't want such radiacl changes in such an advanced phase of the framework development, so this technique is likely to remain the only trace of this approach in BindKraft.
	
	So, this allows to supply access to the instance through a special set of methods which is normally not available. 
	Can be compared to extension methods.
	
	@target - {BaseObject} - The instance of a class derived from BaseObject to which this interface object will point. This object will be passed as this to all the methods, to access data members defined in 
		the template they have to use the word internal instead of this.
	@classDef - {BaseObject|string|classdef} - name of a class or its class definition directly. The definition can be extracted by name or from a live instance. This must be a class derived from InterfaceObjectTemplate.
	
	For the moment the requirement for descent from InterfaceObjectTemplate is not doing any good and has only minor significance - 
	prevents mixing up things - stops the programmer from accidently creating unusable implementations.
*/
function InterfaceObject(target, classDef) {
	BaseObject.apply(this,arguments);
	var def = Class.getClassDef(classDef);
	if (def == null) throw "class not found while trying to create InterfaceObject";
	if (!Class.is(def,"InterfaceObjectTemplate")) throw "The template class (classDef argument) must inherit from InterfaceObjectTemplate.";
	var m;
	this.$__nonmethods = {};
	this.$__methods = {};
	this.$__target = target;
	for (var k in def.prototype) {
		if (k == "constructor") continue;
		m = def.prototype[k];
		if (typeof m == "function") {
			this.$__methods[k] = m;
			this[k] = InterfaceObject.CreateWrapper(m);
		} else if (BaseObject.is(m, "Array")) {
			this[k] = Array.createCopyOf(m);
		} else {
			this[k] = m;
		}
	}
}
InterfaceObject.Inherit(BaseObject, "InterfaceObject");
InterfaceObject.CreateWrapper = function(orig_method) {
	var self = this;
	return function() {
		return orig_method.apply(this.$__target, arguments);
	}
}