# Class - OOP type information and checking

This is just a global object with a set of static methods providing a wide variety of ways to test, obtain and analyze type information for classes and interfaces.

## Static methods

### Class.is(class, type)

    Checks if a class definition is derived from a specific class type or if it supports an interface.

**class** - the name of the class or its definition.

**type** - The name of the type to check - either a class name or an interface name.

example:
```Javascript
    // 1
    if (Class.is(MyClass, "IFreezable")) { ... }
    // 2
    if (Class.is("MyClass", "Base")) { ... }
```
The above example checks if certain class supprts `IFreezable` interface (1) then checks if it is derived from the class `Base`. The class can be specified both as a string (the name of the class - 2) or the class definition itself (1)

### Class.supports(class, iface)

> Checks if the `class` supports the `iface` interface

### Class.fullClassType(cls)

> Returns the inheritance chain for the class `cls` as a string of names delimited with "::". This is a traditional representation from older version, supported for backward compatibility.

### Class.supportedInterfaces(cls, results, extending)

### Class.implementors(iface)

Returns an array of the class names of all the classes that support the `iface`.

### Class.funcDoc(func) (currently out of sync)

### Class.getInterfaceDef(iface) from v2.7.0

Returns the definition (the type) of an interface or null if it does not exist.

### Class.getInterfaceName(iface) from v2.7.1

Returns the name of the interface or null if it does not exist. Even if you have the name, you can check if it is valid this way.

### Class.doesextend(iface1, iface2) from v2.7.1

Checks if `iface1` extends `iface2` and returns true or false.

### Class.extendedInterfaces(iface) from v2.7.1

Returns an array of the names of all the interfaces extended by `iface` directly or indirectly.

### Class.extendedInterfaceDefs(iface) from v2.7.1

Like `extendedInterfaces`, but returns array containing the definitions (types) instead.

### Class.isrequestable(iface) from v2.7.1

### Class.typeKind(def) from v2.18

### Class.getClassDef(cls)

### Class.getType(t)

### Class.supportsMember(type, member)

### Class.supportsMethod(type, member)

### Class.getClassName(cls) from v2.16.3

### Class.defaultsOf(cls) from v2.7.3

### Class.classDataOf(cls, dataType) from v2.18

### Class.interfaceDataOf(cls, iface) from v2.18

### Class.classes([filterproc]) from v2.15

### Class.returnTypeOf(def, method) from v2.18

### Class.argumentsOf(def, method) from v2.18

### Class.argumentOf(def, method, index) from v.2.18

### Class.chunkTypeOf(def, method) from v2.18.5

### Class.eventArgumentsOf(def, eventname) from v2.18.5
