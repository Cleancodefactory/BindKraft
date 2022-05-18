# BKInit.urlCommands

Contents
- Methods
- IUpdateCommandUrl service
- urlcommands command ( alias: runurlcommands2)
- Security considerations

Basic syntax, example:

```Javascript

BKinit.urlCommands(function(ucmds){
    ucmds.setRunName("run");
    ucmds.addRunScript("alpha", ["id", "x"], '... script source ...');
    ucmds.clearAllScripts();
});

```

## Methods

### setRunName(name)

Defines the name of the query parameter that lists the scripts to run on startup.

The parameter must contain a list of registered (with addRunScript) scripts delimited with a comma without any spaces. For URL generation see `IUpdateCommandUrl` service.

the default name is "run". Workspace constructs should not depend on the defaults - any module they use can potentially change it - it is recommended to override the name in the top module even when its modules are supposed to register url commands on their own.

### clearAllScripts()

Removes all script registrations. Useful when overriding any configured scripts in a module.

### addRunScript(name, constants, script)

Registers a script for the feature. Only registered scripts can be executed when listed in the run query string parameter (see setRunName).

**name** - The name of the registration and the script

**constants** - Array of parameter names - constants stripped from URL query string parameters.

**script** - String, the script source code.


## IUpdateCommandUrl service

Obtained from LocalAPI e.g.

```Javascript

var api = new LocalAPIClient();
var ucmd = api.getAPI("IUpdateCommandUrl");
if (ucmd.isRegistered("mycmd")) {
    var url = BKUrl.startURL();
    url = ucmd.updateUrl(url, "mycommand", {id: 5, x:"some value"});
    if (ucmd.isRegistered("mysecondcmd")) {
        url = ucmd.updateUrl(url, "mysecondcmd", {a: 1, b: "value b", c: 123.34 });
    }
    // Do something with the url
}

```

The above code will generate something along the lines (assuming corresponding configuration exists):

```
http://server/?run=mycmd,mysecondcmd&mycmd.id=5&mycmd.x=some%20value&mysecondcmd.a=1&mysecondcmd.b=value%20b&mysecondcmd.c=123.34
```

URL containing commands are generated for various reasons, but they usually share the aim to allow somebody to cause certain effects when the workspace is opened with the URL clicked/placed in address bar etc.

Such URL are often sent through e-mail or other messages to give an user URL that will cause the workspace to do something while starting up. For example this can be a new user of an application, provide user with initial state/scenario in some app etc.

**What is the difference between app treestate (routing) and url commands?**

- The tree state when reflected in the URL causes an app to navigate internally to a given state (if available). That state is persistent - unless removed by some means one can go to this state again and again. 
- URL commands execute script code. Of course the script can do something similar to routing if it is written that way, but it is an action and as such it can perform actions on behalf of the user entering the system with that URL and most often they would be one-time operations or other tasks that can be compared with actions performed by the user with the UI.

**Example scenario in a couple of sentences**

Let us imagine some app (no matter what exactly it does) that defines some resource shared by several users. Users are invited to join and this is done using URL commands.

1. The app offers UI where invitation is created and sent
    - Some data is saved (typically in database) to identify the invitation as entity
    - The invitation id is used as constant to create an URL running a command with that id constant on startup (using `IUpdateCommandUrl` API). The resulting URL is sent to the the invitee by email or other means.
    - That command has to be implemented to start the app and ask it to check and execute the invitation - load it by the id constant, check if the logged user has the same email for example and if everything is Ok register the user with the resource.
2. The invitee opens the URL and the command is executed with the encoded constants in the URL.

Of course, we skip the authorization here, but such invites usually happen in two possible ways - for already authenticated users and for users who need to authenticate or even create account before entering the workspace. This means that the authorization process have to preserve the query parameters during the authorization or registration and include them in the final redirection URL. The CoreKraft authorization does that and in general this is usually just a matter of preserving a fully composed redirect URL during the process.

## urlcommands command ( alias: runurlcommands2)

The `urlcommands` is a built-in BindKraft command that must be included in the boot script to invoke the execution of the url commands encoded in the URL with which the workspace is opened. Choosing when to invoke the command will depend on specifics of the project. For example a project may need an app or apps to run as daemons all the time and the task that needs to be performed by some of the commands is expected to need their services. In such a case - `urlcommands` should be invoked after starting the daemons. This kind of argument clears the decision - the workspace has to be functional enough before running the command. The initial URL is preserved and can be used at any time, so the only consideration is to make sure the commands and whatever they invoke indirectly will have the services needed at hand.

## Security considerations

Normally it should not be necessary to even talk about security in this context, but feature like this can potentially tempt an inexperienced developer to implement url command that performs unsafe operations. Still, whatever the problem in actuality it cannot be caused by the urlcommands feature itself - if there is a security problem it would be caused by availability on the client side of a code that can do harm - if it exists it is a matter of finding a way to exploit it, hence urlcommands just execute other code and security concerns are about the code not its specific execution in this case. 

So, urlcommands do not pose additional security concerns by themselves, but they can surface an existing problem.