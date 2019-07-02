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

```Javascript
    BaseObject.prototype.LASTERROR(code, text, method);
```

    Behaves like the static version, but when called with arguments sets the className to the name of the class of the current object.

See [Using LASTERROR](lastError.md)