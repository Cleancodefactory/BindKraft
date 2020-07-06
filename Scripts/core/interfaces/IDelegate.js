/**
 * This interface was considered unneeded thanks to the existence of IInvoke and IInvocationWithArrayArgs
 * however a significant amount of code needs to be sure that an object is a delegate and not just something
 * invocable. In other words more features are expected when certain decisions have to be made and currently
 * there are many places where "Delegate" is expected instead of anything just invocable and this way variations
 * of delegate are difficult to support if they do not inherit from Delegate. 
 * 
 * This interface is added to allow the gradual refactoring of such code - to check for IDelegate.
 * 
 */
function IDelegate() {}
IDelegate.Interface("IDelegate", "IInvoke", "IInvocationWithArrayArgs", "IArgumentManagement", "ITargeted", "ICloneObject");

IDelegate.prototype.get_called = function() { throw "not implemented"; }
IDelegate.prototype.getWrapper = function() { throw "not implemented"; }
