# Memory files systems - defined locations and purposes

This document is a starting point of the directory of all the currently defined in-memory FS locations, formats and their purposes.

The document and the related ones will be updated as new locations are defined and new options available. Check back here from time to time to see what is new.

## File systems

### bootfs

`bootfs:/boot`

> A script file (CLScript) which is the first script executed at system boot. It is most often called the `master boot` script.

`bootfs:/modulename/*scripts`

> Here `modulename` is a directory named the same as a BK module. In the modules the developers can define any number of script files and even subdirectories under this one. These scripts should perform boot time tasks, configuration or initialization. Modules containing flexible apps and libraries can provide this way pre-defined optional sets of actions/initializations that can be called from the master boot script in order to configure the apps and libraries supplied by the module in certain ways in the constructed workspace.

> The rationale is that configuration and initialization of flexible and powerful apps and libraries can get complex and obscure. The developers who want to use them may need considerable time to learn what needs configuring and how to do so. This way the original programmers of a module can supply a number of pre-configured profiles and enable the consumers of their work to choose one, call it at boot time and be done with the initialization without the need to dig into the documentation for details.

### shellfs

Shell FS as noted in other places is almost exclusively for "shortcuts" - a derivative of CLScript with a little more UI oriented data, like description and icon (image). All the locations are supposed to contain shortcuts unless something else is specified. The shell UI or apps offering to the user the option to start other apps are using them to form lists and menus.

`shellfs:/apps/-appname-/*shortcuts`

This can be seen as the programs menu in Windows. Each app can create a subdirectory under `shellfs:/apps` with its name and place there a number of shortcuts (even in further subdirectories if necessary). The more complex the app, the more need it has of different ways to be launched, so this is the place where a kind of full set of possible shortcuts has to be stored. In practice designers of the final form of a project usually want to avoid confusing users with a multitude of ways to launch any of the apps included in the project. This is the reason to keep these advanced shortcuts in a separate location - they can be shown in advanced menu or completely hidden, but still providing the developers responsible for the way the project is presented to the end user to pick ready-to-use shortcuts from there individually.

`shellfs:/startmenu/*shortcuts`

This location is reserved for the main start menu. Each app designed as something that should be launched on user request should place a single shortcut there (in rare cases it might be acceptable to put more). Shell UI usually constructs the main menu of the project from there by default. Of course, the option to remove everything in `startmenu` and design it manually is always open if the end form of the project should be formed in very specific manner. However the convention for all the apps to put their main shortcut there enables construction of a BindKraft project by just putting all their modules (and dependencies) together, including a module containing a Shell UI and wrapping this up with a nearly empty module that just pulls all those modules together. In such a case the start menu will be defined by default - by the sum aff all the shortcuts registered by all the included apps and the project will be functional and straightforward enough for end-user consumption.

`shellfs:/keylaunch/*shortcuts`

This is a very special location where all the shortcuts must be single letter files. BindKraft will look in this folder whenever `Ctrl+Alt+letter` is pressed on the keyboard and launch the corresponding shortcut if it exists. Obviously this is an option mostly for development - when using a shell UI is not desirable for some reason, but this option can also be used as a way to launch tool/diagnostic apps when providing support to the clients (by phone, chat, email). One additional consideration exists in this case - be aware that some of the combinations are intercepted by the browser without any chance to use them in the Javascript. Before choosing a letter check out carefully if it is "free" - especially if it will launch tools you need for client support. What is available will differ a little between different browsers. Providing an alternative way deep in some settings view or menu well out of the way is always a good idea anyway.

`shellfs:/recent/*shortcuts`

This is the location where the recently used shortcuts are collected and can be used as a source for a "recent" menu if one is desired. The Shell UI (like Notch shell for example) usually maintain recent shortcuts, other apps that launch shortcuts can also do so by using the [CLRecentShortcuts](../SystemClasses/CLRecentShortcuts.md) - it is obtained from `System.RecentShortcuts()`.

`shellfs:/system/*shortcuts`

This location is reserved for system tools (if any). A couple of modules available on github containing general BK system tools will write a shortcut there by default, but they are rarely included in end-user form of the projects. The location is rather reserved for launching "system" apps or other apps in "system" mode specific for the project. For instance, a project may have a separate app for general settings applicable for all or most of the other apps, user profile management often falls in similar category as well.

`shellfs:/develop/*shortcuts`

If a separate menu for developers is desired - this is the location reserved for it. Some modules containing dev tools for BindKraft would put shortcuts there. Other than that it is up to you to decide what you want here.

`shellfs:/private/(*subdirs|*shortcuts)`

Under the `private` location any kind of directory structure with shortcuts can be created. This location is reserved for this purpose to guarantee that any specific needs will not collide in future with newly defined locations.

An example use is list(s) of manually picked shortcuts later used by welcome app (one launched when new user opens the site for instance). It is quite understandable that such an app will emphasize some, but not all apps in the project, the shortcuts may contain much longer descriptions filling wider UI and so on. There are quite a few scenarios when using custom sets of shortcuts can solve some design requirements with very little work.

### infofs

`infofs:/appinfo/-appname-/*`

For each app various files can be created according to corresponding conventions. These provide information for capabilities, configuration settings and potentially many other details without the need to start the app in order to obtain them. Through this feature various BK general or project specific solutions can provide general services for the user based on the available "knowledge" for the apps in the project. For example: settings management for all the apps in one place, available apps that can handle certain tasks and so on.

Further details on the various defined conventions will be listed here as they appear:

> [userprofileentries](AppUserProfileResources.md) - contains declarations for user bound settings for the app.

`infofs:/modules/*`

Still unused, but reserved for per-module information.

`infofs:/msgspool/*`

Reserved for notification/messaging - still unused.

### appfs

This file system is for application data. Apps can create directories with their class name and put whatever they need under them or expect files created from outside as configurations, work documents etc.

`appfs:/system`

is reserved for system files. Certain features depend on files there, for example under `appfs:/system/urlcommands` reside files defining what must be done with the URL with which the project has been opened.

