


// This class is mostly event dispatcher, but its purpose is different.
//  Classes that need to support deferred/on demand execution of some internal operations can accept it 
//  as constructor parameters or with some methods/properties and they can attach those operations to it.
//  The code that passed the object then can invoke them when appropriate.
/*CLASS*/
function DeferredExecution(target) {
    EventDispatcher.apply(this, arguments);
}
DeferredExecution.Inherit(EventDispatcher, "DeferredExecution");
DeferredExecution.prototype.go = function () { this.invoke(); };
