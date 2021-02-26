# EventDispatcher class

Provides direct `event` emission functionality in BindKraft. Emitting or firing an event is the act of calling all the subscribers one after another.

Subscribing for a EventDispatcher is done through its `add` method or by `data-on-$` bindings, or by using `readdata`/`writedata` binding entries and listing a reference to an EventDispatcher based event source.

Classes implement `events` by exposing members that hold an instance of an EventDispatcher. The name of the event is the name of the member. When created the EventDispatcher instances receive through their constructor a reference to the instance of the class that implements `event` using the EventDispatcher.

Having a reference to their host instance enables the EventDispatcher to automatically be aware of its state and modify their behavior somehow. While classes derived from EventDispatcher can use this in an arbitrary ways, the EventDispatcher class itself implements functionality that takes into account the `freeze` state of its host (if the host supports `IFreezable` interface).

`Freezing` is a technique that enables a mode in which events are not fired (emitted). This is useful in various scenarios, but most prominent one concerns the classes derived from `Base` class that serve as UI components. During their initialization they usually need to suspend the event firing until their initialization is complete and the view or other component in which they reside is also fully prepared for normal function.

## Initializers

`InitializeEvent` initializer is the preferred way to define events in BindKraft classes. The declaration is as simple as:

```Javascript
MyClass.prototype.someevent = new InitializeEvent("Description of the event");
```

Each instance of MyClass will have the `someevent`. In addition this initializer supports the Arguments method:

```Javascript
MyClass.prototype.someevent = new InitializeEvent("Description of the event").Arguments(ISomeInterface, null, ISomeOtherInterface);
```

The Arguments method is needed when declaring interfaces extending `IManagedInterface` to be used through LocalAPI or for inter-app communication. These techniques use proxies instead of exposing references to the classes passed as arguments and need an interface definition (that extends IManagedInterface) in order to be able to build a proxy, thus Arguments method of the initializer enables declaration of the interface that will be exposed for an object argument. The object passed in that argument place will be required to support the specified interface. Any positions for simple value arguments or plain object arguments are marked with `null`. In scenarios not involving LocalAPI or inter-app communication usage of the Arguments is not necessary.


## Implemented interfaces

IInvocationWithArrayArgs, IInvoke, IEventDispatcher

## Constructor

`new EventDispatcher(host[, translator])`

**host** - the object that owns the dispatcher and uses it as an event emitter. It is recommended to use the InitializeEvent initializer described above, but if this is inappropriate for some reason the usual routine is to create event dispatcher like `this.myevent = new EventDispatcher(this)`.

**translator** - optional argument equivalent to the property `set_translator`.

## Properties

### `get/set_adviseNewComers` boolean, default: false

A `boolean` property with default value of `false`. When set to `true` it instructs the dispatcher to implicitly call (advise) any newly registered subscribers with the last event (invocation) that happened before their registration. This is especially useful when synchronization issues has to be easily resolved when there is a chance that subscriber may be late for an event.

### get/set_translator

This property is not typically used in normal application code. It is for usage by the proxies used by the local service feature of BindKraft. They will use it internally to create proxy dispatcher and configure the to "translate" invocation arguments by creating automatically proxies for them when necessary.

While translators can be used for other purposes it is not a recommended practice, because this would involve unnecessary complexity for the almost any imaginable scenario - i.e. such a need would be most likely a result of bad planning.

## Methods

### reset()

Resets the state of the dispatcher (does not remove handlers). If the dispatcher has been invoked (fired) before this state is cleared (see adviseNewComers above).

### set(...arguments...)

Sets the "happened" state of the dispatcher. The dispatcher is not fired (invoked), but its state is set as if it was fired with the arguments passed to the `set` method. New subscribers will be advised for this "faked" event.

### isFrozen()

Returns a boolean indicating of the underlying host of the dispatcher is in frozen state.

### add(handler, priority)

Subscirbes the `handler` for the event implemented with this EventDispatcher. 

**handler** - can be a function, a `Delegate` or any object of a class supporting the  `IInvocationWithArrayArgs` interface. Most classes that implement `IInvoke` also implement `IInvocationWithArrayArgs`, but latter is chosen as it can provide invocation with both the `invoke` and the `invokeWithArgsArray` methods.

**priority** - optional value that determines the order of the handler among all the subscribers. Can be boolean, number or null and undefined. Handlers registered with priority of:
`true` - Are invoked first. All handlers registered with `true` are not guaranteed to be invoked in any particular order among themselves and any observed behavior should not be considered applicable in future versions.
`false`, null, undefined - Are invoked last - after all other handlers in no guaranteed order among the other handlers registered with `false`. null and undefined are equivalent of `false`.
`number` - Are invoked after all the handlers registered with `true` and before all the handlers registered with `false`. The handlers registered with a numeric priority are invoked in order corresponding to the number in rising order, thus a handler registered with 0 will be invoked before handler registered with 10.

### remove(handler)

Removes a handler by comparing it to the registered subscribers. The most secure way is to remove a handler by passing a reference to the same handler that has been subscribed with `add`. Any subscribers derived from BaseObject will be compared according to their `equals` method and allow more flexible management - check how the equals works in the handlers you register to find out if it is possible to remove them by using convenient comparison. 

For example `Delegate` class implements equals in a way that treats instances pointing to the same object and same member as equals and ignores any bound arguments while comparing them. The most convenient way to implement methods that will handle events is to use the `InitializeMethodDelegate` or `InitializeMethodCallback` initializers.


### removeByTarget(target)

A method with limited usefulness. Remove the handlers registered by a certain instance. In order this to work the registered handlers has to support the `ITargeted` interface (Delegate being the most popular case). Thus plain functions will not be affected even if they are wrappers of a Delegate. Still in certain well-thought usage scenarios this allows bulk management.

### removeAll()

Removes all the subscribers, but does not affect the "happened" state.

### invoke(... arguments ....)

Fires (emits) the event by calling/invoking all the subscribers with the specified arguments. The order of invocation is according to the priority parameter in the `add` method. Also this methods sets the dispatcher "happened" state so that new registrants can be also invoked with these arguments if the `adviseNewComers` property is set.

### invokeWithArgsArray(args[])

Like the `invoke` method, but takes the arguments as an array instead.

### getWrapper()

Returns a plain Javascript function that when called will invoke the dispatcher with the arguments passed to the function. This is especially useful when BindKraft events have to be fired by external for BindKraft facilities (like DOM events for instance) or code that is unaware of the fact that a function it calls is actually an event dispatcher (emitter).