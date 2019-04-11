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