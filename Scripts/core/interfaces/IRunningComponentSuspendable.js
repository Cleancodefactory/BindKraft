/**
 * This is an extension of the IRunningComponent interface that defines a suspendable component.
 * Implement this interface to implement both if you want the component you write to be not only
 * able to start/stop, but also capable of temporary pausing its function.
 * 
 * See all the comments for the IRunningComponent.
 * 
 * Be aware that distinction between stopping and pausing can be subjective and dependent on the 
 * specifics of the application. When deciding to use the running component abstraction it is 
 * recommended to clearly define what it means in your specific context and determine if pausing
 * is applicable or not.
 * 
 * A helpful factor for planning running components is the data that can be passed to the 
 * IRunningComponent.startRunningComponent method. The 
 */
(function(){
    function IRunningComponentSuspendable() {}
    IRunningComponentSuspendable.Interface("IRunningComponentSuspendable", "IRunningComponent");

    IRunningComponentSuspendable.prototype.pauseRunningComponent = function() { throw "not impl."; }
    IRunningComponentSuspendable.prototype.resumeRunningComponent = function() { throw "not impl."; }
})();

