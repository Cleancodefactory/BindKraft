/*
	The interface implemented by windows (it is implemented in BaseWidow, hence all windows have it) to support
	attachment of behaviors.
*/
function IAttachedWindowBehaviors() {}
IAttachedWindowBehaviors.Interface("IAttachedWindowBehaviors");
IAttachedWindowBehaviors.RequiredTypes("BaseWindow");
IAttachedWindowBehaviors.prototype.attachBehavior = function(/*IWindowBehavior*/ wb) { throw "not umpl"; }
IAttachedWindowBehaviors.prototype.detachBehavior = function(/*IWindowBehavior*/ wb) { throw "not umpl"; }
/**
 *  Returns all registered behaviors in an Array. Optionally can be called with a bool callback(behavior) which filters the result (true - include, false - exclude).
 */
 IAttachedWindowBehaviors.prototype.attachedBehaviors = function(callback) { throw "not impl"; }
 /**
 *  Detaches all registered behaviors. Optionally can be called with a bool callback(behavior) which filters which behaviors to detach.
 */
IAttachedWindowBehaviors.prototype.detachAllBehaviors = function(callback) { throw "not impl"; }

IAttachedWindowBehaviors.prototype.adviseAttachedBehaviors = function(msg) { throw "not impl"; }
