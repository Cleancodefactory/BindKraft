


/*CLASS*/
/* Roughly equivalent to ES6 bind this returns a function that will call the specified (by name) method
	with the correct "this" for the instance.
*/
function InitializeMethodCallback(desc, defval, boundArgs) {
    Initialize.apply(this, arguments);
    this.type = "MethodCallback";
	this.active = true;
	this.boundArgs = boundArgs;
};
InitializeMethodCallback.Inherit(Initialize, "InitializeMethodCallback");
InitializeMethodCallback.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    if (this.defaultValue != null) return ((this.boundArgs != null)?Delegate.createWrapper(obj, def, this.boundArgs):Delegate.createWrapper(obj, def));
    return null;
};
InitializeMethodCallback.prototype.defValueDescription = function () {
    return {
        value: "",
        type: ((this.defaultValue != null) ? "(method)" : "")
    };
};