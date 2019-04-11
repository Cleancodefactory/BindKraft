# Using Defaults for object settings

MAny classes need flexible default values for their parameters and static default values in their source code are not enough for them. 

`As an illustrative example take the default templates for UI controls. In most cases these templates are not specified on every use, but a module may want to change them for the whole system instance where it is included.`

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

The initial defaults are specified when the class is designed and then used with initializers like this:

```javascript
MyClass.prototype.myproperty = new Initialize("Some doc", new Defaults("param1", 0));
MyClass.ImplementProperty("myotherproperty", new InitializeNumericParameter("doc string", new Defaults("param2",888)));
```

The `Default` constructor takes two arguments:
- name of the value in the `$defaults` object
- Ultimate default value if the name from the first argument is not found in the `$defaults` - this is an ultimate fallback if all else is not possible.

### Resolving the Defaults value

As shown the __initializers__ support Defaults objects and will resolve the value from the  `$defaults` object. If one needs to resolve the value programmatically without the help of initializers, this can be done this way:

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

The `Defaults.getValue` will check if the value passes as second argument is a `Defaults` instance and will resolve it (take the value from `$defaults` or return the ultimate hard default - whichever is available). If it is not, the value will be returned without changes. Of course the value does not need to be an argument - it may come from anywhere and if it can be `Defaults` instance is up to developer to determine.

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

## When to change and when not to change the defaults

The default values of the classes in the framework and the classes of applications loaded into the system are global - apply for the whole BindKraft instance/installation. Thus every instance of these classes will be initialized with them no matter where and when it is created. The defaults are not application specific and should not be mistaken as such!

The defaults need change when certain library/module is included in the BindKraft instance/system and it wants to adjust the whole system to certain conditions e.g. - templates contributed by the module, general behavior considerations, project policies.

The change can be applied during the Javascript loading process without any complications, but only if the classes to which the changes are applied are known to be defined before the code that changes them. A global code can be used:

```javascript
var mng = new DefaultsMgr(PagerControl);
mng.set("templateName","mymodule/modded_pager_template");
```

The example code above changes the default template for the pager. An example reason for that can be a decision to use a specially designed pager template in all apps in this BindKraft system.

If the above is not possible because the class we want to modify is (or at least "can be") not yet defined we have to register our modification code with the system loader:

```javascript
$SysBoot.Default().action(
    "runtime", 
    "MyModule",
    function (ctx) {
        var mng = new DefaultsMgr(PagerControl);
        mng.set("templateName","mymodule/modded_pager_template");
    }
);
```

The first argument above is the boot **phase** in which to execute the action. The recommended phase is `"runtime"` - one dedicated to creation and configuration of the runtime environment. Other phases in which this can be done are `"resources"` and `"environment"`, but `"runtime"` is preferred. All those phases are before any UI or daemons are started, but in `"enviroment"` it is possible that some basic system constructions are already created and it will be too late to change their settings. So, `"runtime"` happens earlier from the mentioned phases, then `"resources"` and just then `"environment"`. The resources phase is dedicated to prepare and cache preloaded resources and if the defaults one wants to set are based on these resources is probably the only valid reason to register code that changes defaults for a phase as late as `"environment"`.

## Conventions

1. The defaults have to be simple values (numbers, strings, booleans etc.)
2. The defaults are plain values and not a tree of objects.
3. The name of each default value should be based on the name of the parameter for which it is intended (e.g. templateName for the property parameter `get_templateName`/`set_templateName`) unless there is no such parameter - then the name MUST be descriptive and the documentation must describe its purpose and effect.
