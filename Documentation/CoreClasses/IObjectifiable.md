# IObjectifiable interface

Direct serialization of objects based on classes in Javascript usually impractical, because of the well-established practice to use JSON with Javascript.

In order to not restrict everything to JSON, but make it easy to use it `IObjectifiable` takes this approach:

>IObjectifiable enables an instance of a class to be reduced to plain Javascript object, arrays and other values and the reverse - constructed from such. Translation JSON from/to these plain structures is simple as calling `JSON.stringify/parse`, but still leaves open the opportunity to use different kinds of serialization without having to deal with the specifics of the class anymore.

## The interface

```Javascript
function IObjectifiable() {}
IObjectifiable.Interface("IObjectifiable");
IObjectifiable.prototype.objectifyInstance = function();
IObjectifiable.prototype.individualizeInstance = function(v);
```

## Utility methods

These methods are defined as static methods of the `IObjectifiable` in order to keep them thematically linked to the matter.

Most of these methods (`objectifyTo`, `objectifyAs`, `objectifyToAs`) are intended as helpers for the interface implementation.

The **instantiate** and **objectify** are helpers for invoking the process in the both directions over a reference to an object or data respectively.

```Javascript
IObjectifiable.instantiate = function(v);
IObjectifiable.objectify = function(inst);

IObjectifiable.objectifyTo= function(o,inst);
IObjectifiable.objectifyAs = function(inst,cls);
IObjectifiable.objectifyToAs = function(o,inst,cls);
```

TODO: continue the article ...