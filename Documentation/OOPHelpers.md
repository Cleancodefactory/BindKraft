# OOP Helpers

These helpers are used in the normal `class` and `implementer` declarations. They add automatically generated implementations of some common features.

## Common parameters used

Most helpers have some common parameters. Among them is the `changeCallback` which can be specified in two ways:

 - as method name to call - see [changeCallback](#changeCallback)
 - as inline function - see [changeCallbackInPlace](#changeCallbackInPlace)

Another common parameter is [changeCallbackInPlace](#changeCallbackInPlace) which is again a callback, but specified for indexed properties.

### changeCallback - used by some helpers below

This one is specified as a string containing the name of the method to call whenever the property changes.

```Javascript
MyClass.prototype.MyCallback = function(propname, oldval, newval) {
    // code
    // return nothing
}
```

**propname** - Because this callback is a method, it can be potentially called for more than one property. For this reason the first argument is the name of the property that caused the call.

**oldval** - The old value

**newval** - The new value being set.

_Notice the force optional arguments that can configure a property to call its callback every time it is set, no matter if its value actually changes._

### changeCallbackInPlace

When the change callback is specified as in-place written function like here for instance:

```JAvascript
MyClass.ImplementProperty('somename', new Initialize('comment'), null, function(oldval, newval) { ... the body of the proc ...});
```

Then the function is called as method of the object (this points to it) and without the property name (because it is written inline, it is dedicated to this property and there is no point to pass a name like in the other case - when the name of the method to call is specified). In all other respects it is like the `changeCallback`.

```Javascript
function(oldval, newval) {
    // code
    // return nothing
}
```


### idxChangeCallback

```Javascript
function(value, index, store) { ... }
```
The easiest way is to dedicate it to this property. Individual value changes are not tracked, because the underlying object or array can be referenced from outside for performance reasons, which will leave many changes out. Still each call to `set_propname(index, value)` will invoke the function. It can be set as a `string` or `in-place function`, like the other callbacks and will be respectively an existing member of the class or function called with the `this` of the class instance. The arguments (available from v2.21.5)

**value** - the value being set

**index** - the index used (see notes below)

**store** - the `store object` used (the one created by the initializer - typically an object or array).

Notes: The property can be called with a single argument in which case the value replaces the `store object`. This is used when the content is changed as a whole and not property by property. This behavior should be considered when writing a callback.



## Helpers list

### ImplementProperty

```Javascript
MyClass.ImplementProperty("someprop", Initialize, pstore_or_force, changeCallback, force);
```

Adds setter and getter property `set_someporp`/`get_someprop` to the prototype. The value is held in variable named `$someprop` unless explicit name is passed through the `pstore` (3-d) argument, in which case it is used as name of the backing field (as-is). All parameters except the first one are optional and can be omitted or set to null with the same effect.

`"someprop"` is the name of the property to define.

`Initialize` is an instance of an Initialize derived class that specifies initial value, description and some type information.

`pstore_or_force` if string is an explicit name for the backing field (see above), if boolean acts like the `force` argument (the option added in v2.25.1).

`changeCallback` is a callback called when the property is changed.

`force` is a boolean that forces the callback to be called each time the property is set no matter if the value changes or not. (can be specified as 3-d argument if `pstore` is not needed. See above).

Example:
```Javascript
MyClass.ImplementProperty("size", new InitializeNumericParameter("Defines the size of ...", 0), "_size", function(old_v, new_v) {
    if (new_v < 0) throw "invalid size";
});
```
Regardless of which arguments are used which are left out, this method defines two members in your class. Following the example above they will be: `get_size()` and `set_size(v)`. One can choose to override any one of them or both (which makes the statement completely pointless). Overriding is usually done in inheriting classes or temporarily for debugging.

It is quite normal during the development process to start with a property implemented this way and later identify the need to implement it explicitly by removing the ImplementProperty and defining explicitly the get_xxxx and set_xxxx methods. Still the majority of the properties a class needs, especially visual components, are usually simple holders of bindable parameters and ImplementProperty is good enough way to save some coding. By using the callback custom logic can be added without the need to re-implement everything explicitly. The callback cannot stop the assignment operation and should not bypass it by setting a different value to the backing field. This is not conventional and will not be expected by other developers.


### ImplementActiveProperty

```Javascript

MyClass.ImplementActiveProperty(pname, Initialize, pstore, force,changeCallback);
MyClass.ImplementActiveProperty(pname, Initialize, pstore, pstore, force, changeCallback);

```

For the most part ImplementActiveProperty acts just like ImplementProperty, but it also defines an event (EventDispatcher) named `xxxx_changed` where xxxx is the `pname` (the property name). This event is fired each time the property changes or every time it is set (if `force` is specified as true like).

These properties 

### ImplementReadProperty

```Javascript
MyClass.ImplementReadProperty(pname, Initialize, pstore);
```

### ImplementWriteProperty

```Javascript
MyClass.ImplementWriteProperty(pname, Initialize, pstore);
```

### ImplementIndexedProperty

```Javascript
MyClass.ImplementIndexedProperty(pname, Initialize, pstore, idxChangeCallback);
```

### ImplementActiveIndexedProperty

```Javascript
MyClass.ImplementActiveIndexedProperty(pname, Initialize, pstore, idxChangeCallback);
```

### ImplementIndexedReadProperty

```Javascript
MyClass.ImplementIndexedReadProperty(pname, Initialize, pstore);
```

### ImplementIndexedWriteProperty

```Javascript
MyClass.ImplementIndexedWriteProperty(pname, Initialize, pstore);
```

### ImplementCollectorProperty

```Javascript
MyClass.ImplementCollectorProperty(pname, pstore, changeCallback);
```

### ImplementSmartProperty

```Javascript
MyClass.ImplementSmartProperty(pname, smartPropClass, ...propClassArgs);
```

### ImplementChainSetters

```Javascript
MyClass.ImplementChainSetters();
MyClass.ImplementChainSetters(prop1, prop2, ..., propN);
```

As the name suggests this helper enables creation of simple functions that set their corresponding properties to the value passed as argument and then return this. E.g. `x = new SomeClass();x.prop1(3).prop2("some text").prop3(true);`

This kind of syntax has limited use in BindKraft, because BindKraft maintains primarily a syntax more convenient for usage through bindings, however for class intended for usage explicitly from code, chaining is usual practice. This method offers some minimal help for this case, not always usable, but for simple classes it saves writing plumbing.