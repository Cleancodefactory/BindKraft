

/*CLASS*/
function WeakDelegate(baseObj, objPropPath, func, params) {
    BaseObject.apply(this, arguments);
    this.baseObject = baseObj;
    this.objectProp = objPropPath;
    this.func = func;
    this.parameters = params;
}
WeakDelegate.Inherit(BaseObject, "WeakDelegate");
WeakDelegate.Implement(IInvocationWithArrayArgs);
WeakDelegate.Implement(IInvoke);
WeakDelegate.prototype.parameters = new Initialize("Array of parameters passed to the function after the explicit ones passed through invoke", null);
WeakDelegate.prototype.obliterate = function (bFull) {
    if (bFull) {
        BaseObject.obliterate(this.parameters); // Without bFull to avoid cyclic obliteration and nuclear winter.
    }
    // if (this.object != null) delete this.object;
    if (this.paremeters != null) delete this.parameters;
};
WeakDelegate.prototype.$getCallTarget = function () {
    var result = null;
    if (this.baseObject != null) {
        if (BaseObject.is(this.objectProp, "string")) {
            result = BaseObject.getProperty(this.baseObject, this.objectProp); 
        }
    }
    return result;
};
WeakDelegate.prototype.isConnected = function () {
    var ct = this.$getCallTarget();
    if (ct != null && (BaseObject.is(this.func, "string") || typeof this.func == "function")) {
        return true;
    }
    return false;
};
WeakDelegate.prototype.invoke = function () {
    var call_target = this.$getCallTarget();
    if (call_target == null) return null;
    var args = Array.createCopyOf(arguments);
    if (this.parameters != null && this.parameters.length > 0) args = args.concat(this.parameters);
    if (this.func != null) {
        if (BaseObject.is(this.func, "string")) {
            if (typeof call_target[this.func] != "function") {
                throw "The " + BaseObject.fullTypeOf(call_target) + " does not have a function member " + this.func;
            } else {
                return call_target[this.func].apply(call_target, args);
            }
        } else if (typeof this.func == "function") {
            return this.func.apply(call_target, args);
        }
    }
    return null;
};
WeakDelegate.prototype.invokeWithArgsArray = function (args) {
    var a = (args == null) ? [] : args;
    if (this.parameters != null && this.parameters.length > 0) a = a.concat(this.parameters);
    if (this.func != null) {
        if (BaseObject.is(this.func, "string")) {
            return call_target[this.func].apply(call_target, a);
        } else if (typeof this.func == "function") {
            return this.func.apply(call_target, a);
        }
    }
    return null;
};
WeakDelegate.prototype.equals = function (obj) {
    if (BaseObject.is(obj,"WeakDelegate")) {
        if (this.baseObject == obj.baseObject && this.func == obj.func && this.objectProp == obj.objectProp) {
            if (this.parameters == obj.parameters) return true;
            if (this.parameters != null && obj.parameters != null) {
                if (this.parameters.equals(obj.parameters)) return true;
            }
        }
    }
    return false;
};
WeakDelegate.prototype.getWrapper = function () {
    var localThis = this;
    return function () {
        var args = Array.createCopyOf(arguments);
        return localThis.invoke.apply(localThis, args);
    } .Obliterable();
};
WeakDelegate.createWrapper = function (baseObj, objPropPath, func, params) {
    return (new WeakDelegate(baseObj, objPropPath, func, params)).getWrapper();
};