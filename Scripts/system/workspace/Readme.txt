This part is under development and should not be used except for experiments.
In release versions it will be excluded from the dependency chains.

Purpose of system/workspace
===========================

This section defines a system workspace as base class(es) and interfaces. The system workspace is non-app construct that
will behave somewhat like an app, but is never unloaded (shuts down with the system). It will replace the rather minimalist
workspace management previously delegated to the WorkspaceWindow.

The reasons behind this is that SysShell began handling functions which are beyond its responsibilities and are innate for 
a window manager. Designing a "workspace manager" component that will take over tasks like placing windows, managing them and so on.
