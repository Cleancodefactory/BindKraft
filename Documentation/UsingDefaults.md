# Using Defaults for object settings

Many classes need flexible default values for their parameters and static default values in their source code are not enough for them. 

**As an illustrative example**: take the default templates for UI controls. In most cases these templates are not specified on every use, but a module may want to change them for the whole system instance (workspace) where it is included. Beyond that an app in that workspace may want certain controls in its UI to use by default templates specific for the app.

`Obviously a constant in the source code would not be a solution to this. This is where the Defaults come to help. They provide a convention, some helpers and support by **initializers** to enable the developer to specify set of default values that can be easily used in parameters initialization, but also can be changed from outside.`

## Defaults

The defaults are an object attached to the class definition:

```javascript
function MyClass() { ... }
MyClass.Inherit(....);
MyClass.$defaults = {
    param1: "somevalue",
    param2: 1234567
}
```

These can be set also using the `Defaults` oop helpers.

**When writing a class:**

```javascript
function MyClass() { ... }
MyClass.Inherit(....);
MyClass.Defaults({
    param1: "somevalue",
    param2: 1234567
});
```

**When changing them in a specific workspace (typically in an init.js file)**

```Javascript
// See further down in the document for more details about this.
Class.defaultsOf(MyClass).set({ param1: "someothervalue" });
```

The initial defaults are specified when the class is designed and then used with initializers like this:

```javascript
MyClass.prototype.myproperty = new Initialize("Some doc", new Defaults("param1", 0));
MyClass.ImplementProperty("myotherproperty", new InitializeNumericParameter("doc string", new Defaults("param2",888)));
```

The `Default` constructor takes two arguments:
- `name` of the value in the `$defaults` object
- `Ultimate default` value if the name from the first argument is not found in the `$defaults` - this is an ultimate fallback if all else is not possible, but can be omitted and often is.

### Resolving the Defaults value

As shown the __initializers__ support `Defaults` objects and will resolve the value from the class `$defaults`. If one needs to resolve the value programmatically without the help of initializers, this can be done this way:

Assume the code below is in a method of a class you are writing:

```javascript
function MyClass() {...}
MyClass.Inherit(SomeBase,"MyClass");
... more code ...
MyClass.prototype.MyMethod = function(defval) {
    // Let's presume that defval can potentially be a Defaults instance
    ....
    var val = Defaults.getValue(this, defval);
    // If defval is a Defaults instance it will be resolved (see after the example)
    ...
}
```

> The `Defaults.getValue` will check if the value passed as second argument is a `Defaults` instance and will resolve it (take the value from `$defaults` or return the ultimate hard default - whichever is available). If it is not, the value will be returned without changes. Here we are not defining where this value comes from - just assume it comes from somewhere and can be a `Defaults` instance.

## Where Defaults can be specified and where they can be used further

As mentioned above the initializer classes support them and they can be used as a default value of any initializer (except those that define methods).

```Javascript
new InitializeXXX("-- docstring --", new Defaults("-- defaultparamname --"));
```

The InitializeXXX can be: `Initialize`, `InitializeBooleanParameter`, `InitializeCloneObject`, `InitializeNumericParameter`, `InitializeParameter`, `InitializeStringParameter`. The initializer can be the one used in an `ImplementProperty` or similar oop helper.

What is common for these initializers is that they provide means to initialize a value of a field/property when a new instance of a class is created. The value can be even an object as is the case with InitializeObject. 

The argument of the Defaults is the name of the default value. For example:

```javascript
function MyClass() { ... }
MyClass.Inherit(....);
MyClass.Defaults({
    param1: "somevalue",
    param2: 1234567
});
```

can have a property:

```javascript
MyClass.ImplementProperty("myprop", new Initialize("this is myprop", new Defaults("param1")));
```

That is using the `param1` entry declared in its defaults. If it is missing it will just be null.

Another place where Defaults are very useful is in `implementer` arguments when using them in your class definition. In that case the Defaults are resolved by the implementer internally (sometimes using initializer, sometimes more directly - it is not important when using them).

One of the widely used cases is the `ITemplateSourceImpl` which enables controls/components and windows to easily use templates. An extract of a control definition:

