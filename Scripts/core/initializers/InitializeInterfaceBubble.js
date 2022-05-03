
/*CLASS*/
/**
 * Creates and object instance initializer which creates an interface bubble during instantiation.
 * @class
 * @param {string|null} desc  Description of the object's purpose
 * @param {string} iface Specifies the interface for which a bubble will be created.
 *                                Special value of Initialize.DontInit will prevent creating instance (useful if the initializer is specified only to provide documentation )
 * @param {object} [def] Object with definitions for the interface methods
 * 
 * 
 */
 function InitializeInterfaceBubble(desc, iface, def, propname, beStrict) {
	Initialize.call(this, desc, (iface !== Initialize.DontInit)?iface:Initialize.DontInit);
    // this.defaultValue <= iface
    this.definition = def;
    this.propname = propname;
    this.beStrict = beStrict;
}
InitializeInterfaceBubble.Inherit(Initialize, "InitializeInterfaceBubble");
InitializeInterfaceBubble.prototype.produceDefaultValue = function (obj) {
    var iface_name = Class.getInterfaceName(this.defaultValue);
    if (iface_name == null) {
        throw "The interface specified cannot be found during initializing an interface bubble on " + obj.classType();
    }
    var iface_def = Class.getInterfaceDef(this.defaultValue);
    var $InterfaceBubbleBase = Class("$InterfaceBubbleBase");
    var class_name = "$_" + obj.classType() + "_" + (this.propname || "$neutral") + "_" + iface_name;
    var bubble = $InterfaceBubbleBase.WrapInterface(class_name, iface_def, this.definition, this.beStrict);
    if (bubble == null) throw "Cannot create bubble interface " + iface_name + " class on " + obj.classType();
    var inst = new bubble(obj);

    return inst;
};
InitializeInterfaceBubble.prototype.defValueDescription = function () {
    if (this.dontInitialize()) return null;
    var r = {
        value: ""
    };
    var iface_name = Class.getInterfaceName(this.defaultValue);
    r.type = ((iface_name != null) ? "Bubble instance of " + iface_name : "");
    return r;
};