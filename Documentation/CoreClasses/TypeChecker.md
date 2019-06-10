# TypeChecker class

A simple utility class to help implement configurable/variable value type checks. Sometimes it is used just as convenience or as future-proofing even if the current implementation does not need variable type checking conditions.

## Class definition

**constructor**

TypeChecker(typecoditions)

    Creates a type checker.

>**typeconditions** - any number of arguments, each specifying a condition. All conditions must be met in order `checkValue` to return `true`. The syntax of each argument is the same as for the argument of `addCondition` method (see it below)

**Methods**

TypeChecker.prototype.addCondition(c)

    Adds a single type check condition.

>**c** - a single condition. The condition can be:

1. BindKraftJS type definition - class or interface. The check is successful if the checked value is of the specified type/supports the specified interface

2. A string containing one or more type names, separated by commas and without any spaces. The check is successful if the checked value is of any of the specified types.

3. Like 2, but starting with `!`. This is a negative form and the check is NOT successful if the value is of one of the specified types.

The type names are the names of the BindKraftJS class and interface names and the following keywords:

> `string`, `number`, `boolean`, `undefined`, `bigint`, `null`, `Date`, `Array`

- `bigint` is a browser supported type added relatively recently.

- `null` characterizes the value of `null` wint non-strict comparison (i.e. undefined values will be recognized as null).

- `Date` and `Array` are the Javascript types patched by BindKRaftJS.

TypeChecker.prototype.clearConditions()

    Clears all the configured conditions (with addCondition or through the constructor)

TypeChecker.prototype.checkType(v)
TypeChecker.prototype.checkValue(v)

    Both methods do the same (checkType is an alias for checkValue). Perform the check according to the currently configured conditions.

>**v** - the value to check


**Static methods**

TypeChecker.check(typechecker, value)

    Checks the value with the specified type checker. This is a convenience method enabling you to specify both the value to check and the checker as  arguments.

>**typechecker** - a TypeChecker instance or a string specifying a single BindKraftJS class or interface name.

>**value** - the value to check


**Predefined type checkers**

TypeChecker.ValueType

    Checks if the value is a simple (value) type. This distinction in Javascript is not as clear as it is in languages like C# or Java, but is still rather convenient.

Defined as:

```Javascript
TypeChecker.ValueType = new TypeChecker("string", "number", "boolean", "undefined", "null", "bigint");
```

TypeChecker.BaseObject

    Checks if the value is a BindKraftJS class instance or null.

Defined as:

```Javascript
TypeChecker.BaseObject = new TypeChecker("BaseObject", "null");
```

TypeChecker.Object

    Checks if the value is plain Javascript object - not foolproof. Not recommended if you mix other libraries with BindKraftJS.

Defined as:

```Javascript
TypeChecker.Object = new TypeChecker("!BaseObject", "object", "null", "!Date","!Array");
```


