/**
 * Usage: 
   MyClass.
 */

/*CLASS*/
function InitializeDelegatedProperty(desc, calcCallback, path) {
    Initialize.call(this, desc, null);
    this.type = "Property delegate";
    this.calcCallback = calcCallback;
    this.path = path;
};
InitializeDelegatedProperty.Inherit(Initialize, "InitializeDelegatedProperty");
InitializeDelegatedProperty.$currentPropCounter = 0;
InitializeDelegatedProperty.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
    var path = this.path;
    if (path == null) {
        path = "_delegatedAutoProperty" + (InitializeDelegatedProperty.$currentPropCounter++);
    }
    return obj.getDelegatedProperty(path, new Delegate(obj, Defaults.getValue (obj,this.calcCallback)));
};
InitializeDelegatedProperty.prototype.defValueDescription = function () {
    var r = {
        value: "(null)",
        type: "Calculated property"
    };
    return r;
};
