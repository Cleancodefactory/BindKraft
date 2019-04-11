


/*IMPL HELPER*/
// Usage: MyClass.Implement(IStructuralQueryProcessorImpl);
function IStructuralQueryProcessorImpl() { }
IStructuralQueryProcessorImpl.InterfaceImpl(IStructuralQueryProcessor);
IStructuralQueryProcessorImpl.classInitialize = function(cls) {
    cls.onStructuralQuery = function(stype, method) {
        if (cls.prototype.$queryDispatchTable == null) cls.prototype.$queryDispatchTable = { };
        cls.prototype.$queryDispatchTable[stype] = method;
    };
};
IStructuralQueryProcessorImpl.inheritorInitialize = function(cls) {
    cls.onStructuralQuery = function(stype, method) {
        //cls.prototype["method"] = method;
        if (cls.prototype.$queryDispatchTable == null) {
            cls.prototype.$queryDispatchTable = { };
        } else {
            var p = { };
            copyFunctionPrototype(p, cls.prototype.$queryDispatchTable);
            cls.prototype.$queryDispatchTable = p;
        }
        cls.prototype.$queryDispatchTable[stype] = method;
    };
};
IStructuralQueryProcessorImpl.prototype.processStructuralQuery = function(query, processInstructions) {
    if (this.$queryDispatchTable != null) {
        var handler = this.$queryDispatchTable[query.classType()];
        if (handler != null && typeof handler == "function") {
            return handler.call(this, query, processInstructions);
        }
    }
    return false;
};