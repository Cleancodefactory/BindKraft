function IFreezableImpl() {}
IFreezableImpl.InterfaceImpl(IFreezable, "IFreezableImpl");
IFreezableImpl.prototype.$frozeEvents = false;
IFreezableImpl.prototype.areEventsFrozen = function () {
    return this.$frozeEvents; 
};
IFreezableImpl.prototype.get_freezeevents = function(){ return this.$frozeEvents; }
IFreezableImpl.prototype.set_freezeevents = function(v) { this.$frozeEvents = v; }
IFreezableImpl.prototype.freezeEvents = function (obj, func) {
    var oldFroze = this.$frozeEvents;
    this.$frozeEvents = true;
	var result;
	if (BaseObject.is(func, "IInvocationWithArrayArgs")) {
		result = BaseObject.applyCalback(func, Array.createCopyOf(arguments,2));
	} else if (typeof func == "function") {
        result = func.apply(obj, Array.createCopyOf(arguments,2));
    }
    this.$frozeEvents = oldFroze;
	return result;
};
IFreezableImpl.prototype.freezeEventsApply = function (obj, func, args) {
    var oldFroze = this.$frozeEvents;
    this.$frozeEvents = true;
	var result;
	if (BaseObject.is(func, "IInvocationWithArrayArgs")) {
		result = BaseObject.applyCalback(func, args);
	} else if (typeof func == "function") {
        result = func.apply(obj, args);
    }
    this.$frozeEvents = oldFroze;
	return result;
};