# Register

A `register` is an instance of some class that implements IRegister interface. These are registered with the global [Registers](Registers.md) collection and obtained from their by any code that needs to find something in them.

A register typically serves a specific purpose and holds certain pieces of data/code that must be found under well-known previously registered names. See more info about some of the standard registers later in this document.

## IRegister

A register has to support this interface:

```Javascript
function IRegister() {}
IRegister.Interface("IRegister");
IRegister.prototype.get_registername = function();
IRegister.prototype.register = function(key, item);
IRegister.prototype.unregister = function(key, /*optional*/ item);
IRegister.prototype.item = function(key, /*optional*/ aspect);
IRegister.prototype.exists = function(key);
```