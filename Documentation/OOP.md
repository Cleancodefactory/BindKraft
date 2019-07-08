# OOP in BindKraftJS

BindKraft Javascript (BindKRaftJS) is OOP platform. Basically it defines a huge number of classes, interfaces and other constructs in the context of the WEB page's Javascript and makes them available for use. All apps, daemons, API, views, controls  and other elements are instances created from these classes and organized into workspace - UI working environment.

Why BindKraft is made this way? Read about it in this article - [OOP - the inconvenient questions](OOP-Questions.md)

Runtime type information and type checking is avalable:

- in [BaseObject](CoreClasses/BaseObject.md);
- in [Class](CoreClasses/Class.md) static set of methods.


## OOP basics

BindKraft is basing its OOP on the `prototype` Javascript feature and not on ECMA 6 classes. This may look old-fashioned to some, but it gives more control over the class definitions and option to go beyond simple single inheritance.

The inheritance technique is "shallow" - the chain of prototypes is short - when a class inherits another the prototype of the inherited class is copied to the new one. For those with experience in these matters, we don't have the option to have separate data (this) and virtual tables natively. Tricks are possible, but they will cost performance, thus we use the prototype and the resulting this as both - data holder and virtual table at the same time.

There are other techniques (and ECMA6 uses them), but they lengthen the prototype chains, which impacts the performance when the inheritance goes too far. There is no such effect in BindKraft and the inheritance can be as deep as you like it to be. There are some downsides to this approach, but they are insignificant compared to the positive effects.

Prototype inheritance opens the way for techniques that enable constructs like the `implementors`. Based on certain interface they can write (actually attach) members to the class behind the scenes, implement interfaces differently depending on where in the inheritance hierarchy your class is and even create statically bound functionality in a class. This is not a compilation process, but if you compare this initial phase of the BindKraft initialization to a compiler processing, the effect is that your code can control its compilation.

### Inheritance

...

