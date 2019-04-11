# Data context

The data context is a BindKraft feature that enables different data to be bound to different points of a [View](View.md). If you are not yet familiar with the concept of a `view`, please read the [corresponding document](View.md) first.

## So, what is a data context?

A view is part of the HTML DOM with any of the BindKraft objects (as specified with the BK additional mark-up) attached to its nodes. In parallel to that BindKraft supports this additional feature - data context.

Any data can be attached to any node of the DOM of the view and the rules this follows makes it data context.

Let's take this HTML. We will put in it some `data-key`-s, none of them has no real role and we only use them for the purposes of this text.

```html
<div data-class="Component0" data-key="div1">
    <span>Some text here</span>
    <span data-bind-text="{read path=a name=binding1}"></span>
    <span data-class="Component1">
        <span>something ...</span>
        <span>something ...</span>
        <span data-bind-text="{read path=a name=binding2}"></span>
    </span>
    <div data-key="div2">
        <div data-class="Component2">
            <span data-bind="{read path=a name=binding3}"></span>
        </div>
        <span data-bind="{read path=a name=binding4}"></span>
    </div>

</div>
```

In general the data for a `data context` may come from anywhere, only more specialized constructs can put additional restrictions on that (for example the typical views held in `SimpleViewWindow` windows.). For example your code may create a Javascript object and set it as data context. How these things happen in code we will cover later in this article. All data context based features follow the logic described here, so it will be easier to first learn the rules and then the classes and members following them while they access the data contexts for you.

Let us assume we want this data as data context attached to **div1** in the above example:

```Javascript
{
    a: "Context 1"
}
```

As you can see we have one and the same binding syntax used in several places. At this point all the bindings will have the same result - they will bring the string "Context 1" to their targets.

This is so because

>The data context applies to the DOM node to which it is attached and all its descendants up until another data context is attached to some node. Then the same rule applies again.

Above we have one DOM node encompassing all the rest, so the single data context attached to it will apply to all of them.

Now let us put another data context somewhere:

```Javascript
{
    a: "Context 2"
}
```

We form it the same way in order to not need any changes in the syntax of the bindings, but to change the data they tap into. Now let us attach it to the node **div2**. If we update the view the result will be that `binding1`, `binding2` will still bring "Context 1" to their targets, but `binding3` and `binding4` will bring the string "Context 2".

This is happening because attaching different data to **div2** for that node and all its descendants the data context is different - the second one we attached.

## How the data is attached

The data that becomes the data context is attached to a node by setting the DOM element's property `dataContext`. Normally the DOM nodes do not have this property and it is assumed to be empty.

This can be set directly on the DOM element - no need to use any BindKraft method for that. However **it is strongly recommended to never set data context directly** this way. There is even binding syntax for setting the data context on element directly, but even that is not recommended.

The special binding syntax:

```html
<div data-context="{...}"></div>
```

The content of the curly brackets can be anything usable in `data-bind-` kind of binding.

This should be avoided for one simple reason - typically we want to react to the changes of the data context and just setting the data context on a DOM node, without notifying the BindKraft components will not bring any reaction from anything. One instinctively expect the change of the data context to have consequences and bypassing the components will be contra-intuitive and often confusing. Still, the special binding syntax and the information on how to bypass everything have a reason to exist - to enable low level functionality to be built by new components into the framework itself or as an add-on.

### Empty contexts

Normally a `null` is treated the same way as a missing data context (no data context). So, without additional instructions setting a data context on a node to **null**, **effectively removes** it.

In many cases this behavior is inconvenient and the developer will want to always have a data context at certain node, even if the data that is assigned there would happen to be **null**. This is achieved by adding a special attribute to that element:

```html
<div data-context-border="true"></div>
```

A node marked this way will be treated as having data context no matter if it is empty or not.

Another case when data context is assumed no matter the data is the `template border`. This concept is also described in the [View](View.md). To form the UI infrastructure in the DOM BindKraft has to treat certain nodes as borders between separate areas. A good example is the UI part of a window (its caption, any buttons and other control elements) from the view contained in it. The window plays the role of a container of the view, thus they are two separate entities and while both use the same low level functionality none of the operations intended to affect one of them should not affect the other (which includes virtually everything). When you do something over these two parts you do it from different perspective - the window parts are controlled by the code of the window itself or a code that manages the window. This code may or may not have any information about the view contained by the window. On the other hand the code behind the view will be designed for the view and like in the other case can only indirectly have some vague knowledge about its container. In any case if the manipulations of one of the views affects the other as if it continues over the other, the effect is likely to be something unwanted.

Template borders are recognized in two ways:

- as a special quality of the component attached at a given node - it supports the interface `ITemplateRoot`.
- as an explicit marking of the node with an attribute.

The attribute mentioned is:

```html
<div data-template-root="true"></div>
```

One rarely needs to care about `ITemplateRoot` - it is already implemented by the parent classes usually inherited when one creates a class for a typical view designed as something to be held by a window for instance.

As for `data-template-root` it comes handy when some part of the HTML template of a view, component/control has to carry a passive part used as HTML template in turn by some of the contained components. There are many ways to use templates dynamically, but including a template inline is often the "less hassle" method and then isolating it from the rest of the template that contains it is necessary. This has nothing to do with the data contexts, but has to be mentioned here for completeness.

As a conclusion `data contexts`, no matter if they are empty or not, are assumed on elements marked explicitly with `data-context-border` attribute and at template borders (at the roots of a view) which root is usually a trait of the class attached to that element.

This last bit is fulfilled by any class that as a minimum inherits from `Base` and implements at least `ITemplateRoot` interface.

```javascript
function MyClass() {
    Base.apply(this,arguments);
}
MyClass.Inherit(Base,"MyClass");
MyClass.Implement(ITemplateRoot);
...
```

There are much better starting points from which to start a new class designed to act as a root of a view, but this is the bare minimum. A data context will be assumed to exist on the element where this class is attached when any data context related operation is performed on it or on any element or component in its descendants. Seen from the other side - any data context operation performed in the DOM outside this node will not continue over the element itself and inside it.

As it was mentioned above these considerations are rarely seen the way they are described here in the everyday work, because through these isolation features are constructed the infrastructural elements of the BindKraft system a programmer interacts with. However, knowledge how this isolation works is never a bad thing and can come handy from time to time.

## Managing and accessing the data-context

How we interact with the data context? There is no need of actual separation of the mechanisms, but for the sake of this article let us group them this way:

- Data bindings
- Handling DOM events
- Using methods of `Base` class
- Others

TODO: Continue...
