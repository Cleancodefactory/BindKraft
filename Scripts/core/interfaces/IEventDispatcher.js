/**
	Introduced much later this interface aims at making EventDispatcher exposable through proxies and stubs
	Not all methods of EventDispatcher are included, only the ones safe for work through a proxy.
*/
function IEventDispatcher() {}
IEventDispatcher.Interface("IEventDispatcher", "IInvoke", "IInvocationWithArrayArgs");

IEventDispatcher.prototype.get_adviseNewComers = function() { throw "not impl"; }
IEventDispatcher.prototype.set_adviseNewComers = function(v) { throw "not impl"; }

IEventDispatcher.prototype.set = function(args) { throw "not impl"; }
IEventDispatcher.prototype.isFrozen = function() { throw "not impl"; }

IEventDispatcher.prototype.add = function(handler, priority) { throw "not impl"; }
IEventDispatcher.prototype.remove = function(handler) { throw "not impl"; }
IEventDispatcher.prototype.removeAll = function() { throw "not impl"; }

IEventDispatcher.prototype.invoke = function() { throw "not impl"; }
IEventDispatcher.prototype.invokeWithArgsArray = function(args) { throw "not impl"; }

// Sets an argument translator - transforms all the arguments for the handlers
IEventDispatcher.prototype.get_translator = function() { throw "not impl"; }
IEventDispatcher.prototype.set_translator = function(v) { throw "not impl"; }