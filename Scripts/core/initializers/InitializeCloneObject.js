

/*CLASS*/
function InitializeCloneObject(desc, defVal) {
    Initialize.call(this, desc, defVal);
}
InitializeCloneObject.Inherit(Initialize, "InitializeCloneObject");
InitializeCloneObject.prototype.produceDefaultValue = function (obj) {
    if (this.defaultValue == null) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    return BaseObject.DeepClone(def);
};
InitializeCloneObject.prototype.defValueDescription = function () {
    if (this.dontInitialize()) return null;
    var r = {
        value: "(user data)",
        type: "object"
    };
    return r;
};