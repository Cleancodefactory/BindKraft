# BaseObject

Ultimate root class of all BindKraftJS classes.

Whenever a new class is created it has to inherit from BaseObject - directly or indirectly.

**This article is under construction**

## Static methods

### BaseObject.CombineObjects

```Javascript
    var obj = BaseObject.CombineObjects(arg1[, arg2, ... argN][,cbcontrol])
```

Combines each object passed as parameter into single object, property by property, overriding existing ones. The first `arg1` is patched with the available properties from the next arguments in the order in which they are supplied.

If the last argument `cbcontrol` is a `callback` (BaseObject.isCallback(x)) it is called on which property patch to allow or disallow it:

```Javascript
    Boolean cbcontrol(propname, exiting_value, override_value);
```
If it returns true the value is overwritten by the new one, if it returns false the process continues for the next one.

### BaseObject.LASTERROR

```Javascript
    BaseObject.LASTERROR([code [, text, [method]]])
```

    When used without any arguments returns the lastError object for inspection

To inspect the `lastError` object use one of these methods on it:

```Javascript
    ...
    var lasterror = BaseObject.LASTERROR();

    var x = lasterror.code(); // returns the error code
    x = lasterror.text(); // returns the text of the error
    x = lasterror.className(); // returns the className set to the error
    x = lasterror.method(); // returns the method name set to the error (often omitted)
```

When used with one or more arguments, resets the lastError object and sets the corresponding values. The static version leaves the className empty.

See [Using LASTERROR](lastError.md)

## Instance methods

These are available on all classes in BindKraftJS through inheritance unless overridden.

**Last error report and management**

### BaseObject.prototype.LASTERROR

```Javascript
    BaseObject.prototype.LASTERROR(code, text, method);
```

    Behaves like the static version, but when called with arguments sets the className to the name of the class of the current object.

See [Using LASTERROR](lastError.md)

### BaseObject.prototype.equals

```Javascript
BaseObject.prototype.equals(obj)
```

**obj** - object to compare with this one.

`obj` can be null or of a type that does not inherit from BaseObject (i.e. string, number etc.). The method returns `true` if the object is considered equal to this and `false` otherwise.

BaseObject's implementation will check id `obj` is null and return false immediately, then if obj is not null it will it with `this` using `==` and return the result.

Inheriting classes may choose various comparison strategies depending on the philosophy of the class hierarchy being built. Yet in almost all cases the implementation can simply first call BaseObject's implementation, thus ensuring the border cases are checked and then continue with the comparison. Example:

```Javascript
MyClass.prototype.equals = function(obj) {
    if (MyBaseClass.prototype.equals.call(this, obj)) return true;
    if (BaseObject.is(obj, "MyClass") && 
        obj.$someprop == this.$someprop) {
            return true;
        }
    return false;
}
```

The example considers the two objects equal based on single property, but after calling the parent class implementation first. If the BaseObject's implementation was not overriden it will do what was said above. On the other hand if it is overriden it may decide the objects are equal on more basic principles. 

In practice comparison in a class hierarchy is more often negative - the base class may find objects non equal on more general principles and only if it considers them equal there will be reason to continue and check if the added features in the child still allow them to be considered equal.

How useful is this? 

- Array has the added BindKraft methods `findElement`, `getElement`, `removeElement`, `replaceElement`, `addElement`, `insertElement`, `lastElement`, `addElements` that will enable only unique elements to be added to the array (providing the developer does not use any other methods to manage it). This is based on the `equals` method.
- Delegate will compare its instance and method thus helping EventDispatcher (for instance) to recognize the handler even if the Delegate's instance is different

and there are many others.


