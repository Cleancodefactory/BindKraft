# System and Application commands or called jointly Executor Commands (EC)

EC is a feature that enables a BindKraft environment and apps in it to define commands that can be read from a string and executed sequentially. The string is a `command line` and contains commands and arguments for them one ofter another. The `command line` may come from variety of places - part or parts of the URL, user input, configured in configuration files, command lines saved in a db and many others. The defining concerns are basically these:
- The `command line` must as compact as possible, but still readable
- The `command line` should be able to encode in a part of an URL and thus must support syntax making this easy
- The URL must be formed in a way friendly for scenarios where it is included in documents so that the user can click it (so spaces are not acceptable)
- it should be easy for the apps to define commands for their primary tasks and generate a command line while following the actions of the user.

So, this is not really an unix-like shell or something like that. There are some features that bring some resemblance, but no resemblance should be a goal if it will break the above requirements (in current or future versions). The main goals we aim to achieve are:

- Enable short scripts (command lines) to launch/focus an app and lead the user to predefined places and if needed perform simple tasks (like inviting an user to some app on a site.)
- In more general cases - auto start apps in specific BK environments and configure/force them to do a few initial actions (i.e. open a document, go to specific state etc.)
- Enable techniques for SEO that can be implemented with or without server side content generation by exposing URL for content supported by certain apps. The URL can be associated on the server with (potentially cached) indexable data and the commands can both execute on the client and lead the app in the browser to well defined state or return associated cached content to spider robots.

## Notes about the implementation

In this document the infrastructure of the command execution is described. The reader will notice at some point that this infrastructure can be used in various ways. This is intentional and provides set of components that can be used for implementation of different script-like solutions for different purposes. As an additional goal we want not only to provide command based interface to a BindKraft setup, but enable tools and features to create their own scripting solutions with the same component set. A good example can unit and integration test tools.

## General description

### The classes involved and their main characteristics

- `CommandDescriptor` - describes a command, contains: name, alias, delegate/callback and short help text.
- `CommandReg` - command register. Command descriptors are registered (or created and registered in one step) in them and easily found by name and alias.
- `IEnvironmentContext` (only current implementation is `EnvironmentContext`)- defines set of variables as a kind of scope
- `IAppBase` - used in the command contexts (see below)
- `CommandContext` - a context available to the command's implementation code during its execution. Consists of: `CommandReg`, `IEnvironmentContext` and `IAppBase`. More elements can be added here in future versions. The commands usually do their work by calling globally available API-s and/or calling services/methods of a specific app/daemon instance. They also use/create variables in the environment.
- `CommandLine` - parses and holds a command line - chain of commands and parameters. The object maintains navigation in the chain (as if it is a memory). Does not execute anything, but the execution process reads the command line in order to do its work.
- CommandExecutor


## Execution sequence in detail

```cmd
cmd1    rawarg1     rawarg2 cmd2    rawarg3 rawarg4 trap1  cmd3
0       1           2       3       4       5       5+    6
```

cmd1 - starts
    fetches rawarg1;
    fetches rawarg2;
    calls iface resultOp = API.resultofnextcommand() to wait next command (cmd2 in this case);
    API.resultofnextcommand - places a trap at cmd2. With fullfill - pull topresult, complete with it requestOp and returns requestOp.
    in cmd1 code we have: requestOp.then(... the code after the trap)
    


Simplified example code:

cmd1: function(commandcontext, API) {
    var doneOp = new Operation(null, 30000);
    var arg1 = API.nextToken(); // raw simple
    var arg2 = API.nextToken(); // raw simple
    var requestOp = API.resultofnextcommand(doneOp);
    requestOp.whencomplete().tell(
        function(op) {
            if (op.isOperationSuccessful()) {
                var arg3 = op.getOperationResult();
                // Use the 3 arguments
                -->case1
                and finally doneOp.CompleteOperation();
                -->case2
                var requestOp2 = API.resultofnextcommand(doneOp);
                // the same story again
                requestOp2.whencomplete().tell(
                    function(op) {
                        .....

                    }
                );
            } else {
                // error handling
            }
        }
    );
    return ContinueOperation.Completed(true,doneOp);
}

While processing the position of cmd2 - pos = 3
