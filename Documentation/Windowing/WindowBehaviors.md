# Window behaviors

Window behaviors are objects that can be attached to a window and interfere with its behavior by intercepting the window messages. In general they resemble somewhat the View (DOM) level behaviors - like them they are attached, but after that they remain mostly autonomous and unobtrusive.

Unlike DOM behaviors, for window behaviors it is possible for the rest of the code to cooperate with them, but most often only cooperation between behaviors is implemented. The other cases, however rare they might be, are necessary when the behaviors play a role of something one may call an "attached library" - code that can be asked to perform actions or calculations that depend on the current state of the window (or it is simply convenient to keep it as part of the window). Being attached to a window, behaviors are in a perfect position to do that.

If you want to read about implementing behaviors you can skip to [Inner workings](#inner-workings).

## Using window behaviors

All windows, starting with `BaseWindow`, implement the `IAttachedWindowBehaviors` interface. This interface enables attaching/detaching and accessing (previously attached) behaviors to a particular window (_keep in mind that normally the behaviors are attached to instances and not to classes_).

This is the interface (see its [page](../WindowClasses/IAttachedWindowBehaviors.md)):
```Javascript
function IAttachedWindowBehaviors() {}
IAttachedWindowBehaviors.Interface("IAttachedWindowBehaviors");
IAttachedWindowBehaviors.RequiredTypes("BaseWindow");
IAttachedWindowBehaviors.prototype.attachBehavior = function(wb);
IAttachedWindowBehaviors.prototype.detachBehavior = function(wb);
IAttachedWindowBehaviors.prototype.attachedBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.detachAllBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.adviseAttachedBehaviors = function(msg);
IAttachedWindowBehaviors.prototype.attachedBehavior = function(callback_or_name)
```

The interface has methods that are accessible and useful for both - the window itself and another code (usually the code that attached the behavior to this window). Below the methods are grouped by typical usage.

**Methods typically called by application code:**

### attachBehavior(/* IWindowBehavior */ wb[, /*string*/ name])
    - wb - A behavior instance. Must suport `IWindowBehavior` interface.
	- name - optional name for the attached behavior. A reference to the behavior can be obtained later by using the name with the `attachedBehavior` method 

Checks if the interface is supported and then registers the behavior with the window and initializes it (calls its `init` method).

If `name` is specified and non-empty string it has to be unique for all the attached behaviors to that window.

Returns the behavior (the `wb` argument) if it is successful and `null` otherwise.

Example:
```Javascript
var wnd = new SimpleViewWindow(/*arguments are skipped for brevity*/);
var beh = new MyWindowBehavior();
if (wnd.attachBehavior(beh) != null) {
	// all ok
}
```
_Remarks:_

>Multiple instances of the same behavior class can be attached to the same window if the behavior implementation _allows it_ (see `IWindowBehavior.get_uniquecallback` below). However, the uniqueness of the attached behavior is a two sided concern - for the behavior itself (it may be incapable to function in more than one instance) and for the code that attaches the behavior(s)


### detachBehavior(/* IWindowBehavior */ wb)
    - wb - A behavior instance. Must support `IWindowBehavior` interface.

Detaches the behavior specified if it is already attached.

Returns the behavior if it has been detached and null otherwise (i.e. was not attached, not a behavior)

### attachedBehaviors(/* f(wb) */ callback)
    callback - optional callback that will be called for each behavior and can return true or false in order to include or exclude it from the result - i.e. can filter the result.

Returns an array of all the behaviors or only of those the callback permits.

### detachAllBehaviors(/* f(wb) */ callback)
    callback - optional callback that will be called for each behavior and can return true or false in order to include or exclude it.

Detaches all the behaviors or if callback is used only those permitted by the callback.

### attachedBehavior(/* string | f(wb) */ name_or_callback)

Returns the identified behavior - either the first one for which the callback returns true or the behavior with the specified name (i thas to be registered with a name). This method is useful if the behavior provides some useful functionality.

### adviseAttachedBehaviors(/* WindowingMessage */ message)

Usually invoked internally to advise the behaviors for the messages received by the window. Sometimes it can be useful to invoke window message triggered functionality in one or more attached behaviors. This can be done for various reasons - basically of these two types: simulate message, usage of custom message as a trigger.



If you take a look at the interface you will notice that the designed usage pattern requires one to keep a reference to the behavior they attach to a window. If the behavior is attached for the entire life cycle of the window, but there are additional reasons that can make keeping the reference useful.

Cooperation with the behavior is one such case. This, of course, depends on what it does, but basically if the behavior can provide calculations or actions the application needs to use, it should keep the behavior at hand and call some special methods on it - methods designed to provide these services.

Keeping a reference to behaviors the application wants to call/query from time to time is easy, but to be useful it typically needs to be in relation to the window which they affect. In simple applications with a few windows this can be done easily in instance fields/properties. However in complex apps this can get tangled and one may should prefer to obtain reference to the behavior by querying a window of interest every time the need arises. Obviously a pre-designed callback that will fetch what's needed will make this easy through the `attachedBehaviors` window method. Designing an utility method to do that is a good idea.

TODO: usage example needed and some explanations.

## Inner workings

`BaseWindow` and consequently all other windows already implement the behavior support interface. You may need to use some of its methods to attach/detach and find attached behaviors. This is the interface (see its [page](../WindowClasses/IAttachedWindowBehaviors.md)):
```Javascript
function IAttachedWindowBehaviors() {}
IAttachedWindowBehaviors.Interface("IAttachedWindowBehaviors");
IAttachedWindowBehaviors.RequiredTypes("BaseWindow");
IAttachedWindowBehaviors.prototype.attachBehavior = function(wb);
IAttachedWindowBehaviors.prototype.detachBehavior = function(wb);
IAttachedWindowBehaviors.prototype.attachedBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.detachAllBehaviors = function(callback);
IAttachedWindowBehaviors.prototype.adviseAttachedBehaviors = function(msg);
```
As mentioned all windows already have it implemented. The `adviseAttachedBehaviors` is used by the windows themselves and is unlikely to be needed when implementing applications. One may need to call it when implementing new window classes, but even that is unlikely, because behaviors are already advised for almost everything important that happens with the window on which they are attached and it is not very likely more to be needed.

The rest of the methods manage the behaviors and are needed by any application that needs to adjust the behavior of some of its windows through behaviors:



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

Further the behavior can implement another functionality triggered from outside. This can be done in one or more ways. The basic principles are listed below, they can be used separately or in combination depending mostly on the expected kind of access to the behavior.

### Accessing a window behavior from outside.

* First of all the typical way to attach a window behavior is to instantiate it and then attach it to the window, This means the code that does that can keep a reference to the behavior and place it in convenient place (in an app for instance). Then the access to the behavior can be just a matter of using that reference to invoke some methods over its object.

* If the behavior has to be found randomly by code that may not have regular access to the app or the behavior is attached to the window multiple times with different parameters, then usage of a name when attaching the behavior is probably the easiest way. Then a reference to the behavior can be obtained by calling `attachedBehavior` method on the window where the behavior is attached.

* Behaviors can be also service locators. This gives them ability to provide access through findService techniques to either their own functionality or/and to other elements of the application. The `BaseWindow` (which means all windows) by default queries all behaviors supporting `IServiceLocator`. This technique is especially applicable when the features provided by the behaviors has to be queried in fairly abstract ways.

**Why should you want to access window behaviors?**

As mentioned above, most window behaviors are as the word "behavior" suggests - they are invisible by themselves and only their impact over the window gives them away. Still they are attached to the window which makes them also a very convenient for pinning some service like functionality to the window - if not for any other reason, then just because this it the logical choice for the function provided. 


