# BaseWindow

This is the base class of all BindKraftJS window classes. 

Class general declaration:

```Javascript
BaseWindow.Inherit(ViewBase, "BaseWindow");
BaseWindow.Implement(IWindowTemplate);
BaseWindow.Implement(ITemplateRoot);
BaseWindow.Implement(Interface("IExposeCommandsEx"));
BaseWindow.Implement(IViewHostWindowImpl); // Will be removed soon (from version 2.20 these features will be available only in SimpleViewWindow or/and additional dedicated view hosting window classes)
BaseWindow.Implement(IStructuralQueryProcessorImpl);
BaseWindow.Implement(IStructuralQueryRouter);
BaseWindow.Implement(IStructuralQueryEmiterImpl, "windows", function () { return this.get_approot() || this.get_windowparent(); });
BaseWindow.Implement(IAppletStorage); // needs this.provideAsService=["IAppletStorage"] to do anything;
BaseWindow.Implement(IAjaxContextParameters);
BaseWindow.Implement(IAjaxReportSinkImpl);
BaseWindow.Implement(IAppElement);
BaseWindow.Implement(IInfoDisplayWindowImpl);
BaseWindow.Implement(IUserData);
BaseWindow.Implement(IAttachedWindowBehaviorsImpl);
BaseWindow.Implement(IWindowTemplateSourceImpl, new Defaults("templateName"));
BaseWindow.Implement ( IProcessAcceleratorsImpl )
```

BaseWindow derives from a ViewBase and adds `ITemplateRoot` in a manner very typical for a "view" - a form intended to be hosted in windows. This is not a cyclic reference mistake, but a fork in the inheritance hierarchy from which the:

>view oriented classes specialize into ways to back work with components and other details one uses in all kinds of forms

>and the window classes (starting with BaseWindow) specialize into the role of containers for other windows and views.

Despite the _container oriented_ specialization windows often need to present some UI elements around their payload (the contained view or windows). Inheriting from `ViewBase` enables these parts of the windows (called **system part**) to be implemented basically the same way this is done in a view, or any UI component. Of course while a view (form) oriented classes specialize in a direction that adds easier ways to load them, to host them in different containers, the window oriented classes, on the other hand, do not go that way, because they are first and foremost containers.

Being such windows still offer usage of the same mark-up with `bindings` and `components` in their system parts, remaining more static in nature - loading these mark-ups for their system parts from their (predominantly static) templates, instead of supporting a number of ways to dynamically change/reload them like the views (forms). If you compare this with any experience you have with window-like constructs in various UI constructs (not necessarily as a developer) in OS user interfaces for example, it will most likely immediately look logical enough. The containers for the primary work areas are not expected by any user to change radically all the time. Smaller changes reflecting the state or whatever they contain are expected, on the other hand. One expects menus, toolbars and other kinds of control UI in the system parts of a window.

## Members reference

TODO: Continue writing

