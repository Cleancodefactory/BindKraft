# ref

Example:

```
{bind source=something path=something ref[name1]=a/b:bindingname ref[name2]=a/b@prop ref[name3]=a/b~dcprop.dcprop2}
```

The `ref` binding parameter exposes a reference to something else in the view or a value extracted from a specified location. Multiple `ref` parameters can be specified in a single binding as long as their names (specified in square brackets) are different.

They can be accessed by any code that has access to the binding:

_Most common_

- in the handler specified in a `data-on` binding. The 3 argument of the handler is the binding and it can call `binding.getRef("refname")` to obtain the reference.
- in custom formatters - again the binding is the 3 argument in their ToTarget/FromTarget (_adHoc formattters_) routines (_Read/Write methods in custom formatters implemented as classes derived from CustomFormatterBase_).

_Less common_

- Binding obtained directly - found through `Base.findBindingByName` for instance.

The `ref` parameter in a binding is mostly useful in `data-on` kind of bindings, but can be also employed in data-bind bindings by a custom formatter used by the binding. This is also accessible for system formatters, but it is unlikely to find an useful case for a system formatter to use a binding reference.

The main purpose of the `ref` parameters in a binding is to provide additional references/values from "places" in the view to the handler (data-on) or formatter/converter (data-bind) needed for their operation. Teh view (template) designer can provide the same references/values even if the view changes by changing the `ref` paths to point to the same object or value.

## Syntax

There are 3 kinds of expressions that can be specified in a `ref` setting. They can address respectively- a binding by name, a BindKraft object attached to a DOM node, data in the data context locally and at the location of arbitrary other DOM element in the view/template.

The syntax has the following forms:

```
for bindings
ref[myref]=<parentkey>[/<childkey>]:<bindingname>

for data-classes and inside them
ref[myref]=<parentkey>[/<childkey>]@
ref[myref]=<parentkey>[/<childkey>]@<someproperty>.<itsproperty>

for data context
ref[myref]=<parentkey>[/<childkey>]~
ref[myref]=<parentkey>[/<childkey>]~<someproperty>
```

### parentkey / childkey part of the address



Here `myref` is the name of the reference which is specified in accordance to what the handler or the custom formatter(s) using the reference expect. It should be specified in their documentation (check their source if there is no other information).

The `parentkey` is the `data-key` of parent (ascendant) DOM element in the template/view or one of the special keywords:

* `self` - denotes the element on which the binding is defined

* `__control` - denotes the closest parent component border - a DOM element with a `data-class` implementing the `IUIControl` interface.

* `__view` - denotes the root element of the current view (should not be used in controls - components that carry and materielize their own templates).

The `childkey` is optional and if used has to be the `data-key` of a child element of the element identified by the `parentlkey`.

The `parentkey` and `childkey` together determine an element. If more then one element can be identified - the first one in DOM tree order will be used. This should be avoided for usage in `ref` and if it happens the `data-key`-s should be changed to provide unique identification of the concerned elements. 

### Addressing bindings

```
ref[myref]=<parentkey>[/<childkey>]:<bindingname>
examples:
ref[indicator]=self:colorupdater
ref[units]=formroot/unitspanel:unitsfield
```

From the element determined by the parentkey/childkey part is used as base from which to find a binding that specifies a setting `name` equal to the `bindingname` specified. The search is case sensitive, but as a convention lower cased names are recommended.

> The search for the binding with the specified `bindingname` proceeds as follows: The addressed element (by prentkey/childkey) should, preferably, have a `data-class`, if this is so all the bindings on elements inside that element will be searched, but not the bindings on the element itself.

> If the addressed element has no `data-class`, the search will start from its closest parent that has `data-class`. This option is obviously a potential source for mistakes and not recommended. It is kept available for legacy compatibility reasons.

**On the consuming side**

The ref is most commonly used in event handlers, so we will talk about them, in custom formatters there is no difference except the typical reasons for the usage of references.

