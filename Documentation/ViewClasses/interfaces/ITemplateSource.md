# ITemplateSource

This interface enables `Base` derived classes to use their own templates and also to serve as templates sources for other components.

The first usage is widely implemented in BK and components for it, while the second usage is applied less frequently, but is no less important.

```Javascript
function ITemplateSource() { }
ITemplateSource.Interface("ITemplateSource");
ITemplateSource.prototype.get_template = function (); 
ITemplateSource.prototype.set_template = function (v);
```

As shown above the interface defines a single property get/set_template. Components derived from `Base` often are used as black box appliances that materialize, inside the element on which they are specified, their own template. This enables the programmer to place components where needed and treat them as ready-to-use contraptions. Similar features can be seen in many WEB oriented frameworks and libraries, but the unusual thing here is the fact that the interface on which this is based is also a source from which the template can be read by other component tha wants to use it - a technique useful in not so many cases, but very handy when implementing series of components that have to derive their templates from the context. The best representative examples can be designed around implementations that require recursive templates or templates managed from outside the component.


## ITemplateSource implementors

There are two built-in implementors for the `ITemplateSource` interface:

* One for components and controls - `ITemplateSourceImpl`
* One for windows - `IWindowTemplateSourceImpl`

### `ITemplateSourceImpl`

Usage example:

```Javascript
function LookupBoxControl() {
        Base.apply(this,arguments);
    }
    LookupBoxControl.Inherit(Base, "LookupBoxControl")
        .Implement(IUIControl)
        // ... skipped for brevity
        .Implement(ITemplateSourceImpl, new Defaults("templateName"),"autofill")
        // ... skipped for brevity
        .Defaults({
            templateName: "bindkraft/control-lookupbox"
        });

```

The example is from the LookupBoxControl, but the advanced details not directly related to the basic usage are excluded from the snipped.

First, most often components implementing `IUIControl` do so to achieve isolation and internalization of their functionality and this makes them the primary candidates for components carrying their own templates.

The implementor accepts up to two arguments:

* The template name in `module/template` syntax, which is most often specified through `Defaults` in order to enable reconfiguration of the template in modules carrying themes for instance. The Defaults links the parameter to a defaults entry (templateName) in the component's class.

* Auto-materialization flag specified as `true` or the keyword `"autofill"` (if better readability is your poison).

Without `autofill` specified the template can be auto materialized by calling `ITemplateSourceImpl.InstantiateTemplate(this)` in the `init` method of the component's class. Yet this is kind of pointless, because custom usage of the template needs more than that and will require some lower level code anyway (discussed further in the document), so there is no need to do that for no reason.

#### What you get

Using the implementor one gets multiple benefits:

* Easy usage of templates with option for reconfiguration (see blow)

* Support for ITemplateConsumer