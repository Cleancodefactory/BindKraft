# IWindowBehavior interface

This interface is implemented by Window behavior implementations. A base class exists and can be inherited for that purpose: see [WindowBehaviorBase](WindowBehaviorBase.md) and [Window behaviors](../Windowing/WindowBehaviors.md).

```Javascript
function IWindowBehavior() {}
IWindowBehavior.Interface("IWindowBehavior");
IWindowBehavior.prototype.init = function(/*BaseWindow*/ wnd);
IWindowBehavior.prototype.uninit = function(/*BaseWindow*/ wnd);
IWindowBehavior.prototype.pause = function();
IWindowBehavior.prototype.resume = function();
IWindowBehavior.prototype.isPaused = function();
IWindowBehavior.prototype.get_unique = function();
```

## Members

**init**

    Called when the behavior is attached to a window.

>**wnd** - the window ([BaseWindow](BaseWindow.md) derived) to which the behavior is being attached

**uninit**

    Called when the behavior is detached from a window

>**wnd** - the window from which the behavior is being detached.

**pause**

    When called the behavior should pause its functionality and do nothing (no reactions to messages) until un-paused by a call to resume().

**resume**

    When called the behavior should resume its functions and start processing messages normally.

**isPaused**

    Must return the current state of the behavior - `true` if the behavior is paused, `false`-like otherwise.

**get_uniquecallback**

    This is implemented in `WindowBehaviorBase` by default as a callback that compares behaviors by their class.

## Remarks

In the overwhelming majority of cases inheriting the `WindowBehaviorBase` is the right way to implement a new behavior. Only some very untypical cases may require the programmer to implement the interface directly.

**Using the same instance of the behavior on multiple windows.**

This is _sometimes_ possible, but the behavior has to be able to work that way. `WindowBehaviorBase` does not support this, but supports forbidding it (see nomultiuse argument of the `WindowBehaviorBase` constructor).

To implement a behavior capable of `multiuse` one has to depend only on the windowing messages and not use instance fields (of the behavior) for anything related to a specific window. For example take a behavior that wants to maximize windows if they are sized beyond certain size (assume the behavior inherits from `WindowBehaviorBase`)

The implementation of on_SizeChanged should go this way:

```Javascript
MyWinfowBehavior.prototype.on_SizeChanged = function (msg) {
    this.$inspectAndAdjustTheSize(msg.target);
}
```

The window is obtained from `msg.target` - from the windowing message and not from a field populated during init. So, **it will be incorrect** to it this way:

```Javascript
MyWinfowBehavior.prototype.on_SizeChanged = function (msg) {
    this.$inspectAndAdjustTheSize(this.$window);
}
```

We assume "inspectAndAdjustTheSize" above does the job - makes the example short and readable.

**Can they be found from the outside?**

Most window behaviors just listen for some windowing messages and do something to the window. However there are those that need to be exposed and called directly from the outside:

### Calling window behaviors from outside

As the window behaviors are run-time animal, some code creates them and attaches them to certain window/windows. So, for this code the behavior's instance is known, because it creates it.

Sometimes different pieces of code have to access the behavior (knowing somehow it is there, or at least expecting it).