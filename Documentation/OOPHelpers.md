# OOP Helpers

These helpers are used in the normal `class` and `implementer` declarations.

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
function() { ... }
```
It has to be dedicated to this property. Individual value changes are not tracked, because the underlying object or array can referenced from outside for 
performance reasons, which will leave many changes untracked.




## Helpers list

### ImplementProperty

```Javascript
MyClass.ImplementProperty("someprop", Initialize, pstore, changeCallback);
```

### ImplementActiveProperty

```Javascript
MyClass.ImplementActiveProperty(pname, Initialize, pstore_or_force,force_in,changeCallback);
```

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
