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

//////////////// TODO Complet the text ///////////////

## urlcommands command ( alias: runurlcommands2)

## Security considerations