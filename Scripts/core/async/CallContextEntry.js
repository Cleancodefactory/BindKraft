
/*CLASS*/
// The context entry also supports a typed store - to enable the framework to avoid creating too much stacked contexts
// A single object of a given type can exist in the typed store. The stored objects must have a constructor that can behave well without arguments
// because of the obtain_typed method.
function CallContextEntry(owner, scheduler_or_entry) {
    BaseObject.apply(this, arguments);
    this.$owner = owner;
    if (BaseObject.is(scheduler_or_entry, "IProcessScheduler")) {
        this.$scheduler = scheduler_or_entry;
    } else if (BaseObject.is(scheduler_or_entry, "CallContextEntry")) {
        // TODO: Copy other system information
        this.$scheduler = scheduler_or_entry.get_scheduler;
    }
    
}
CallContextEntry.Inherit(BaseObject, "CallContextEntry");
CallContextEntry.Implement(IDataHolder);
CallContextEntry.prototype.$owner = null;
CallContextEntry.prototype.get_owner = function () { return this.$owner; };
CallContextEntry.prototype.set_owner = function (v) { this.$owner = v; };
CallContextEntry.prototype.$description = null; // This one should be used for debugging purposes - name the reason for context creation
CallContextEntry.prototype.get_scheduler = function () { return this.$scheduler; };
CallContextEntry.prototype.set_scheduler = function (v) {
    if (v != null && !BaseObject.is(v, "IProcessScheduler")) throw "Invalid argument, expected IProcessScheduler";
    this.$scheduler = v;
};
// Typed storage
CallContextEntry.prototype.$typedStore = new InitializeObject("A dictionary by type");
CallContextEntry.prototype.set_typed = function (obj) {
    if (BaseObject.is(obj, "BaseObject")) {
        this.$typedStore[obj.classType()] = obj;
    }
};
CallContextEntry.prototype.get_typed = function (_type) {
    return this.$typedStore[_type];
};
CallContextEntry.prototype.obtain_typed = function (_type) {
    var t = this.$typedStore[_type];
    if (t == null) {
        // Create one
        t = new Function.classes[_type]();
        if (t != null) {
            this.$typedStore[_type] = t;
        }
    }
    return t;
};
// Access to the currently executing async result  (if any)
CallContextEntry.prototype.currentAsyncResult = function () {
    if (BaseObject.is(this.$scheduler, "IProcessScheduler")) {
        return this.$scheduler.currentAsyncResult();
    }
    return null;
};