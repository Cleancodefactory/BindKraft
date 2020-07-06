/**
 * Provides 2 ways to manage your event handlers on instances of your classes:
 * - (global) handlers group - all handlers are managed together and can be detached from their sources
 *      with a single call (unsubscribeAll).
 * - (multiple groups) any number of named groups of handlers can be managed - each group separately.
 * 
 */
function IEventSubscriber() {}
IEventSubscriber.Interface("IEventSubscriber");
// Global management
IEventSubscriber.prototype.subscribeFor = function(eventDisp, handler, priority) { throw "not impl"; }
IEventSubscriber.prototype.unsubscribeAll = function() { throw "not impl"; }
// Multiple groups management
IEventSubscriber.prototype.handlerGroup = function(name) { throw "Not implemented";}