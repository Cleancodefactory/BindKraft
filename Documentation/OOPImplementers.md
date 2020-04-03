# Interface implementers (sometimes written implementors)

`Interface implementers` are based on an already existing interface and provide implementation for it that can be pulled by a class definition using `Implement` or `ImplementEx`.

Implementers go much further than just enabling the programmer to define method implementations. There are two methods of an implementer that can be written to create the implementation according to parameters, specifics of the implementing class and so on. The details will be explained below, but in short they are:

```Javascript
SomeImplementer.classInitialize(classDefinition, arg1, arg2, ...)
```

`classInitialize` is executed only once per usage of `Implement` or `ImplementEx` by any implementing class. The method can serve as a closure for the actual methods implementation and because it is only one instance per class implementing the interface implementer, the memory footprint is vanishingly small and under control. The function can analyse the `classDefinition` and implement some or all the members of the implemented interface differently. A good example will be an interface that needs different implementation depending on the base class (in different parts of the inheritance tree).


```Javascript
SomeImplementer.inheritorInitialize(classDefinition, parentClassDefinition)
```

`inheritorInitialize` is not needed as often as classInitialize, it is called whenever a class implementing the `interface implementer` is inherited by another and then over the child class if it is inherited in turn and so on and so forth. In this method one can implement whatever custom adjustments are necessary to the class definition of the new classes in order to keep the functionality implemented down the inheritance chain. There are better uses of this functionality, but one that can be easily understood is if there is a need to keep a collection of parameters that can be extended by any new inheriting class definition without polluting the `prototype`.

TODO: continue