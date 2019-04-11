# OOP Helpers

These helpers are used in the normal `class` and `implementer` declarations.

## Common parameters used

### changeCallback - used by some helpers below

The name of an instance function:
```Javascript
function(propname, oldval, newval) {
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
