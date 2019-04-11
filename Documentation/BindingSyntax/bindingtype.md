# Binding type - `bind`, `read` or `probe`

Specififies the behavior of the binding when updateTargets/updateSources are called for mass binding activation. Does not matter for the `data-on-` bindings - in them `bind` should always be used by convention.

The meaning of the different type names:

>`bind` – bidirectional,

>`read` – read only (only from the source to the target)

>`probe` – passive binding which does not update the target or the source automatically when mass activation methods are used

## What/which are the mass _activation methods_

In order to explain these methods we have to know how the bindings are created and controlled.

As mentioned before the bindings are objects of either the `Binding` class (data-bind) or the `Handler` class (data-on). The binding syntax can be seen as serialized binding instance into the markup (the HTML templates).

Thus the binding objects are created/instantiated when the system is processing the template (the term often used for this is: **materialization**). 



The `probe` bindings can be used in

- _path expressions_ (see later in the document) to read parts of the path
- programmatically to obtain the target or source value. The binding can be found by name (_see name parameter_) for instance.
- in combination with **readdata** and/or **writedata** which activate the binding individually in response to an event. 

It should be noted
These does not matter when the bindings are accessed individually - either programmatically or through expressions from the binding syntax like: readdata and writedata (see below).

The specific kind matters only for `data-bind` bindings, for `data-on` the word `bind` is recommended, but any can be used instead.
