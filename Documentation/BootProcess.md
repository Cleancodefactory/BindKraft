# Boot process

This document describes the current boot process of a BindKraft project/web site.

To get to this point we have to construct the project, put all the BindKraft (BK) modules we need, fiddle with their dependencies if necessary and pay special attention to the `start up` module (This is described in detail in the previous document). 

Although this may repeat some topics covered in the [BindKraft Project Construction](BKProject.md) they play integral part of the boot process and we have to point them out briefly:

## Before we start with the process

### The startup BK module
 
The `start up` BK module pulls the rest through its dependencies on them. Depending on the backend used this may be done ahead of time using CLI script or on server start (CoreKraft for example) or in some way that combines both. As mentioned before only the Javascript files have to be loaded in exact order of the BK module dependency chain and according to the #using directives in the *.dep files on BK module level. This is usually done for you by the tool/server software and one needs to deal directly with this problem only if they are building new tools for building/running BindKraft projects.

### init.js files

Thanks to the deterministic loading order of the Javascript files BindKraft uses a simple, but effective trick to build the in-memory configuration/state of the project. While the files load pieces of script can be executed while loading in order to record various configuration data in well-known places in memory.

Because of the order defined by the BK module dependencies and the pre-defined and (known) locations where these settings go, they can be replaced by scripts that load later. This is very useful when modules define default settings - if they need a change it can be applied in a BK module that depends on them and ultimately in the `start up` module.

The possible settings are many and serve a long list of functionalities, API and commonly used utilities. Some are indeed defaults for which it is best to pack them in the BK module that also carries the implementations that use them. Others are more project related and the best approach to them is to configure for each project and not as defaults. The dependency determined loading order and API for setting them during load and boot serves both purposes well.

As a **convention** each module should include an **`init.js`** file, preferably as last file included in the BK module. In this file all the defaults and other setting should be applied to the system. This way one can trace and maintain the way the project is configured by inspecting the `init.js` files of all the project's BK modules, considering the order in which they are loaded - defined by _Dependency.json_ files.

In the `init.js` files almost all of the settings are set by using the [BkInit](BkInit.md) API - exclusively built for that purpose and the defaults management methods of [Class](CoreClasses/Class.md) utility set (mostly Class.defaultsOf - a BkInit API will be added for this in order to streamline the process further).

Looking back at the startup module - this makes it the knot that holds the whole system together and the final authority for configuration and initialization. Its `init.js` file sometimes is the only real content in the module. It is the last file to load before the project starts to run and this makes it the perfect place to specify the settings that will actually apply to the project.

## The boot process

## Loading (loading phase)

As said above and in the project construction guide the Javascript files load in order defined by the BK module dependencies and then the #using directives inside the modules (in the *.dep files).

During that phase all the classes, interfaces, enums and other structures get defined.

All the `init.js` files are processed during loading. They all (must) use features available at this phase - BkInit API is designed for this and anything done through it is compatible with the loading phase. The init.js files sometimes need to use definitions from their module - that is why it is strongly recommended to include them as the last Javascript file in the BK module. We will refer to the particular BkInit API below while we describe a feature that depends on settings managed through it.

### Spotting coding errors

The loading phase can be called also "compilation" phase from the programmer's point of view. The OOP declarations are processed at this time and any errors are logged through the so called **CompileTime** object. It is not a normal part of the system and it is fully functional only in this phase. Its purpose is to collect the messages issued during loading and provide them to any subscribed viewers/further loggers. While developing it is important to look at the console window for warnings and errors being reported. More about this can be found in a separate document.

When loading finishes BindKraft launches the registered code analysis procedures and they might log more error and warning messages concerning the code if they find problems. These procedures should be disabled on production environments, because they are expected to grow and even now they add noticeable delay on start up.

## Booting 

Now that the code is loaded and processed comes the moment to really boot the system. This involves initializing the required structures, launching the autostart apps, executing variety of scripts that will bring the workspace to the desired initial state.

### Execute the bootfs:/boot

TO DO:

## Procedure

- Run bootfs:/boot

    Initializes the system ...

- Run all the `URL scripts` 


## Elements

### URL commands

Current implementation expects them as query parameters

```
http://server.com/path1/path2?param=content&$run_appcls=<command_line>
```