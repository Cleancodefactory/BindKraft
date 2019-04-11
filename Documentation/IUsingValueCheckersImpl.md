# Using value checkers (IValueChecker) with ease
The `IValueChecker` interface enables implementation of relatively simple utility classes that can systemize, simplify and even more importantly make configurable the verification of the conditions certain values must meet.

This goes deep into the code and condition checks that are part of the normal code flow can be refactored to use instances of IValueChecker instead of ad hoc code. For example a code segment in some member implementation in some class may initially look like (2 cases shown as example):
```Javascript
    .... function(v) {
        .....
        if (v != null && BaseObject.is(v,"ISomeInterface")) {
            // do something
        } else {
            // do what's needed if the value does not match
        }
    }
    // Or another example
    .... function(v) {
        .....
        if (v == null || (typeof v == "string" && v.length > 10 && someregexp.test(v)) {
            // do something
        } else {
            // do what's needed if the value does not match
        }
    }
```
Such segments of code (and they can be more complicated) can be turned into something like this:
```Javascript
    .... function(v) {
        .....
        if (this.checkValueWith(this.get_paramxchecker(), v)) {
            // ok do something
        } else {
            // The value is not ok - react to this.
        }
    }
```

So, the verification has been moved to something we hold in the paramxchecker property of our class and we just use it. While this could be something you do not want in some cases where everything that needs to be verified is clear and will never change, because it is an integral part of the logic, in other cases you will be checking some intermediate value that will be passed in the end to some other code through an abstract interface - some sort of polymorphism. This may be not the only case that illustrates the benefit, but is one of the best. So, if you know in each particular case what this code would be this time, you will know that this implementation will need "this kind of value" and other will 
require "that kind of value". This can easily multiply and turn your code int a nightmare of nested if-s and switches which will be bad, not only because of the mess, but also because they will hard code the relation between that next code and the kind of value you have to pass to it.

Using `IValueChecker` instances you can establish this relation in a data - a table that matches certain interface and a pre-composed verification of the data you have to pass to some of its properties or methods for example. Well, the possibilities are obvious and quite wide - having a common way to pre-compose verifications enables a variety of techniques which are otherwise impossible.

Special notice deserve those of them that use a `checker` from some property or similar storage that can be configured/changed dynamically/selected by algorithm etc. This means that certain more generic classes can spark instances configured to perform different verifications, but the code base for that will not need grow beyond a single class. Additionally frequently used versions can be turned into new special classes with token code - just declaration and pre-set (in the constructor for example) the checker or checkers for that specific class (much easier than implementing a slightly different logic in their methods.)

This is OOP technique and as such promotes code that in turn tends to conform better to all kinds of OOP principles if used when something of the kind of the described scenarios demands it. Sure, this will not remove the need of the ad hoc code - in many, if not most, cases it is still the right way, but in the logic implemented in a class there are very often certain verifications/validations that are repetitive or can produce generic and thus vastly reusable results if they are performed through an utility object that can be replaced/reconfigured.

## The checkers - implementations of IValueChecker

At the moment of writing this article there are two major implementations supplied by the BindKraftJS. Others can be implemented in specific projects with narrower or not so narrow applications areas. The BindKraft ones are described below. As for project-specific ones we recommend considering such implementations in any project where routine verifications/validations of values again some conditions seem likely - this will centralize them and help all the developers avoid repetitive implementations of this actions which is likely to happen when they are not identified and remain considered as a matter of inline code writing. This always pays back - makes the applications accept changes in new versions more easily, minimize the code size somewhat and improve the testing by directly pointing at what needs to be tested (in this case the implementation of the condition(s) verification - the value checkers ).

Without this helper checkers are used by obtaining an instance and using it like this:
```Javascript
... function(v) {
    ....
    // For illustrative purposes we crate the checker here, but usually it comes from somewhere else.
    var checker = new TypeChecker("object","boolean", "number");
    if (checker.checkValue(v)) {
        // Ok - go do the work
    }
}
```

In the real world this will most likely require you to read the checker from somewhere, check if it is not null, preferably even check if it is a checker (BaseObject.is(checker, "IValueChecker")). With the IUsingValueCheckersImpl this is not necessary.

### TypeChecker

