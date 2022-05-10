/**
	Introduced much later this interface aims at making EventDispatcher exposable through proxies and stubs
	Not all methods of EventDispatcher are included, only the ones safe for work through a proxy.
*/
function IEventDispatcher() {}
IEventDispatcher.Interface("IEventDispatcher", "IInvoke", "IInvocationWithArrayArgs");

IEventDispatcher.prototype.get_adviseNewComers = function() { throw "not impl"; }
IEventDispatcher.prototype.set_adviseNewComers = function(v) { throw "not impl"; }
/**
 * Sets the last used arguments to the "happened" state (see adviseNewComers for details).
 * Virtually always the arguments passed to set are the same one would pass to invoke.
 */
IEventDispatcher.prototype.set = function(args) { throw "not impl"; }

IEventDispatcher.prototype.isFrozen = function() { throw "not impl"; }

IEventDispatcher.prototype.add = function(handler, priority) { throw "not impl"; }
IEventDispatcher.prototype.remove = function(handler) { throw "not impl"; }
IEventDispatcher.prototype.removeAll = function() { throw "not impl"; }

/**
 * When called invokes all the registered handlers. 
 * - If any handler returns === false it is called and then unregistered
 * - If any handler returns === true the remaining handlers are not invoked this time and true is returned
 * Any arguments passed to the invoke are passed as arguments to the handlers. If the handlers have preserved (bound)
 * arguments they will be passed AFTER the explicit ones passed to the invoke.
 */
IEventDispatcher.prototype.invoke = function() { throw "not impl"; }
/**
 * Like invoke, but accepts the arguments as array (similar to Function.apply as opposed to Function.call)
 * @param {Array} args 
 */
IEventDispatcher.prototype.invokeWithArgsArray = function(args) { throw "not impl"; }

// Sets an argument translator - transforms all the arguments for the handlers
IEventDispatcher.prototype.get_translator = function() { throw "not impl"; }
IEventDispatcher.prototype.set_translator = function(v) { throw "not impl"; }