Assume this piece of HTML with bindings as part of a template/view

```html
<div data-key="formsegment">
    <input type="text" data-bind-val="{bind path=somefield name=count}">
    <button data-on-click="{bind source=__view path=onDoSomething ref[amount]=formsegment:count">click me</button>
</div>
```

According to the HTML above the handler is in the view (not important for the example). Assume it does something that determines logically some "amount" value and needs to update it into the UI, but on behalf of the user without updating the data, which is supposed to happen after the user enters some more data in other fields not shown in the example.

```javascript
SomeView.prototype.onDoDomething = fnction(event, dc, bind) {
    var x;
    // Something is done here and x is set to a number specifying the determined amount.
    // now let us autoset it in the UI.
    bind.getRef("amount").set_targetValue(x);
}
```

Of course one can find the `input` element and set its value through DOM and even with the help of BindKraft, but using the binding obtained through the ref has multiple benefits. Here are some of the most noticeable of them:

* If the `input` is some day replaced with a different field - a dropdown for example. The binding will bind to different property (if needed), may need different formatters and so on, but if it keeps the name the code will still work without changes.

* Through the binding the formatting/conversion specified in it will happen - by default it will be applied in the respective direction for `get_targetValue` and `set_targetValue`. This still can be turned off when needed for get_targetValue if called like `binding.get_targetValue(true)` - the optional boolean parameter disables the backward formatting when reading from the target if set to `true`.

* One can access more from the binding, for instance not its target, but the source - using `get_sourceValue` and `set_sourceValue` (no formatting by default). Other methods of the [Binding](../ViewClasses/Binding.md) class are also available and enable the handler to use the binding's capabilities when needed.

The most important effect is perhaps the fact that the handler's actions will be indistinguishable from normal binding for the target or the source of the binding.

### Addressing data-class objects and inside them

```
ref[myref]=<parentkey>[/<childkey>]@
ref[myref]=<parentkey>[/<childkey>]@<someproperty>.<itsproperty>
```

With this syntax the addressed element by the parentkey/childkey part has to have a `data-class` or one will get only null from the reference. 

When the reference just ends with the `@` symbol, the `getRef("myref")` in code will return reference to the object specified by the `data-class` attribute on the element. For example in a handler you can do something like this:

```javascript
MyView.prototype.onSomething = function(event, dc, bind) {
    // update the sources in another part of the templete
    bind.getRef("myref").updateSources();
    // or update targets - be careful to not overlap areas anyway
    bind.getRef("myref").updateTargets();
    // Make sure what the class is and call a specific method defined on that class (your own class or BK class - whatever you need)
    if (BaseObject.is(bind.getRef("myref").updateTargets(), "SomeClass")) {
        var x = bind.getRef("myref").someMethod(/*some arguments*/);
    }
}
```

Up to this point we are talking about an usage where you know the class or calling methods/accessing properties in general manner - assuming a common base class ([Base](../ViewClasses/Base.md) for instance), but what if your code needs to be unaware of the class of the addressed object?

In such a case one can specify a property chain after the `@` symbol.

```
ref[myref]=key1/key2@prop1.prop2
```

Property names are separated with "." dots and the reference will return the property value or null if the chain hits a null or undefined somewhere. Depending on what you have in the addressed property you can do more than just read values - if the property contains a reference to an object, you can check its class, call its methods get/set it properties and so on. The only recommendation is to not forget the type checks before performing the actions you intend to do and if you are a good guy throw an informative exception when the type doesn't match your expectations.

The property path will get values from both javscript fields and get_propertyname properties. The get_ properties will be tried first if you have of the both kinds with the same name. Note that the `$` prefix is not supported here and you cannot distinguish between "active" properties implemented as get/set_ methods and normal javascript fields. This may look as inconsistency, but is intentional - prevents reliance on specifics in case the desired path changes even in nature (how the properties are implemented). This reflects the main purpose of the references - to provides means through which the code can be written in a manner resistant to small and moderate changes in the templates/views.

