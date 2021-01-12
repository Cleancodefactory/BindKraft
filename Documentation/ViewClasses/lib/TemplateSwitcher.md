# TemplateSwitcher

The TemplateSwitcher component enables switching between templates. One template of a given set is materialized inside the component's element in response to changes of the data bound to the component.

Lets take an example usage:

```HTML

<div data-class="TemplateSwitcher"
    data-bind-$item="{read path=names}"
    data-on-$select="{bind source=__view path=onSelectNamesTemplate}"
>
    <div data-key="person">
        First: <input type="text" data-bind-val="{bind path=first}"/><br/>
        Last: <input type="text" data-bind-val="{bind path=last}"/>
    </div>
    <div data-key="company">
        Company name: <input type="text" data-bind-val="{bind path=company}"/>
    </div>
</div>
```

In this simplified to the bones example we want to show for editing the names of a person or the name of a company. We assume they are a sub-object of larger object tree and hold either names of the person in separate fields or the company name in a single field. In the real world we surely need more than that, but for the sake of simplicity we can recognize what kind of name this is by the existence of the corresponding fields in the data.

The template switcher will trigger materialization of one of the two div-s from the code above when its `$item` property is set. This is done by the `data-bind-$item` binding in our case and will happen whenever `updateTargets()` hits that binding.

To choose the template the switcher will call the callback method specified in handler fashion `data-on=$select`. 

## The `select` callback

This all probably sounds simple and sound if it is not for the similarities of this `data-on` syntax to the event handling syntax. Indeed the syntax is the same, but in this case we specify a callback that returns a result, while in the case of event handling we can list more than a single binding in the right side of the `data-on-*` attribute and they will all be invoked in the same order. Obviously, this multiple handler syntax is inappropriate when specifying callbacks expected to return results, so in such cases only one handler binding can be specified. This is not used very often, but there are cases like the `TemplateSwitcher` where a simple callback can provide us with a very powerful construct.

The callback in the case of the TemplateSwitcher will be something like:

```Javascript
MyView.prototype.onSelectNamesTemplate = function(switcher, dataitem) {
    if (typeof dataitem.company != "undefined") {
        return switcher.getTemplateByKey("company");
    } else {
        return switcher.getTemplateByKey("person");
    }
}
```

The first argument is the switcher itself and the second is the data being set to its `get/set_item` property. Yes `dataitem` is a bit redundant as you can get it by calling `switcher.get_item()`, but is provided for convenience. This clearly shows the primary purpose of the component - to switch the template depending on the data being displayed in it.

> _In real world scenarios the choice that the `select` callback must make is usually more complicated and may depend on both the data and the state of the class of which the callback is a member (view or a component/control). This is not a problem as the `this` will point correctly to it when the callback is called. References are not supported in contrast to the event handlers and this is intentional (adding support will be literally a line of code). The reason behind this is that `TemplateSwitcher` changes part of the view - destroys whatever is held in it and materializes the selected template from scratch. Under these circumstances and especially in case of usage of nested switchers passing references to short-lived elements/objects is an easy mistake and thanks to the fact that this changes the view its consequences can be much greater than in the case of handlers. Hiding the binding object from the callback forces the developer to find more stable ways to build the necessary logic and avoid such problems._