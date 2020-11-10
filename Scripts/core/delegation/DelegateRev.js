/**
	DelegateRev inherits from Delegate and does the same, except it calls the encapsulated function with the arguments in different order -
	the sealed arguments go first in contrast to Delegate. The order of arguments in DelegateRev is like in Function.prototype.bind.
*/
function DelegateRev() {
	Delegate.apply(this, arguments);
}
DelegateRev.Inherit(Delegate,"DelegateRev");
DelegateRev.prototype.invoke = function () {
	if (this.__obliterated) return null;
    var args = [];
    this.called = true;
	if (this.parameters != null && this.parameters.length > 0) args = args.concat(this.parameters);
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    if (this.func) return this.func.apply(this.object, args);
    return null;
}.Description("Executes delegate ( function ), puts the sealed params first unlike Delegate");
DelegateRev.prototype.invokeWithArgsArray = function (args) {
	if (this.__obliterated) return null;
    var a = (args == null) ? [] : args;
    this.called = true;
    if (this.parameters != null && this.parameters.length > 0) {
		a = this.parameters.concat(a);
	}
    if (this.func) return this.func.apply(this.object, a);
    return null;
}.Description("Executes delegate ( function ) with specified parameters. Sealed parameters go first")
 .Param("args","Paramaeters with which the delegate ( function ) will be called")
 .Returns("object or null");
DelegateRev.prototype.invokeOn = function (thisObj) {
	if (this.__obliterated) return null;
    var a = Array.createCopyOf(arguments,1);
    if (this.parameters != null && this.parameters.length > 0) {
		a = this.parameters.concat(a);
	}
    if (this.func) return this.func.apply(thisObj, a);
    return null;
}.Description("Executes delegate ( function ) for an object")
 .Param("thisObj","Object over which the delegate will be executed")
 .Returns("object or null");
 
DelegateRev.prototype.invokeOnWithArgsArray = function (thisObj, args) {
	if (this.__obliterated) return null;
    var a = (args == null)?[]:args;
    if (this.parameters != null && this.parameters.length > 0) {
		a = this.parameters.concat(a);
	}
    if (this.func) return this.func.apply(thisObj, a);
    return null;
}.Description("Executes delegate ( function ) for an object, with specified parameters")
 .Param("thisObj","Object over which the delegate will be executed")
 .Param("args","Paramaeters with which the delegate ( function ) will be called")
 .Returns("object or null");
 
DelegateRev.prototype.equals = function (obj) {
    if (BaseObject.is(obj,"DelegateRev")) {
        if (this.object == obj.object && this.func == obj.func) return this.$eqaulsParameters(obj.parameters);
    }
    return false;
}.Description("Checks if delegates are equal")
 .Param("obj","DelegateRev to be checked")
 .Returns("true or false");
 
DelegateRev.createWrapper = function (obj, func, params) {
    return (new DelegateRev(obj, func, params)).getWrapper();
}.Description("Creates a delegate")
 .Param("obj","Object over which the delegate will be executed")
 .Param("func","Function for the delegate")
 .Param("params","Params with which the delegate will be executed")
 .Returns("object");