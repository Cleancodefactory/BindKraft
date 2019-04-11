


// Universal multipurpose query. The processor should just call the proc on itself. The support is determined by the exitence of the procedure
// and optional permission policy applied by the processor (recommended, at least a list of allowed procedures should be implemented)
/*CLASS*/ /*QUERY*/
function CallQuery(proc) {
    this.proc = proc;
    this.args = Array.createCopyOf(arguments, 1);
    this.result = null;
}
CallQuery.Inherit(BaseObject, "CallQuery");
// Handler implementation helper
// Usage: CallQuery.handlers(MyClass).<yourhandler> = function(...) { ... }
CallQuery.handlers = function(cls) {
    if (cls.prototype.$callQueryHandlers == null) cls.prototype.$callQueryHandlers = {};
    return cls.prototype.$callQueryHandlers;
};
// handling
// Usage: MyClass.prototype.processStructuralQuery = function(query, procInstruction) {
//  ... if (CallQuery(this,query)) return true; ...
//}
CallQuery.handle = function (_this, query) {
    if (BaseObject.is(query, "CallQuery")) {
        if (_this.$callQueryHandlers != null && _this.$callQueryHandlers[query.proc] != null && typeof _this.$callQueryHandlers[query.proc] == "function") {
            query.result = _this.$callQueryHandlers[query.proc].apply(_this, query.args);
            return true;
        }
    }
    return false;
};
// Client helper (_this, proc /*,args*/)
CallQuery.invoke = function(_this, proc /*,args*/) {
    var el = null;
    if (BaseObject.is(_this, "Base")) {
        el = _this.root;
    } else {
        el = _this;
    }
    var p = new CallQuery(proc);
    p.args = Array.createCopyOf(arguments, 2);
    JBUtil.throwStructuralQuery(el, p);
    return p.result;
};