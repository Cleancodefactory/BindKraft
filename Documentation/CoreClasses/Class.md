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

### Class.funcDoc(func)

### Class.getInterfaceDef(iface)

### Class.getInterfaceName(iface)

### Class.doesextend(iface1, iface2)

### Class.doesexextendedInterfacestend(iface)

### Class.extendedInterfaceDefs(iface)

### Class.isrequestable(iface)

### Class.typeKind(def)

### Class.getClassDef(cls)

### Class.getType(t)

### Class.supportsMember(type, member)

### Class.supportsMethod(type, member)

### Class.getClassName(cls)

### Class.defaultsOf(cls)

### Class.classDataOf(cls, dataType)

### Class.interfaceDataOf(cls, iface)

### Class.classes([filterproc])

### Class.returnTypeOf(def, method)

### Class.argumentsOf(def, method)

### Class.argumentOf(def, method, index)

