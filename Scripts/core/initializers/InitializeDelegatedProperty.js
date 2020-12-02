/**
 * Creates an instance of a delegated property.
 * Overloads:
 * new InitializeDelegatedProperty(desc, calcCallback, path, autoRefresh)
 * new InitializeDelegatedProperty(desc, calcCallback, autoRefresh)
 * 
 * @param desc {string} Description
 * @param calcCallback {callback} A callback to calculate the value when needed. See the remarks below.
 * @param path {string} The name of the field to create for the raw value over this object.
 * @param autoRefresh {integer} The milliseconds after which the value is considered dirty and calculated again.
 * 
 * See the PropertyDelegate class for how to use the created object.
 * 
 * Remarks:
 *  The callback has proto function(obj) where obj is this object (the one on which the initializer is used.)
 *  The callback can either calculate the value synchronously or return an Operation that completes with the 
 *  fetched/calculated value. For values fetched through network returning Operation is absolutely necessary.
 * 
 *  When the callback returns an operation the .get() method will return Operation when the value is being fetched
 *  and something else (whatever the value is) when the value is available. Using such a callback and the .get() 
 *  method of PropertyDelegate means that you have to check the type of the result before using it. Consider using
 *  .getValue() or the .getOperation() methods for simpler handling in such a scenario.
 * 
 */

/*CLASS*/
function InitializeDelegatedProperty(desc, calcCallback, path, autoRefresh) {
    Initialize.call(this, desc, null);
    this.type = "Property delegate";
    this.calcCallback = calcCallback;
    if (typeof path == "string" || path == null) {
        this.path = path;
        this.autoRefresh = autoRefresh;
    } else if (typeof path == "number") {
        this.path = null;
        this.autoRefresh = path;
    }
};
InitializeDelegatedProperty.Inherit(Initialize, "InitializeDelegatedProperty");
InitializeDelegatedProperty.$currentPropCounter = 0;
InitializeDelegatedProperty.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
    var path = this.path;
    if (path == null) {
        path = "_delegatedAutoProperty" + (InitializeDelegatedProperty.$currentPropCounter++);
    }
    return obj.getDelegatedProperty(path, new Delegate(obj, Defaults.getValue (obj,this.calcCallback)),this.autoRefresh);
};
InitializeDelegatedProperty.prototype.defValueDescription = function () {
    var r = {
        value: "(null)",
        type: "Calculated property"
    };
    return r;
};
