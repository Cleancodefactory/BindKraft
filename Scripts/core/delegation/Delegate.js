/*CLASS*/
function Delegate(obj, func, params) {
    BaseObject.apply(this, arguments);
    this.object = obj;
    if (obj != null && typeof func == "string") {
        this.func = obj[func];
    } else {
        this.func = func;
    }
    this.parameters = params;
};
Delegate.Inherit(BaseObject, "Delegate");
Delegate.interfaces = { PDelegate: true };
Delegate.Implement(IInvocationWithArrayArgs);
Delegate.Implement(IInvoke);
Delegate.Implement(ITargeted);
Delegate.Implement(IArgumentManagement);
Delegate.Implement(ICloneObject);
Delegate.prototype.get_target = function() {
    return this.object;
};
Delegate.prototype.called = false; // Set to true when the delegate is called
Delegate.prototype.parameters = new Initialize("Array of parameters passed to the function after the explicit ones passed through invoke", null);
Delegate.prototype.obliterate = function (bFull) {
    if (bFull) {
        BaseObject.obliterate(this.object, this.parameters); // Without bFull to avoid cyclic obliteration and nuclear winter.
    }
    if (this.object != null) delete this.object;
    if (this.parameters != null) delete this.parameters;
    this.__obliterated = true;
};
Delegate.prototype.cloneObject = function(withruntimestate) {
    var params = null;
    if (BaseObject.is(this.parameters, "Array")) params = Array.createCopyOf(this.parameters);
    var d = new Delegate(this.object, this.func, params);
    if (withruntimestate) {
        d.called = this.called;
    }
    return d;
}
Delegate.prototype.invoke = function () {
	if (this.__obliterated) return null;
    var args = [];
    this.called = true;
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    if (this.parameters != null && this.parameters.length > 0) args = args.concat(this.parameters);
    if (this.func) return this.func.apply(this.object, args);
    return null;
}.Description("Executes delegate ( function )");

Delegate.prototype.invokeWithArgsArray = function (args) {
	if (this.__obliterated) return null;
    var a = (args == null) ? [] : args;
    this.called = true;
    if (this.parameters != null && this.parameters.length > 0) a = a.concat(this.parameters);
    if (this.func) return this.func.apply(this.object, a);
    return null;
}.Description("Executes delegate ( function ) with specified parameters")
 .Param("args","Paramaeters with which the delegate ( function ) will be called")
 .Returns("object or null");

Delegate.prototype.invokeOn = function (thisObj) {
	if (this.__obliterated) return null;
    var a = Array.createCopyOf(arguments,1);
    if (this.parameters != null && this.parameters.length > 0) a = a.concat(this.parameters);
    if (this.func) return this.func.apply(thisObj, a);
    return null;
}.Description("Executes delegate ( function ) for an object")
 .Param("thisObj","Object over which the delegate will be executed")
 .Returns("object or null");
 
Delegate.prototype.invokeOnWithArgsArray = function (thisObj, args) {
	if (this.__obliterated) return null;
    var a = (args == null)?[]:args;
    if (this.parameters != null && this.parameters.length > 0) a = a.concat(this.parameters);
    if (this.func) return this.func.apply(thisObj, a);
    return null;
}.Description("Executes delegate ( function ) for an object, with specified parameters")
 .Param("thisObj","Object over which the delegate will be executed")
 .Param("args","Paramaeters with which the delegate ( function ) will be called")
 .Returns("object or null");

Delegate.prototype.equals = function (obj) {
    if (BaseObject.is(obj,"Delegate")) {
        if (this.object == obj.object && this.func == obj.func) return true;
    }
    return false;
}.Description("Checks if delegates are equal")
 .Param("obj","Delegate to be checked")
 .Returns("true or false");

Delegate.prototype.getWrapper = function () {
	if (this.__obliterated) return null;
    var localThis = this;
    return function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        return localThis.invoke.apply(localThis, args);
    }.Obliterable();
}.Description("...");

Delegate.createWrapper = function (obj, func, params) {
    return (new Delegate(obj, func, params)).getWrapper();
}.Description("Creates a delegate")
 .Param("obj","Object over which the delegate will be executed")
 .Param("func","Function for the delegate")
 .Param("params","Params with which the delegate will be executed")
 .Returns("object");

Delegate.wrapCallback = function (cb) {
    if (BaseObject.is(cb, "Delegate")) return cb.getWrapper();
    if (typeof cb == "function") return cb;
    return null;
}.Description("...")
 .Param("cb","Delegate or function")
 .Returns("object or null");

Delegate.prototype.callArguments = function (/*argument list*/) {
    this.parameters = Array.createCopyOf(arguments);
}.Description("...");  // from arguments

Delegate.prototype.applyArguments = function (argsArray) {
    if (BaseObject.is(argsArray, "Array")) {
        this.parameters = Array.createCopyOf(argsArray);
    } else if (argsArray == null) {
        this.parameters = null;
    }
}.Description("Adds parameters to the delegate ( function )")
 .Param("argsArray","Parameters to be added");   // from array

// Use this one to determine if the above feature works
Delegate.prototype.supportsArguments = function () { return true; };

// Various stuff using delegation, but not part of the Delegate implementation
Delegate.stubAProperty = function(stubbedInstance, stubbedPropertyName, toInstance, toPropertyName,modes) {
	if (!BaseObject.is(stubbedInstance, "BaseObject") || !BaseObject.is(toInstance,"BaseObject")) {
		BaseObject.LASTERROR(_Errors.compose(), "Both the instance of the stubbed property and the instance to which the stub property will be redirected are required (can't be null)");
		return false; // Can't do it
	}
	if (typeof stubbedPropertyName !== "string" || typeof toPropertyName !== "string") {
		BaseObject.LASTERROR(_Errors.compose(), "Both property names are required");
		return false; 
	}
	if (modes != null && typeof modes !== "string") {
		BaseObject.LASTERROR(_Errors.compose(), "Incorrect mode must be 'get,set' or just one of the both");
		return false; 
	}
	var _modes = modes || "get"; // use "get,set"
	var arr = _modes.split(",");
	var result = false;
	if (arr != null) {
		for (var i = 0; i < arr.length;i++) {
			if (arr[i] == "get") {
				stubbedInstance["get_" + stubbedPropertyName] = Delegate.createWrapper(toInstance, "get_" + toPropertyName);
				result = true;
			} else if (arr[i] == "set") {
				stubbedInstance["set_" + stubbedPropertyName] = Delegate.createWrapper(toInstance, "set_" + toPropertyName);
				result = true;
			}
		}
	}
	return result;	
}