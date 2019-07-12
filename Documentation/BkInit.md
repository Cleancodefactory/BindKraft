# BkInit - initialization helpers

These helpers are intended to be used in the `init.js` files of modules.

To understand this you have to know the usage of the [BK modules](BkModules.md) and know something about the in-memory "file systems" used by BindKraftJS to hold settings and state data.

The example snippets are written as global code to avoid the need to know additional conventions. See the recommendations in the Recommendations section at the end of the article for some ideas how to establish a better practice in your projects (optional).

Project construction and configuration guide (_TODO: put a link here when the article is more or less ready_)

Last update for version: 2.17.5

## BKInit - shortcuts

### BKInit.StartMenu

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

### BKinit.SystemMenu

(TODO: write this section)

### BKInit.DevMenu

### BKInit.PrivateMenu

### BKinit.AppMenu

### BKInit.KeylaunchMenu

### BKInit.RecentMenu

## CL scripts (non-shortcut)

### BKInit.MasterBoot - the most important

### BKInit.ModuleScript

### BKInit.commands

### BKInit.commandUrlAliases

### BKInit.commandUrlAlias

### BKInit.commandUrlGlobal

### BKInit.AppData

```Javascript
BKInit.AppData(AppName, function (data) {
    data.content("contentname", optionalcontenttype,content);
    data.object("filename", {... something ...});
};
```