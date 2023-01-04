<!-- vscode-markdown-toc -->
* 1. [BKInit - shortcuts](#bkinit---shortcuts)
    * 1.1. [BKInit.StartMenu](#bkinit.startmenu)
    * 1.2. [BKinit.SystemMenu](#bkinit.systemmenu)
    * 1.3. [BKInit.DevMenu](#bkinit.devmenu)
    * 1.4. [BKInit.PrivateMenu](#bkinit.privatemenu)
    * 1.5. [BKinit.AppMenu](#bkinit.appmenu)
    * 1.6. [BKInit.KeylaunchMenu](#bkinit.keylaunchmenu)
    * 1.7. [BKInit.RecentMenu](#bkinit.recentmenu)
* 2. [CL scripts (non-shortcut)](#cl-scripts-(non-shortcut))
    * 2.1. [BKInit.MasterBoot - the most important setting](#bkinit.masterboot---the-most-important-setting)
    * 2.2. [BKInit.ModuleScript](#bkinit.modulescript)
    * 2.3. [BKInit.commands](#bkinit.commands)
    * 2.4. [BKInit.urlCommands](#bkinit.urlcommands)
    * 2.5. [(deprecated) BKInit.commandUrlAliases](#(deprecated)-bkinit.commandurlaliases)
    * 2.6. [(deprecated) BKInit.commandUrlAlias](#(deprecated)-bkinit.commandurlalias)
    * 2.7. [(deprecated) BKInit.commandUrlGlobal](#(deprecated)-bkinit.commandurlglobal)
    * 2.8. [BKInit.AppData](#bkinit.appdata)
    * 2.9. [BKInit.AppInfo](#bkinit.appinfo)
    * 2.10. [BKInit.WorkspaceName](#bkinit.workspacename)
    * 2.11. [BKInit.WorkspaceName](#bkinit.workspacename-1)
    * 2.12. [BKInit.Translation](#bkinit.translation)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc --># BkInit - initialization helpers

These helpers are intended to be used in the `init.js` files of modules.

To understand this you have to know the usage of the [BK modules](BkModules.md) and know something about the in-memory "file systems" used by BindKraftJS to hold settings and state data.

The example snippets are written as global code to avoid the need to know additional conventions. See the recommendations in the Recommendations section at the end of the article for some ideas how to establish a better practice in your projects (optional).

Project construction and configuration guide (_TODO: put a link here when the article is more or less ready_)

Last update for version: 2.17.5

##  1. <a name='bkinit---shortcuts'></a>BKInit - shortcuts

###  1.1. <a name='bkinit.startmenu'></a>BKInit.StartMenu

Manages shortcuts in `shellfs:startmenu`. The shortcuts in this directory are usually shown by the system's shell UI (NotchShell being an example shell) and other apps that want to display the official start menu. Almost the same syntax is also used for other directories containing shortcuts (except the BKInit's method everything else is the same). 

The inned syntax of the **add** method have two variants - use whichever you find more convenient.

```Javascript
BKInit.StartMenu(function(menu){
    menu.add(   "--name of the shortcut--",
                "--launch CL script--",
                "-- (optional) alternative name--")
    ).icon( "--modulename--",
            "--imageresource--"
    ).appclass(
                "--class name of the app--"
    ).description("--(optional) long description--");
});
```
Obviously the additional data functions `icon`, `appclass`, `description` are optional. Also the data one puts in a shortcut may or may not be put to real use by the Shell UI (or other UI that is using it.). One should check/configure that in order some of the pieces of data to show up or have the desired effects.

Here is some information about their purpose (more info in [ShellShortcut](CoreClasses/ShellShortcut.md)):

* **name of the shortcut** - is the in-memory file name of the [ShellShortcut](CoreClasses/ShellShortcut.md) instance that will be put in the in-memory directory. By convention this is the name that will be show unless the _alternative name_ is not available.

* **launch CL script** - the CL script that will be recorded in the ShellShortcut (Note that the class ShellShortcut actually inherits from CLScript). Having CL script opens the opportunity to define complicated task in the shortcut, but in the overwhelming majority of scenarios this is just launching an app with (mostly without) some argument(s). E.g. having something like `launch MyAppClassName` or `launchone SuperApp` is what you will usually see in most shortcuts.

* **alternative name** - Alternative name/caption of the shortcut. If the Shell UI supports this it will use it instead of the file name. The in-memory file names are somewhat limited, because some symbols are forbidden in them and this breaks the limit.

**icon**

* **modulename** - The module name from which to fetch the image (icon) resource.

* **imageresource** - the path of the image resource. As you know this depends on the implementation on the server and the [PlatformUtility/VindKraftPlatformConfig](PlatformUtility.md) module. In most cases it is the relative path of an image file in the images directory of the module, but can be somewhat more complicated in projects that manage images in some advanced way (e.g. with rights and ownerships).

Icons are fetched from URL generated using the resourceUrl, mapResourceUrl - see [URL module mapping](UrlModuleMapping.md).

**appclass**

* **class name of the app** - The class name of the app this shortcut starts or belongs to (in much broader sense). This again is not a vital setting which depends on support from the Shell UI or components that do something useful with the setting. The appclass property of a ShellShortcut is basically a marking - it does nothing by itself, but imagine, for example, that you want the running apps marked visually in the start menu - this setting instructs the shell/component that marks them what to look for (to check if that app is running).

The CL script in the shortcut can do anything - one may have several shortcuts for the same app, but each launching or just commanding already running one to change its state in some way (by sending arguments, executing internal app CL commands etc.). One may want to treat even shortcuts not launching that app as belonging to it (they may start something that is not the app, but shows some info about it for instance). So, the marking is declaration "treat this shortcut as a representation of the app specified in _appclass_".

There is existing support in various shell components for _running_ state, _number of top level windows_, _pending notifications_ and so on. Showing some of these or not showing them at all is a matter of design decisions for specific projects and the components responsible for that have to be loaded. You will find information about what is possible in the reverse fashion - from the apps, features that include such components. Shell UI-s usually have some (see NotchShell module for instance).

**BKInit.StartMenu example**

```Javascript
BKInit.StartMenu(function (menu) {
    menu.add('KraftBoard', "launchone KB_BoardManager")
            .icon("bindkraftstyles", "BOARD_Start_Menu.svg")
            .appclass("KB_BoardManager");
};
```

###  1.2. <a name='bkinit.systemmenu'></a>BKinit.SystemMenu

(TODO: write this section)

###  1.3. <a name='bkinit.devmenu'></a>BKInit.DevMenu

###  1.4. <a name='bkinit.privatemenu'></a>BKInit.PrivateMenu

###  1.5. <a name='bkinit.appmenu'></a>BKinit.AppMenu

###  1.6. <a name='bkinit.keylaunchmenu'></a>BKInit.KeylaunchMenu

Syntax:
```Javascript
    BkInit.KeylaunchMenu(function(menu) {
        menu.add("E","launchapp MyApp");
    });
```

Enables you to add shortcuts to `shellfs:/keylaunch` directory. This directory is internally used by the system and executes shortcuts in response to `Ctrl+Alt+{letter}` keyboard combination. Keep in mind that `letter` cannot be everything - some are reserved by the browser (may differ between browsers - test it first). These shortcuts are supported for developer's convenience - when there is no place for a launching UI or running support apps. It is recommended to not overuse this in production as it can scare the end users.

###  1.7. <a name='bkinit.recentmenu'></a>BKInit.RecentMenu

##  2. <a name='cl-scripts-(non-shortcut)'></a>CL scripts (non-shortcut)

###  2.1. <a name='bkinit.masterboot---the-most-important-setting'></a>BKInit.MasterBoot - the most important setting

Lets you specify the boot CL script. This script is executed immediately after all the specified Javascript code is loaded (see the notes a bit later).

Syntax:
```Javascript
    BkInit.MasterBoot("startshell \
        createworkspace 'bindkraftstyles/window-workspacewindow-withshell' \
        initculture 'en' \
        initframework \
        inithistory \
        launchone NotchShellApp \
        launchone WelcomeApp \
        runurlcommands \
        ")
```

The example script above is from early version of KraftApps. The initial 4 statements are virtually mandatory for all BindKraft setups with possible variations of the arguments (current and future). More details and what they do is a topic for the [Boot process](BootProcess.md) article.

This BkInit setting is usually found only in the startup modules (colloquially called WebSite or Workspace modules). To be precise the boot script has a pre-defined name - "**boot**" and must reside in the root of the `boot fs` (which is formally refered to this wat `bootfs:/boot`). When all the system preparations are done BindKraft executes this CL script.

This allows (as with all the other BkInit settings) the script to be rewritten by the different modules and the last one to remain the actual file that will be executed. BkInit is intended for use during the loading phase and before initializing the system. BkInit contains handy means to write settings into the memory - mostly in the memory FS, but in some other places as well. The BK modules load in their dependency order, which guarantees that the startup module will be loaded last and its version of the boot script will take effect instead of any others. This enables a very simple technique - each module can specify such a script - designed for the scenario where it will run alone, with its dependencies only. This is convenient for development time where running all the apps from all the modules is not always useful or even desired.


###  2.2. <a name='bkinit.modulescript'></a>BKInit.ModuleScript

Syntax:
```Javascript
    // Syntax:
    BkInit.ModuleScript(modulename, function(scripts){
        scripts.write(filename, script, appclass);
    })

    // Example:
    BkInit.ModuleScript(modulename, function(scripts){
        scripts.write("clscript1","launchapp App1 launchapp App2");
    });
```

**modulename** - The name of the module. This translates to a subdirectory in the root of `bootfs:` with that name (e.g. bootfs:/mymodule).

**filename** - The file name for the CL script. E.g. if the script is named "myscript" this will create file with the CL in `bootfs:/mymodule/myscript`.

**script** - The content of the CL script

**appclass** - Optional class name of the app launched by the script (if any). This is useful in some circumstances, but is otherwise optional. This property is heavily used by the shell when it displays launch menu(s) with shortcuts which are CL scripts with added icon and description. Knowing what app is started by the script it can show useful tracking information. In raw CL scripts this is useful mostly if you have intention to do something along these lines too.

**What this is and can be used for?**

Module scripts go into the bootfs which is a good hint already. Some modules may include series of apps or/and apps with internal commands. This can go even further - some modules may want to "prepare" the workspace in some manner and then launch an app (or more than one app). Thus by convention any number of predefined scripts can be stored by a module in a subdirectory of the bootfs. They will NOT be used for anything by default, but in the MaserBoot script they can be easily called during the workspace boot process. To call the example script file above we have to include in the master boot gcall 'mymodule/myscript'. 

So, this can be viewed as ready to use scripts for various configurations/scenarios specific to a module offered as files prepared by the module's developer (usually) and placed in a convention defined location. Then some of them can be quickly included in the boot process if and when needed by the person who configures the whole workspace/web site and achieve certain effect. The fact that the developer(s) of the module know best their product makes it reasonable for them to place several scripts for specific modes/configurations and scenarios they want to make optionally available for workspace initialization.

This can go much further in more complex web sites - e.g. the directories can be enumerated and scripts with certain names executed if present. This will effectively implement a very simplified imitation of a classic unix boot process - a simple way to configure the environment for different behavior without the need to dig too deep into app documentation for arguments, supported commands and so on.

###  2.3. <a name='bkinit.commands'></a>BKInit.commands

###  2.4. <a name='bkinit.urlcommands'></a>BKInit.urlCommands

Configures commands that can be executed during the workspace initialization in response to certain URL query parameters. See [BKInit.urlCommands](BKInit_urlCommands.md)

###  2.5. <a name='(deprecated)-bkinit.commandurlaliases'></a>(deprecated) BKInit.commandUrlAliases

###  2.6. <a name='(deprecated)-bkinit.commandurlalias'></a>(deprecated) BKInit.commandUrlAlias

###  2.7. <a name='(deprecated)-bkinit.commandurlglobal'></a>(deprecated) BKInit.commandUrlGlobal

###  2.8. <a name='bkinit.appdata'></a>BKInit.AppData

```Javascript
BKInit.AppData(AppName, function (data) {
    data.content("contentname", optionalcontenttype,content);
    data.object("filename", {... something ...});
    data.folder("foldername1");
    data.folder("foldername1/foldername2");
};
```

Adds a memory "file" to the `appfs:` for the specific app. `AppName` must be the name of the app's main class (_the class instead of the name can be used as well_). Internally this creates in appfs: a directory for your app and puts content under it (including sub-folders if created)

Both `content` and `object` methods take as first argument the name of the memory file. That name can start with a subdirectory path eg. `"settings/devices"`, the subdirectory must exist.

To create a directory, use the `folder` method.

###  2.9. <a name='bkinit.appinfo'></a>BKInit.AppInfo

```Javascript
BKInit.AppInfo(AppName, function (data) {
    data.content("contentname", optionalcontenttype,content);
    data.object("filename", {... something ...});
};
```

###  2.10. <a name='bkinit.workspacename'></a>BKInit.WorkspaceName

```Javascript
    BKInit.WorkspaceName("My magical set of apps");
```

###  2.11. <a name='bkinit.workspacename-1'></a>BKInit.WorkspaceName

```Javascript
    BKInit.WorkspaceName("My magical set of apps");
```
Sets the workspace name, accessible through System.set/get_`workskapceName`

###  2.12. <a name='bkinit.translation'></a>BKInit.Translation

```Javascript
    BKInit.Translation("MyClass", function(trans) {
        trans.add("en", {
            caption: "My great app",
            confirmBtn: "Confirm",
            cancelBtn: "Cancel"
        });
        trans.add("bg", {
            caption: "Моята страхотна апликация",
            confirmBtn: "Потвърди",
            cancelBtn: "Отказ"
        });
    }
```

A simple way to add translations of short texts to the system. This approach is mostly for development time, the translations for production should be loaded from NodeSets, see `loadtranslation` and `loadtranslations` commands.