```Javascript
// ...
YesNoControl.Implement(ITemplateSourceImpl, new Defaults("templateName"));
YesNoControl.Defaults({
	templateName: "bindkraft/control-yesno"
});
// ...
```

This makes the templateName a default value and it can be changed without changing the BindKraft code. For example this is usually done in modules that provide theming to enforce the template they supply for the control as a default one. As a result all the instances of the control in that workspace will use that template if they do not specify one explicitly. This will look this way for the above control:

`Class.defaultsOf(YesNoControl).set({ templateName: "xmodule/yes-no-control" });`

_To see how this fits in the construction a workspace by combining modules you will have to get familiar with BKInit and usage of init.js files._

## Managing the `$defaults`

It is possible to manage them directly:

```javascript
// Code somewhere outside the class
MyClass.$defaults.param1 = "New value";
```

However it is recommended to this through the defaults manager:

```javascript
var mng = new DefaultsMgr(MyClass);

// Change single value:
mng.set("param1", "new default value");
// Remove single default value
mng.unset("param1",);
// read single default value
var x = mng.get("param1");

// change multiple default values
mng.set({param1: "new value", param2: 10});
// Unset multiple defaults
mng.unset({param1: null, param2: null}); // the value of the properties are ignored
// Read multiple defaults as object with key value pairs
var x = mng.get({param1: null, param2: null}); // Returns the same object with the defult vlaues set to the corresponding parameters.
```

As it was shown above you do not need to create the `DefaultsMgr` so directly, `Class.defaultsOf` does exactly that:

`Class.defaultsOf(YesNoControl).set({ templateName: "xmodule/yes-no-control" });`

## When to change and when not to change the defaults

It is important to remember that changing a default for a class has global effect. It applies to every instance that will rely on it.

So setting specific defaults is part of the DevOps operations when creating constructs/workspaces. When BindKraft is used with CoreKraft this usually consists of using a number of CoreKraft modules each configured to depend on some others. This defines the order in which they are loaded and as it is done by convention each module typically contains in its `scripts` directory a file named `init.js`.

These files are executed during load and configure wide variety of settings, behaviors and so on. The dependency based loading ensures that these init.js files will be executed in the same order in which the modules are loaded, so they have the opportunity to override settings set previously in some module on which they depend.

Thus the CoreKraft/BindKraft workspaces are typically build with a `top module` which depends on everything else in the workspace. The init.js of that module will execute last and is the ideal place to finally override any setting potentially set by another module in the construct and make sure this way that the workspace will use exactly that setting. The defaults are obviously settings of that kind and very often the top modules deal with defaults.

Still, have in mind that this dependency and init.js initialization gives much more opportunities and they are widely used in workspace constructs. Basically if one is presented with a workspace for which he knows nothing from before it is a matter of determining the dependencies and then reviewing the init.js files in order to determine how and what is configured in it. To illustrate: above we mentioned theming modules - such modules carry CSS, but also carry HTML templates for controls and windows designed to use that CSS. So, it is convenient to include in the init.js of such a module management of the defaults concerning the templates used by those classes. In such a case changes of the `templateName` defaults will probably not be present in the top module, because the workspace will rely on those set by the theming module, still one or two exceptions could be set up there for some specific reason - it is easy to find out by following the dependency chain (defined in Dependency.json) and checking the contents of the init.js files in the modules.

## Conventions

These are mandatory, but are recommended!

1. The defaults have to be simple values (numbers, strings, booleans etc.)
2. The defaults are plain values and not a tree of objects.
3. The name of each default value should be based on the name of the parameter for which it is intended (e.g. templateName for the property parameter `get_templateName`/`set_templateName`) unless there is no such parameter - then the name MUST be descriptive and the documentation must describe its purpose and effect.

## Ambient defaults

If you read everything above you probably wonder if it is possible to have different defaults in different parts of a workspace.

This is obviously not an easy problem, the Defaults are default values for classes after all and it is hard to expect that creating a new instance of a class in different places of the code will use different defaults.

### Ambiance

The unlikely expectation above is still possible - not in every possible scenario, but in many it is quite possible and supported. It is even possible to extend its coverage in some custom scenarios. Currently BindKraft provides convenient ways to have specific defaults on App level, but the same technique can be applied in more granular fashion as well.

**So, what is ambience?**

