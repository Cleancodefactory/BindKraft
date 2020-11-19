# System global commands

These commands are all the currently available built-in CL commands, implemented by BindKraft. The CL (Command line) processor will be replaced by a new one in near future, but the existing commands will be ported to the new version with changes as minimal as possible.

These commands are used in CL scripts that execute in the global context. For instance the usual execution is donne by calling `Commander.RunGlobal(thescript)` with a string containing the script. These scripts are most often used in the `init.js` files to boot up the system. CoreKraft (and potentially any kind of BindKraft modules) can contain a few such scripts which are not executed automatically, but their execution can be invoked (using the `gcall` command for example) from tha master boot script. This way the module developers provide the workspace integrators with an easy way to initialize their apps/libraries in variety of fashions by simply calling the appropriate script.

Another usage of short scripts is "app sequences" - apps starting other apps and passing the control to them, but this involves also commands specific for those apps.

## The list of the system commands

### System initialization commands

`initframework` - initializes the BindKraft framework, should be the last command of the initial sequence (see below)

`initculture` - initializes the culture dependent libraries. The culture must be already set or can be forced by passing non-empty parameter (eg. "en", "fr", "ru").

`createworkspace` - Creates the workspace window. Pass the word default to use the default template or a string containing modulename/templatename template reference to use that template.

`startshell` - Starts the SysShell instance for the workspace

`syslang` - Sets the system language (see [system settings](SystemClasses/SystemSettings.md)) by inspecting the specified query string parameter and if it is not available the `window.g_ApplicationCulture` variable (from the server). If neither is available 'en' will be used.

**Typical usage**

```
    startshell 
    createworkspace default
    syslang culture
    initculture ''
    initframework
```

This are the typical first commands in the master boot CL script in the order they should appear. While `syslang` is technically optional, without it the system will be hard configured to 'en' locale or another one explicitly specified. This can be useful for workspaces intended for specific culture only.

### App execution and entering app contexts

