/* Declares an empty object:
		new InitializeObject("description");
		or
		new InitializeObject("description", "object");
   Or new instance of a given type
		new InitializeObject("description", SomeClassName);
	instance of SomeClassName is created without arguments to the constructor
	
*/

/*CLASS*/
/**
 * Creates and object instance initializer.
 * @class
 * @param {string|null} [desc]  Description of the object's purpose
 * @param {string} [stype=object] Specifies the type of object to initialize. Can be object or any BK class. 
 *                                Special value of Initialize.DontInit will prevent creating instance (useful if the initializer is specified only to provide documentation )
 * @param {...any} [defVal] Optional arguments (up to 10) for the object's constructor.
 * 
 * 
 */
function InitializeObject(desc, stype, defVal) {
	// Since defaultValue is no longer used we design it only for use with the documenting functionality
    // deprecate: Initialize.call(this, desc, defVal);
	Initialize.call(this, desc, (stype !== Initialize.DontInit)?(stype || "object"):Initialize.DontInit);
    this.type = "Object";
    this.stype = stype;
	if (BaseObject.is(defVal,"Array")) {
		this.createArgs = defVal;
	} else {
		this.createArgs = Array.createCopyOf(arguments,2);
	}
}
InitializeObject.Inherit(Initialize, "InitializeObject");
InitializeObject.prototype.produceDefaultValue = function (obj) {
    if (this.stype == null || this.stype.toLowerCase() == "object") {
        return {};
    } else {
		if (this.createArgs != null) {
			var a = this.createArgs;
			return new Function.classes[this.stype](a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11]);
		} else {
			return new Function.classes[this.stype]();
		}
    }
};
InitializeObject.prototype.defValueDescription = function () {
    if (this.dontInitialize()) return null;
    var r = {
        value: ""
    };
    if (this.stype != null) {
        r.type = ((this.defaultValue != null) ? "Instance of " + Class.fullClassType(this.defaultValue) : "");
    } else {
        r.type = "object";
    }
    return r;
};