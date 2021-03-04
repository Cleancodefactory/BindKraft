# Window behaviors

Window behaviors are objects that can be attached to a window and interfere with its behavior by intercepting the window messages. In general they resemble the View (DOM) level behaviors - like them they are attached, but after that they remain mostly autonomous and unobtrusive.

It is possible for the rest of the code to cooperate with the window behaviors, but typically only cooperation between behaviors is implemented. The other cases, however rare they might be, are necessary when the behaviors play a role of something one may call an attached library - code that can be asked to perform actions or calculations that depend on the current state of the window. Being attached to it, behaviors are in a perfect position to do that.

## Inner workings

`BaseWindow` and consequently all other windows already implement the behavior support interface. You may need to use some of its methods to attach/detach and find attached behaviors. This is the interface:
```Javascript
function IAttachedWindowBehaviors() {}
IAttachedWindowBehaviors.Interface("IAttachedWindowBehaviors");
IAttachedWindowBehaviors.RequiredTypes("BaseWindow");
IAttachedWindowBehaviors.prototype.attachBehavior = function(wb[, name]);
IAttachedWindowBehaviors.prototype.detachBehavior = function(wb);
IAttachedWindowBehaviors.prototype.attachedBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.detachAllBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.adviseAttachedBehaviors = function(msg);
IAttachedWindowBehaviors.prototype.attachedBehavior = function( callback_or_name);
```
As mentioned all windows already have it implemented. The `adviseAttachedBehaviors` is used by the windows themselves and is unlikely to be needed when implementing applications. One may need to call it when implementing new window classes, but even that is unlikely, because behaviors are already advised for almost everything important that happens with the window on which they are attached and it is not very likely more to be needed.

The rest of the methods manage the behaviors and are needed by any application that needs to adjust the behavior of some of its windows through window behaviors:

### attachBehavior(/* IWindowBehavior */ wb [, name])
    - wb - A behavior instance. Must suport `IWindowBehavior` interface.

Checks if the interface is supported and then registers the behavior and initializes it (calls its `init` method).

The `name` argument is optional string that registers the behavior under that name. The name must be unique among all the attached behaviors to tha specific window. If a behavior with the same name is already registered, an attempt to register another one will cause exception.

Returns the behavior (the `wb` argument) if it is an `IWindowBehavior` and null otherwise.

### detachBehavior(/* IWindowBehavior */ wb)
    - wb - A behavior instance. Must suport `IWindowBehavior` interface.

Detaches the behavior specified if it is already attached.

Returns the behavior if it has been detached and null otherwise (i.e. was not attached, not a behavior)

### attachedBehaviors(/* f(wb) */ callback)
    callback - optional callback that will be called for each behavior and can return true or false in order to include or exclude it from the result - i.e. can filter the result.

Returns an array of all the behaviors or only of those the callback permits.

### detachAllBehaviors(/* f(wb) */ callback)
    callback - optional callback that will be called for each behavior and can return true or false in order to include or exclude it.

Detaches all the behaviors or if callback is used only those permitted by the callback.

### adviseAttachedBehaviors(msg)

	Enables all the attached behaviors to process the WindowingMessage being sent to the window. The default message loop calls it, so any window already calls this method for each processed message. The call occurs as part of the default processing and after calling the external handlers (this includes any on_<messagename> handlers passed with createParameters).

	The point at which the method is called during the message processing is relatively late, so this means that a window can prevent some messages from reaching the attached behaviors.

### attachedBehavior(name_or_callback)

	Returns the first found behavior that matches the conditions checked by the callback (f(beh):bool) or the first one named as specified (if string is passed as argument).

## Using existing behaviors

If you take a look at the interface you will notice that the designed usage pattern requires one to keep a reference to the behavior they attach to a window. If the behavior is attached for the entire life cycle of the window, but there are additional reasons that can make keeping the reference useful.

Cooperation with the behavior is one such case. This, of course, depends on what it does, but basically if the behavior can provide calculations or actions the application needs to use, it should keep the behavior at hand and call some special methods on it - methods designed to provide these services.

Keeping a reference to behaviors the application wants to call/query from time to time is easy, but to be useful it typically needs to be in relation to the window which they affect. In simple applications with a few windows this can be done easily in instance fields/properties. However in complex apps this can get tangled and one may should prefer to obtain reference to the behavior by querying a window of interest every time the need arises. Obviously a pre-designed callback that will fetch what's needed will make this easy through the `attachedBehaviors` window method. Designing an utility method to do that is a good idea.


## Creating a window bewhavior

Base interface
```Javascript
function IWindowBehavior() {}
IWindowBehavior.Interface("IWindowBehavior");
IWindowBehavior.prototype.init = function(/*BaseWindow*/ wnd);
IWindowBehavior.prototype.uninit = function(/*BaseWindow*/ wnd);
IWindowBehavior.prototype.pause = function();
IWindowBehavior.prototype.resume = function();
IWindowBehavior.prototype.isPaused = function();
```

Implement using the base class - the imp

```Javascript
function MyClass() {
	BaseObject.apply(this,arguments);
}
WindowBehaviorBase.Inherit(WindowBehaviorBase,"MyClass");
// WindowBehaviorBase.prototype.$window = null; // When initialized contains the window
WindowBehaviorBase.prototype.oninit = function(wnd) {
	// TODO: Override if needed. One can override init directly, but oninit is more convenient (no need to call the parent method).
}
WindowBehaviorBase.prototype.onuninit = function(wnd) {
	// TODO: Override if needed. One can override ubinit directly, but onuninit is more convenient (no need to call the parent method).
}
```

You can attach to window messages through `BaseWindow.registerExternalHandler` in `oninit`, but there is easier way:

	just define on_<messagename> methods and they will be called with a message parameter each time they are handled on the window on which you are attached.
	oninit and onuninit are more useful for implementation of a deeper attachments, for example: viewDelegate, connectToViewEvent of windows hosting views and other non-trivial hooks.


