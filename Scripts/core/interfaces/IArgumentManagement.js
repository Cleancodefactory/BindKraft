/*
	Manages an argument list (function call like one). Usually implemented by classes that use the argument list for some function call or calls at some point.
	Special attention deserve the usage in Delegate and ControllaleAsyncResult where through this interface are managed the arguments (or part of them - Delegate) that
	will be used when the instances of these class eventually call a function/method or other callable object with.

*/
function IArgumentManagement() { }
IArgumentManagement.prototype.callArguments = function (/*argument list*/) { }; // from arguments
IArgumentManagement.prototype.applyArguments = function (argsArray) { }; // from array
// USe this one to determine if the above feature works
IArgumentManagement.prototype.supportsArguments = function () { return false; };