In most cases the instances of the classes we create live in certain contexts defined by the hierarchy in which they play roles. For instance the classes of the components/controls used in a view or inside a control even live in the context defined by the hierarchy of the view. Having a context means we can keep in that context something we need to be able to extract when needed and this is ambiance in the sense we are interested in - information we can derive from the context.

This notion of ambiance has a number of usages, but in this document we consider only the Defaults.

### Contextual ambiance interfaces for defaults

The defaults are a rather specific case and unlike any other feature we may want to consider as ambient, the defaults are used only during initialization/creation of instances of classes and not throughout their entire lifetimes. To achieve that BindKraft defines only two interfaces:

`IAmbientDefaults` - provides default values

`IAmbientDefaultsConsumer` - implemented on the classes capable of using ambient defaults. The `Defaults` class checks for it and extracts ambient context values through it.

So, theoretically the `IAmbientDefaultsConsumer` is the actual mandatory interface, while `IAmbientDefaults` may or may not be used depending on the implementation of `IAmbientDefaultsConsumer`. To keep things in order we define both and the implementations (existing, future and custom ones) should get hold onto some `IAmbientDefaults` and query it.

### IAmbientDefaultsConsumerImpl

```Javascript
ComponentClass.Implement(IAmbientDefaultsConsumerImpl);
```

Following the above considerations BindKraft comes with this implementer (`IAmbientDefaultsConsumerImpl`) which will look for a service providing `IAmbientDefaults` and return values by querying it. Currently `AppBase`, hence all apps include implementation of `IAmbientDefaults` (as separate object) that can be obtained form their `locateService` method (part of the `IServiceLocator` interface which `AppBase` implements).

This means that any control/component or class that supports at least `IStructuralQueryEmiter` can `.Implement(IAmbientDefaultsConsumerImpl)` and benefit of ambient defaults when placed in an app that defines some. An existing library provided implementation for `IAmbientDefaults` does not exist for more granular ambient definitions, but if custom one is supplied (e.g. provided as service by a window which is root of a sub-hierarchy in an app) the components implementing `IAmbientDefaultsConsumerImpl` will automatically be able to use it if available.

A short clarification: The requirement for `IStructuralQueryEmiter` comes from the low level service location mechanism - it relies on two things: a) ability to follow the hierarchy (provided by `IStructuralQueryEmiter`) and querying the `IServiceLocator` of the elements of the hierarchy.

### The AppBase provided app-level ambient defaults

Internally this is implemented in the `AppAmbientDefaults` class, but one does not need to be concerned by that. The important thing here is that each app will try and load if they exist, ambient defaults from its app data. When available and loaded the values configured there will take effect on any component/class in the app internal hierarchy as long as it supports `IAmbientDefaultsConsumerImpl`. The global defaults will take effect if the value is not defined in the ambient defaults.

**How to use this in real life**

In init.js files you can define app data for an app by using:

```Javascript
BkInit.AppData("-- appclass --", function (data) { ... initialization code ... });
```

The appclass is either the class name as string or the class itself. In the initialization code of this kind of construct various pieces of app data can be set up depending on what the app may need, but for the ambient defaults there is a special method:

```Javascript

BkInit.AppData("-- appclass --", function (data) {
        // ... maybe other data files - other app data ...
        data.ambientDefaults({
            VirtualDropDownControl: {
                templateName: "mymodule/vd-template"
            },
            PagerControl: {
                templateName: "mymodule/pager-template",
                pageSize: 20
            }
        });
        // ... maybe other data files - other app data ...
    });

```

As you probably already guessed the object given to the `ambientDefaults` method consists of sub-objects each named after the class name of the class for which defaults are configured. Then inside the sub-object the values you want to override for the app context are listed. Any omitted value will cause the global default to be used for it.

## Conclusion

Using defaults one can configure the default characteristics of instances created from a given class. This is possible on global and in most cases on contextual level.

BindKraft defines means to do this globally and app level, but the mechanism will work on even more granular levels if custom implementations of IAmbientDefaults is exposed on more granular level.

Using defaults to configure components provided by BindKraft or other base libraries makes possible to remove the need of explicit configuration/parameterization each time an instance is created (directly or most often as a result of template materialization). This makes code cleaner of course, but also enables management of the component behaviors on sensible partitions (whole workspace, specific apps etc.)