# Runtime Self-Documenting and annotation

BindKraftJS carries several special function that can be used for self-documenting and annotation. They all attach pieces of information to classes and/or their members (in actuality classes are also functions for the Javascript itself.)

They are all chained and called over the member or class definitions.

## Warning

In the set of documenting functions there is no strict typed notation for anything. Information for the acceptable types and their meaning must be included in the descriptions. This is more suitable for Javascript in general,
because any type checking and type dependent behavior is up to the code that deals with it and can vary drastically.

## General syntax

Here is an example simple documentation of a little class
```Javascript
function MyClass() {
    SomeParentClass.apply(this,arguments);
}
MyClass.Inherit(SomeParentClass,"MyClass");
// Document the class itself
MyClass.Description("This class just demonstrates how to self-document");
MyClass.prototype.myMethod = function(/* number */ n, /* string optional */ s) {
    // ... The method body ...
}.Description("This method does something ...")
    .Param("n","The number of times to do that 'something'")
    .Param("s","Optionally name the 'something' as this parameter states)
    .Fires("overflowevent","impossibleevent");
// More members    
```

The class has to be documented on separate line (recommended) or as continuation of the Inherit statement (not recommended). Otherwise the methods are just suffixed with documenting functions.

The properties are documented in similar manner.

## Documenting functions

### Description(_text_)
usage:
```Javascript
MyClass.prototype.mymethod = function(a,b,c) { ... code ...}.Description("some description");
```
>Use only once. General description of a member or a class.

### Param(_paramname_, _paramdescription_)
usage:
```Javascript
MyClass.prototype.mymethod = function(a,b,c) { ... code ...}.Param("a","some description");
```
>Use only once per each parameter. The arguments themselves are parsed from the function's tex representation in viewers.

### Returns(_description_)
usage:
```Javascript
MyClass.prototype.mymethod = function(a,b,c) { ... code ...}.Returns("some description");
```
>Use only once per member. Describe the return result.

### Hide()

Instructs any documentation browsers that the class/member should not be listed.

## Annotation functions

These functions have deeper role - they attach information needed by certain parts of BindKraftJS. 

### ReturnType(iface)

Declares the method's return type. Meaningful only in interfaces intended for local proxy wrapping or remoting. These are interfaces extending:

- `IManagedInterface` - local proxy wrappable. These are used to expose LocalAPI or app services (see AppGate, LocalAPI, LocalAPIClient)

- `IRequestInterface` - remoting interfaces.

The type declared is `iface`. This must be name or definition (type) of a compatible interface - one that extends `IManagedInterface` or `IRequestInterface` depending on the purpose of the interface where the annotation is used.

It is not necessary for the annotated method to always return this type - it can also return basic types (e.g. number, string etc.), but if (in whichever cases) the method returns a BindKraft object at any circumstances it will have to support the declared interface.

## How to consume the documenting information