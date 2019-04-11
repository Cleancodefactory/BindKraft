# Parameterization of BindKraft class instances

This is a complex topic, addressing a number of techniques in different areas. To avoid mudding the information this article follows the popularity and importance of the parameterization process and not some more formal logic.

## Parameterization of Base derived classes

Historically this is the first functionality that includes parameterization mechanisms. It was introduced to answer the need to modify the behavior of components instantiated through markup in templates. The parameters has to be specified in the markup and associated with their respective components.

Having both data bindings and parameters merits the need to define what a parameter is and how is it different from a property/field attached to one end of a data binding:

```
    The normal data bindings transfer data during the normal life-cycle of a component. The parameters on the other hand are specified during instantiation and either a) never change for the given instance or b) are specified not as value, but as a source from which they obtained each time they are used in the logic of the component - in this case the source should remain the same for the life of the instance and not the value.
```

The purpose of the parameters is to configure an instance of some class to behave in certain way. This is especially important for multipurpose classes with flexible and somewhat abstract function that needs parameters to adjust it for each individual case. Good examples in simple scenarios can be:
- Specifying a property/field that contains important value in the data reaching the component- e.g. which field should be used as title, which specifies an unique id etc.
- Specify a mode of operation where more than one are available.
- Specify a specific algorithm to be used in operation that can use one of a set of algorithms for the same purpose, but with different end results.
- Turn on/off certain parts of the component's functionality 