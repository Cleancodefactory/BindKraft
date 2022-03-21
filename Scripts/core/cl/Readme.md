# The Command Line NullLang - CLNullLang

NullLang is compiled from text (string) source into `CLNullLangRunner` object, which can be cloned or simply used multiple times concurrently.

The actual execution of a compiled NullLang script (`CLNullLangRunner`) is done by calling its method `execute`.

```Javascript
// Get a compiler
var compiler  = new CLNullLang(); // Can come from somewhere
// obtain CLNullLangRunner
var runner = compiler.compile(source);
// running the script
var result = runner.execute(context); // What about the context?
```

The context is an `ICommandContext` object which in turn groups an environment and command register contexts. Future extensions may add more contexts to the command context.

Here:

`IEnvironmentContext` - represents the environment which is basically a dictionary like access to named variables.

`ICommandRegister` - represents a set of available commands (functions) that can be called from the `NullLang` program

Currently we are using the classes created for previous versions and other languages operating in the same conditions:


