# ICustomParameterizationStdImpl

Implements parameterization filtering for view components derived from view.

## Usage

```Javascript
function MyComponent() {
    Base.apply(this, arguments);
}
MyComponent.Inherit(Base,"MyComponent");
MyComponent.Implement(ICustomParameterizationStdImpl,"param1", "param2");
// ... declaration continues ...

```

The component may also derive from Base indirectly. If the parent class implements `ICustomParameterizationStdImpl` with some parameters, they will be inherited.

The effect of the implementation is that when used in markup the component will use only the declared parameters and any other parameters will not take effect.

This will work as expected:

```html
    <div data-class="MyComponent param1='some value' #param2='5'" ...></div>
```

And the values of _param1_ and _param2_ will be set to `set_param1` and `set_param2` respectively. If any (or both) of set_param1/set_param2 do not exist a field or fields `param1`/`param2` will be set instead (see [Parameterization](../Parameterization.md)).

But this will not work that way:

```html
<div data-class="MyComponent param1='some value' #param3='5'" ...></div>
```

Here `param3` will not be set, because it is not declared by implementing `ICustomParameterizationStdImpl` (see the first snippet above). This will set the `LASTERROR` which is not very useful by itself, but if LASTERROR logging is enabled the problem will appear in logs.

