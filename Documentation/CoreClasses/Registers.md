# Registers

In a platform like BindKraftJS there are a lot of resources, pieces of data and code that have to be registered somewhere and found when needed. The `Registers` is a global singleton object that serves as an ultimate _anchor point_ for registers holding such data.

Therefore Registers is a collection of registers, each serving specific purpose, but also each having some basic features shared by all of them.

## The Registers class and singleton

The global Register collection is accessed like

```Javascript
Registers.Default().somemethod(...arguments...)
```

`Registers.Default()` returns the singleton for the current workspace - the workspace working in the current WEB page. It has the following methods:

**addRegister** - adds a `register` to the global collection.

usage:
```Javascript
Registers.Default().addRegister(register)
```

Returns nothing, will throw exception if the register cannot be added

    - because one with the same name already exists
    - because the name is not allowed.

For more information about registers see [Register](Register.md)

**registerExists** - checks if certain register exists in the collection

**getRegister**

