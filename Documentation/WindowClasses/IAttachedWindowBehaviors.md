# IAttachedWindowBehaviors interface

Implemented by windows (classes inheriting [BaseWindow](BaseWindow.md)). There is an implementor, but as it is currently implemented by BaseWindow - all windows implement it, inheriting this from their parent class. Because of that, this document actually describes the only implementation in use in current versions of BindKraftJS.

```Javascript
function IAttachedWindowBehaviors() {}
IAttachedWindowBehaviors.Interface("IAttachedWindowBehaviors");
IAttachedWindowBehaviors.RequiredTypes("BaseWindow");
IAttachedWindowBehaviors.prototype.attachBehavior = function(wb [,name]);
IAttachedWindowBehaviors.prototype.detachBehavior = function(wb);
IAttachedWindowBehaviors.prototype.attachedBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.detachAllBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.adviseAttachedBehaviors = function(msg);
IAttachedWindowBehaviors.prototype.attachedBehavior = function(callback_or_name);
```

## Methods

**attachBehavior**

    Attaches a behavior to the window.

>**wb** - the behavior instance (has to be created before calling the method)

>**name** - optional. A name for the behavior. Later this name can be used with the **attachedBehavior** method (see below).

**detachBehavior**

    Detach the behavior from the window.

>**wb** - the behavior's instance. In order to call this method the code that created the behavior must preserve its reference appropriately.

**attachedBeharviors**

    Returns all behaviors or only those seleced by the callback

>**callback** - An optional selection callback, see the `callback` in the bottom of the list.

**detachAllBehaviors**

    Detaches all the behaviors from the window or only those selected by the callback.

>**callback** - see at the bottom of the list.

**adviseAttachedBehaviors**

    Called by the window itself - sends a window message to all currently attached window behaviors that handle it (those that have on_{MessageName} methods).

>**msg** - the windowing message.

    Although it is possible to send message to the behaviors without sending it to the window, this is not recommended, because it can bypass some vital part of the window's specific functionality.

**attachedBehavior**

    Finds and returns the first attached behavior that either is selected by the callback or is attached with the specified name.

>**callback_or_name** - This can be a callback or a string specifying the name of the attached behavior to return.

>**returns** the first found behavior or null otherwise.

**callback**

This argument can be given to some of the interface methods to select one or more attached behaviors. The callback can be the usual callback in BindKraft, but as it needs to return `true` in order select a behavior only a `function` or a `Delegate` will make sense to be passed. The prototypes is

`function(behavior): returns boolean`

For example a callback looking for a specific class name will look like this:

```Javascript
function (behavior) {
    if (BaseObject.is(behavior,"MySpecificBehaviorClassName")) return true;
    return false;
}
```

To pack an instance method as callback use `new Delegate(this,this.theMethod)`.