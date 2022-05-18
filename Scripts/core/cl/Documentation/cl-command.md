# Writing CL commands

The CL command can be implemented with or without some details and in its essence is a function with two arguments:

```Javascript

function(args, api) {}

```

**args** - Array of the arguments in the order from the script invoking the command

**api** - an object that provides several standard methods the command can call to inquire about its context.

The command function can return anything, but if it performs an async actions it must return `Operation` and complete it when they are done. Also, if the command wants to report errors to the runner it has to return Operation even if there are no async actions - failed operation denotes an error. The executing engine of the script containing the command may have or not have support for dealing with errors (e.g. stop the execution, report and continue etc.), the command cannot and should not depend on assumptions about these error handling techniques.