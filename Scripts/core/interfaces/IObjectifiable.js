/**
 * This is like serialization, but here the basic javascript objects and other types are the basis
 * The output of objectifyInstance should look like:
 * {
 *	 $__className: "<fullclassname>",
 *   ownfield1: ...
 *   ownfiald2: ...
 * }
 * subobjects are allowed, but usually they are objectifications of subinstances. It is up toGMTString
 * the implementation of the individualizeInstance to sort it out
 */
function IObjectifiable() {}
IObjectifiable.Interface("IObjectifiable");
IObjectifiable.prototype.objectifyInstance = function() { throw "not implemented";}
IObjectifiable.prototype.individualizeInstance = function(v) { throw "not implemented";}
IObjectifiable.instantiate = function(v) {
	if (typeof v == "object" && v != null && typeof v.$__className == "string") {
		var cls = Class.getClassDef(v.$__className);
		if (cls != null) {
			var inst = new cls();
			if (BaseObject.is(inst,v.$__className) && BaseObject.is(inst,"IObjectifiable")) {
				inst.individualizeInstance(v);
				return inst;
			}
		}
	}
	return null;
}
IObjectifiable.objectify = function(inst) {
	if (BaseObject.is(inst, "IObjectifiable")) {
		return inst.objectifyInstance();
	}
	return null;
}
IObjectifiable.objectifyTo = function(o,inst) {
	return this.objectifyToAs(o,inst);
}
IObjectifiable.objectifyAs = function(inst,cls) {
	if (cls == null) return this.objectify(inst);
	var c = Class.getClassDef(cls);
	if (c != null && BaseObject.is(inst,c.classType)) {
		return c.prototype.objectifyInstance.call(inst);
	}
	return null;
}
IObjectifiable.objectifyToAs = function(o,inst,cls) {
	var x = this.objectifyAs(inst,cls);
	if (x != null) {
		if (o != null) {
			if (o.$__className == null) {
				o.$__className = inst.classType();
			}
			for (var i in x) {
				if (o.hasOwnProperty(i) && i != "$__className") {
					o[i] = x[i];
				}
			}
		}
	}
	return o;
}