/**
 *  This initializer is not intended for direct use. It is possible, but not advisable, because of the
 *  less descriptive resulting code.
 * 
 * @param desc {string} Description
 * @param stype {string|type} The class name or the class itself
 * @param args {Array<any>} The arguments for the constructor.
 */

/*CLASS*/
function InitializeSmartProperty(desc, stype, args) {
	Initialize.call(this, desc, args);
    this.stype = stype;
    if (!Class.is(stype, "SmartPropertyBase")) throw "InitializeSmartProperty needs type inheriting from SmartPropertyBase and " + stype + " is not.";
}
InitializeSmartProperty.Inherit(Initialize, "InitializeSmartProperty");
InitializeSmartProperty.prototype.produceDefaultValue = function (obj) {
    var cls = Class.getClassDef(this.stype);
    var inst = new cls(obj,this.defaultValue);
    return inst;
};
InitializeSmartProperty.prototype.defValueDescription = function () {
    var r = {
        value: ""
    };
    
    r.type = "Instance of " + Class.fullClassType(this.stype);
    return r;
};