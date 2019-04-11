# In-memory "file systems"

First of all let us emphasize that the name is not literally true. While this feature is called "file system" it isn't anything like a real one. However the abstraction and the associations that come with the name are convenient and help developers to construct location-bound associations. The quotes around the terms like `file` or `directory` will be omitted further in this document and the associated ones, but the reader should not forget that they are used only as an abstraction helper and do not actually reflect the reality

## File systems

The file systems are nothing more but directories available from the global `Registers` collection. The directories are implemented by the `MemoryFSDirectory` class which, among others, implements the [IRegister](Register.md) interface. Thus each file system has its root directory registered in the global [Registers](Registers.md) hub.

BindKraftJS registers the following memory file systems (described in detail later in this article):

* `shellfs` - contains a number of standard and potentially a number of custom directories filled with shortcuts and similar objects that are consumed by UI shells or similar code. Global menus, trays and others are configured this way for example.
* `infofs` - directories intended to hold information that describes various loaded/running components. Also this file system contains volatile pieces of information - like notifications and messages (serves as a buffer for objects that are sometimes managed jointly by different apps concurrently)
* `appfs`  - directories containing system and app specific data, configurations, persisted settings and so on.
* `bootfs` - This one is dedicated to the system startup and contains [CL Scripts](CLscripts.md) for the [boot process](BootProcess.md).