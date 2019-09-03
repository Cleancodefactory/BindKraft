# ref

Example:

```
{bind source=something path=something ref[name1]=a/b:bindingname ref[name2]=a/b@prop ref[name3]=a/b~dcprop.dcprop2}
```

The `ref` binding parameter exposes a reference to something else in the view or a value extracted from a specified location. Multiple `ref` parameters can be specified in a single binding as long as their names (specified in square brackets) are different.

They can be accessed by any code that has access to the binding:

_Most common_

- in the handler specified in a `data-on` binding. The 3 argument of the handler is the binding and it can call `binding.getRef("refname")` to obtain the reference.
- in custom formatters - again the binding is the 3 argument in their ToTarget/FromTarget (_adHoc formattters_) routines (_Read/Write methods in custom formatters implemented as classes derived from CustomFormatterBase_).

_Less common_

- Binding obtained directly - found through `Base.findBindingByName` for instance.

The ref parameter in a binding is mostly useful in data-on kind of bindings, but can be also employed in data-bind bindings by a custom formatter used by the binding. This is also accessible for system formatters, but it is unlikely to find an useful case for a system formatter to use a binding reference.

The main purpose of the `ref` parameters in a binding is to provide additional references/values from "places" in the view to the handler (data-on) or formatter/converter (data-bind) needed for their operation. Teh view (template) designer can provide the same references/values even if the view changes by changing the `ref` paths to point to the same object or value.

TODO: continue