> The main benefit of using this kind of references is to make a code (usually handler methods) resistant to template/view design changes. The designers have to maintain the references and point them to the new locations where the expected objects reside and the code will continue to work without changes.

Again, like in the other references, there other ways to find the objects you need, but none of them is implicitly interwoven with the template design and they will either case mistakes way too often or if your team is careful will, at least, become a stopper for template changes - for both design and functional reasons.

### Addressing data context

```
ref[myref]=<parentkey>[/<childkey>]~
ref[myref]=<parentkey>[/<childkey>]~<someproperty>
```

The `~` symbol after the parentkey/childkey part causes the getRef for that reference to return the data context visible at the addressed element. Using the `self` keyword will address the data context at the binding element, the other special parent keys will address the actual data context at other locations as expected.

The property path behaves exactly the same as in the other case - when addressing data-class objects and if omitted getRef returns the data context, if present - the value of the property addressed by the `prop1.prop2...` chain. For example, presume you need the FirstName property from a data context of another part of your template/view.

```html
<button data-on-click="{bind source=__view path=onSomething ref[firstName]=somecommonparent/somekeyfromtheotherpart~FirstName}">
```

```javascript
MyView.prototype.onSomething = function(event, dc, bind) {
    var firstName = bind.getRef("firstName");
    // use it for whatever it is needed.
}
```

Handlers of DOM events receive the data context in which resides the element on which the event is intercepted, but this is not true for the custom events fired by BindKraft classes - some might do it others don't - it depends on what they consider relevant data and they can be designed for usage not only in templates, but from code. Long story short - using ref[dc]=self~ one can pass the local data context to the handler even when it is not passed as second argument to the handler.

> Benefits of references pointing data contexts or parts of them is the flexibility of the data context design and separation that is achieved this way. The handlers that use such references can remain unchanged if the data context and its distribution in the view changes by updating the references in the bindings that activate them.

> Sometimes a handler has to consider several values from different data contexts in order to do its job and the only way to achieve a good solution to such a problem without references will be to stick to a strict MVC pattern, which has downsides of its own - the most prominent of which is the need to black box too many pieces of your templates which effectively defeats the purpose of using templates when this goes too far.

## Remarks

The binding references are a simple and powerful technique to solve problems that cna otherwise force the programmer to structure the code and the templates in inconvenient ways that will also often double and triple the code need to cope with them. However, like everything else, the binding references can be used wrongly and become a source of problems on their own. If you are using references everywhere and many of them - you are probably overdoing it. 

This feature is designed to help the programmer keep code and templates in balance and one can break this balance in both directions- by avoiding references and by using them when something should go into the code. The majority of the modern frameworks and UI programming environments avoid similar features (as appropriate for their respective UI mechanics) in an attempt to force the programmers to stick to some strict patterns (most often MVC and derived), but if you look at it more sanely, they always lead to extensive black boxing - i.e. templates become smaller and smaller, single forms/views can no longer be designed as a single template or even as reasonably nested granulated templates. It is a common sight to see frameworks initially loved for their template features become a mess where one needs dozens and even hundreds of "couple of lines" templates in order to design the thing. BindKraft recognizes the effect and references are one of the features that helps the developer to keep control over the granulation. The real world projects are not and cannot be designed as perfect black boxed components (we call those controls), the boxing is not a straightforward process applicable everywhere - components have to vary in their specialization and context bindings in order to keep projects consistent - e.g. it is obvious that you can completely black box a color picker component, but this is not wise for a component specific for a project, where black boxing will force the programmers to feed it a serious amount of data that it can actually get itself easily without much abstract techniques if it is acceptable to access from it stuff that you know is always present in the project. Abstract techniques (services, DI etc.) are a good thing, but when you have to solve concrete problems they just turn into trouble planned in haste further granulating your code, thus making any mistake even harder to fix. Using references and other BK techniques one can moderate the complexity, but nothing comes as a gift - you have to avoid overdoing it in either direction.