Whenever one has to restrict the types of the values accepted, but this involves more than just checking for a single interface or class for a very specific purpose it is helpful to have a common way to define/compose such checks. This is what TypeChecker offers.

Construction:
```Javascript
var x = new TypeChecker(cond1, cond2, cond3 ....);
```
Zero or any number of conditions can be given. One of all the conditions must match in order a value to pass the type check. Each condition can contain a list of conditions that all need to be met. Here are the syntax options for each of them:
```
    variant 1: argument type string
              "type_1,type_2, .... , type_n"
                The value must support/derive from all the types in the list of type names (interface or class names)
             "!type_1,type_2, .... , type_n"
                The value must NOT support/derive from any of the types in the list of type names (interface or class names)
    variant 2: argument type - a class definition name
            MyClass
                The value must support/derive from that type.            
```

Combining usage of separate arguments and lists of types in singular argument very complex conditions can be defined. The types supported are:
-   Any type derived from BaseObject
-   Any interface
-   These basic Javascript types: "null", "string", "number", "object", "boolean", "function"*, "symbol"**

* - "function" will work, but it is recommended to avoid such usage, because classes are also functions (seen from non-framework point of view by the native Javascript.).

** - the usage of symbols has specific purpose and is unlikely to fit within scenarios handled by the TypeChecker. One possibility exists - checking a value with new TypeChecker("string,symbol"). This will guarantee that the value can be used as field ident/name in a Javascript object. Still, it is unlikely to need such a thing because of the volatile nature of the symbols - one would probably need readable strings or well-hidden symbols, using both in a sensible way may happen someday to somebody, but is pretty unlikely. _Do not forget this is not old and ancient Javascript feature and will not be supported by older Javascript engines!_

#### Further methods of TypeChecker

```Javascript
    TypeChecker.prototype.addCondition(cond);
```
    Adds a single condition with the same syntax as in the constructor, but can be done at any time later (when the instance is already created and possibly even used)
```Javascript
    TypeChecker.prototype.clearConditions();
```
    Clears all the conditions. New ones can be configured by calling addCondition one or more times.

Methods for detailed management of conditions are not provided, limiting the runtime editing of the conditions to adding or resetting and filling from scratch. Currently such an options is perceived as an overkill for such a simple purpose, if proven wrong we will add the necessary methods.

### PatternChecker

This checker is mostly for strings or values convertible to strings in a consistent way. Its main purpose is to apply a specified regular expression, but unlike usage of raw regular expressions it can be of course provided in configurable manner, come from a parameter and so on. It also enables saving a line or two supported for combined tests like "null or a string matching this pattern" or even more complex "null, a string matching this pattern or something else that converted toString will match it".

Construction:
```Javascript
    var checker = new PatternChecker(pattern[, notnull[, convandcheck]])
```

For each parameter that can be passed to the constructor there is a corresponding property that can be changed during the life time of the instance. 

    get/set_pattern - gets or sets the pattern as string. The pattern is regex pattern
    get/set_notnull - boolean - allow/disallow null values
    get/set_convertandcheck - boolean corresponds to convandcheck

the pattern should be typically composed as regex pattern for testing a whole value from start to end. The `convertandcheck` when true enables checking non-string values by converting them to string first. The toString method is called for that purpose and the result is passed through the pattern. This can be used with series of objects/classes if they are designed with consistent conversion to string in mind. It is also usable with numbers, but is completely inappropriate for work with Date objects (_don't do that, you can get the wrong impression it works and note how unreliable this is much later_).

## Where to look for source code that uses these?

Checking source code which is part of a bigger class hierarchy will give more ideas on how to benefit from using this technique than a small isolated from the real life context example. So, we can recommend looking at the implementations of:

- EventDispatchLeasing - TypeChecker is used for typical argument validation because there are plans for the future versions of this class where the usage of its services will be restricted by configuration to narrower set of classes - different set in different setups. These changes will require just exposing the property publicly and no modification of the existing methods.

- DictoList - restricts types of the items that can be added/appended etc. DictoList serves as base class for some other classes that mostly act as item collection that may be specialized for certain kinds of items. Restriction of what can go into the collection is this implemented in them by just passing a TypeChecker to the base class.

- BKUrlScheme or other BKUrl* classes - Pattern checker is used to validate the pieces of URL that can be set through certain properties.