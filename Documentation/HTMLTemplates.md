# HTML templates in BindKraft

This is mostly a disambiguation article. The templates or `HTML markup with BindKraft extensions` are processed basically the same way in all scenarios, but there are differences in the supporting features and the context in which the processed templates are initialized and used.

## Supporting features and contexts and the categorization of templates according to them.

**[Preloaded templates](Templates.md)**

Typically called just `templates` they are used mainly for component/control templates, but there is no reason to use them in any custom scenario that will benefit of them.

> These are all loaded while the workspace is initialized and are always available as in-memory strings. Can be used through various classes and helpers, see more in [Templates](Templates.md).

**Views**

**[Views: Dynamically loaded templates for view windows](View.md)**

While `dynamic loading` templates obviously means that they can be loaded in any manner that allows textual content to be obtained from somewhere, this category covers a traditional for BindKraft feature for loading and initializing templates as part of the creation of certain windows - View windows.

> The `SimpleViewWindow` window class is the only one that supports this feature, but it is also the most used type of window - the one that holds almost the entire app UI. The templates loaded in SimpleViewWindow instances are called `views` and they are the main containers for the implementation of the application's UI. When views are designed they usually contain in their templates components/controls which in turn use the **preloaded templates** (see above).

## Template/view instantiation process




## Comments on view and templates (skip if not interested)

**The obvious reason for these different practices** and the features available to support them is the fact that components/controls are typically used in many instances in many places of an app or even multiple applications in the same workspace. Therefore having their templates preloaded enables them to instantiate without the need to wait a server response. Cache on first use has been attempted as practice before, but in big views with multiple components it can cause strange (from user point of view) slow downs when some parts of the applications open for the first time and the preloading was adopted as a technique that avoids that. Views on the other hand are usually much bigger pieces of UI and are typically implementing functionality that is seen by the user as a "new work area" and their loading on demand is tolerable and perceived as part of the application's work to respond to an user action.

**Preloading views**: Lately many applications use the so called "View managers" to preload views for view windows and even keep these very windows instantiated and waiting to be only placed/shown when new work is available for them. This technique offers improved performance thanks to usage of the data binding more thoroughly, but may not be the best way to go in all kinds of scenarios. A good argument to not stick to just a single technique is that BindKraft does not follow only a simplified site like application behavior like most modern frameworks do, but depending on the application's functionality the programmer can choose more desktop-like or less desktop-like architecture for his/her application(s) and this means that clear separation between frequently used and infrequently used parts of the app can be implemented, making it reasonable to load on demand views that are not expected to be used every time the user opens the app and preload those that are most likely to be needed for the core functions.