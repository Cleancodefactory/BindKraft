# IValueChecker interface

Very simple interface that enables transparent value checking for various conditions through some appliance. The appliance can be some custom implementation of the interface over an appropriate application's class or a class from a library of _value checkers_.

Currently BindKRaftJS provides two checkers: 
> [TypeChecker](TypeChecker.md) - checks if the value type corresponds to the pre-configured set of types.
> [PatternChecker](PatternChecker.md) - checks strings if they match certain pre-configured pattern.

## Why do you need this and when?

In many, if not most, cases these checks can be implemented in-place and using a separate class through this interface looks like overkill. This is true, but there are those scenarios where the value is passing through your code and reaches a target logic that can be changed for some reason - configuration, dynamic logic etc. Parameters that logic needs may change with it and the code in the middle is at loss if it needs to perform even trivial validation over them. These and similar scenarios is where the interface and its implementations come handy - the code cna be written to use a **checker** object which can be changed in turn. E.g. the checker can be from a property to which different object can be assigned, obtained from somewhere, passed as parameter and so on.

## Interface declaration

```Javascript

function IValueChecker() {}
IValueChecker.Interface("IValueChecker");
IValueChecker.prototype.checkValue = function(v);
IValueChecker.prototype.checkValueDescription = function (v);
```

IValueChecker.prototype.checkValue(v)

    Checks the value `v` and returns `true`/`false`.

>**v** - the value to check


IValueChecker.prototype.checkValueDescription(v)

    OPTIONAL IMPLEMENTATION. If implemented must return a string describing how the value fails the conditions implemented. Must return `null` if it is not implemented.

>**v** - the value to validate