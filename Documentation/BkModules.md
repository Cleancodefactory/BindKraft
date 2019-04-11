# BindKraft Modules (client side perspective)

_The BindKraft modules should not be mistaken for Javascript modules. In future implementation the BindKraft modules may involve usage of Javascript modules, but even in that case they are completely different thing._

BindKraft modules can be implemented differently on the server side, but their client perspective must remain the same - i.e. the client (BindKRaftJS) must see them the same way barring URL syntax. For the differences in the URL syntax takes care the [PlatformUtility](PlatformUtility.md).

A module is a collection of resources and code that has a name. They may include server side functionality, data and resources not directly accessible for the client, but they also have to expose certain resources and entry points to the client. Thus a Bk module is something like a DLL or assembly - packed together functionality and resources that are exposed for client-side usage through certain rules (described below). The description here is very general, illustrated with some examples. As it was already said, the server implementation can vary a lot - from serving mostly static resources to advanced server-side application providing the client with entry points performing complex tasks.

The main purpose of the Bk modules is to split the apps, libraries and resources into pieces that can be included or excluded in the constructs that the end user sees. Let us illustrate this with a short description of a potential construct:

    The user opens the WEB address of a BindKraft desktop and sees something that may be styled to look differently - like page or like a desktop with applications working in windows for example.

    In actuality the latter is the case - it is a desktop setup that can execute a number of pre-configured applications and daemons (non-visible services used by the apps). The styling may intentionally hide this from the users (typical for public sites) or on the contrary emphasize the desktop OS-like nature of the BindKraft setup (typical for business projects) - it is all a matter of purpose - what this desktop setup is designed for.

    The desktop setup is done by including in it a number of BindKraft modules that collectively pile together everything needed by the applications implemented in them. They will include the core basics, such as BindKraft module that contains the Javascript platform of BindKraftJS, a styling/theme module containing the core templates and styles, some library modules (with advanced controls for example), the PlatformUtility module, modules containing apps and finally a module that ties them all together by defining/redefining some pieces of configuration and containing the launching CL scripts.

    Because of the OS-like approach of BindKraft there will be an application that will act as Shell UI and will take care for launching and switching between apps. There will be some utilities besides the main apps that are the very reason for constructing this setup. One can say this will be something like pre-configured desktop working environment in which the user will be able to use a number of main apps and some additional ones to do his/her work.

For a setup like this many details have to be configured so that, for example:
* launching icons to show in the shell
* indicators (like system tray) to appear in it.
* the boot process to initialize everything as needed and launch the shell and any resident apps.
* configure various features of the system and the apps

The list can be quite long, but the whole concept should be already clear - one constructs a wrorkspace (we call it `workset`) for the user by including and configuring modules. Anything written with BindKraft is written in modules and available for inclusion in such `worksets`.

## Module dependencies


