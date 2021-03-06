

/*CLASS*/
function ProtoCaller(proto, method, strict) {
	BaseObject.apply(this,arguments);
    if (BaseObject.is(proto,"string")) {
        this.Interface = proto;
    } else if (typeof proto == "object") {
        this.Interface = proto.classType;
    }
    this.method = method;
	this.strict = strict;
	if (strict) {
		if (!Class.supportsMethod(proto,method)) throw "Method " + method + " not supported by " + proto;
	}
};
ProtoCaller.Inherit(BaseObject, "ProtoCaller");
ProtoCaller.prototype.invokeOn = function (obj) {
    if (BaseObject.is(obj, this.Interface)) {
		if (this.strict) {
			if (!Class.supportsMethod(obj,method)) throw "Method " + method + " not supported by " + proto + ". If you do not need member checking use non-strict protocaller.";
			if (typeof obj[this.method] != "function") throw "Method " + method + " is declared in " + proto + ", but seems to be missing on an instance of " + proto + ". If you do not need member checking use non-strict protocaller.";
		}
        var arr = Array.createCopyOf(arguments, 1);
        return obj[this.method].apply(obj, arr);
    }
    return null;
};

/*CLASS*/ // Strict version initializer.
function StrictProtoCaller(proto, method) {
	ProtoCaller.call(this,proto, method, true);
}
StrictProtoCaller.Inherit(ProtoCaller, "StrictProtoCaller");