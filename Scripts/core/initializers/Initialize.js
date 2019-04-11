
/*
    File: initialize.js
    Contains the base class of all the initializers.
*/

/*CLASS*/
function Initialize(desc, defval) {
    BaseObject.apply(this, arguments);
    this.description = desc;
    this.defaultValue = defval;
    this.type = "General"; // event
};
Initialize.Inherit(BaseObject, "Initialize");
// Constants
Initialize.DontInit = function() { return "Oh! Don't initialize me!";}; // Using function for better ref comparison
Initialize.prototype.obliterate = function() {};
// Obliteration is not allowed on intents
// End constants
Initialize.prototype.dontInitialize = function () {
    if (this.defaultValue === Initialize.DontInit) return true;
	
    return false;
};
Initialize.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
    return Defaults.getValue(obj, this.defaultValue);
};
Initialize.prototype.defValueDescription = function () {
    return {
        value: this.defaultValue,
        "type": typeof(defaultValue)
    };
};