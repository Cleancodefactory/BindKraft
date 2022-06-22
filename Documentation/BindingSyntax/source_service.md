# binding source/service/translation attribute

Optional attribute specifying the source of the data binding. It works together with the `path` attribute - the source points at the start point (object), `path` defines the path from there. Source, service and translation are mutually exclusive.

Currently 4 types of sources exist:

## None (no source, service or translation is specified.)

The binding's source is the data context applicable to the element on which the binding is specified.

**Important!** A frequent mistake that may occur is to consider the parent data context while actually writing a binding on an element with separate data context. If the parent context is needed use `source=parentcontext`.

## source

In general this attribute specifies the starting object by using the `parent/child` data-key navigation.

Example:

```HTML
<div data-key="area1">
    <div data-key="area2">
        <input type="text" data-bind-val="{read source=area1/input2 path=$value readdata=$valchangedevent}"/>
    </div>
    <div data-key="area3">
        <input data-key="input2" type="text" 
            data-class="TextBox"
        />
    </div>
</div>
```

In this example the only binding refers to the second text box and loads its value into the first one when it changes.

**This attribute also defines a number of special targets:**

* `self` - The element or if there is a data-class specified on it - the instance of that class attached to the element.

* `static` - Static value useful for some parameterizations or for tests. A `text`, `number` or `object` directives can be used to specify the value. The text and number need value in quotes e.g. `number='8'` and object specifies a class name or the keyword `object`. e.g. `object=object` will assign empty simple javascript object which is often convenient for local data contexts filled with bindings. Example: `{read source=static text='some text'}`.

* `globalresource` - deprecated.

* `appletstorage` - obsolete, will be deprecated.

* `systemsettings` - provides access to the system settings. Programmatically available under the `CSystem.Default().settings` as plain JS object tree.

* `settings` - Reserved for future use.

* `parentcontext` - Will work like a binding without source, but will always look in the data context outside this element. This is often needed in components that change their data context, but need some of their properties to be bound to data in the outer data context.

* `__view` - Works in views only (inherited from ViewBase), refres to the root element of the view. Can be used with a child key e.g. `source=__view/input2` will find some (presumably) input element named input2 in the view. 

* `__control` - Works inside components implementing `IUIControl` interface. This is a marker interface which isolates to some extent the component from the rest of the template in which it is placed. Refers to the root element of the component (it does not matter how it was materialized - from template or in-place). For more information see `components`.

## service

Uses the service location features to find the first exposed service of the specified type.




