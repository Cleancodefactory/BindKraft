# Bindings

>For binding syntax reference - [see here](BindingSyntax.md)

The bindings are one of the core BindKraft features - a feature that actually gives the name of the platform.

The bindings are used in all BindKraft templates no matter what role the template plays. To give context to this document one can first read about [Templates](Templates.md) and [Views](View.md). In short a template is a piece of HTML containing some special attributes on some of its elements. These attributes are defined by BindKraft and we can roughly separate them into the following categories:

- [**Class specifiers**](BindingSyntax/DataClass.md) - define class from which to create an instance and glue to a given HTML element. Also define parameters for the instance. These are `data-class` and `data-parameters` attributes

- **Bindings** - Define binding objects which will be created by BindKraft and will connect two points/properties of different elements in and "behind" the template. The bindings are two kinds - data bindings and event handling bindings. They are the topic of this document.

- [**Markers**](BindingSyntax/Markers.md) - Various attributes marking elements in a number of ways. They include `data-key` attribute which acts as some kind of local element id, `data-context-border` - explicitly separates the data context under and up the element, `data-async` - contains instructions for asynchronous rendering - needed in big and heavy templates/segments of templates which cannot be separated into something more manageable for some reason (client insistence for example) - enables non-blocking rendering of huge templates which will freeze the browser otherwise.

This HTML piece is processed by BindKraft when it needs to be brought to life and creates a network consisting of DOM objects, your objects (containing your code) and BindKraft built-in objects. The bindings connect them in many ways and transfer data back and forth, route events to their handlers and so on. This network then reacts to everything that happens to it - data changes, UI events and so on and that is the view-level mechanics of BindKraft.

## Data bindings

The general syntax of a data binding looks like:

```html
    <div ... data-bind-targetop="{bind source=something path=somepath}"> ...</div>
```
or like this:
```html
    <div ... data-bind-targetop[index]="{bind source=something path=somepath}"> ...</div>
```

The right part, the value of the attribute contains a number of settings and forms the `source expression` which is more correctly called `binding expression`, because only part of it is responsible for determining the source of the binding, while the rest are settings concerning the binding functionality in general.

The left part is the part of the attribute name after the `data-bind-` part is sometimes called `target expression`, but is more correctly called `target operation`.

The detailed reference of the right part is in the [Binding expression syntax](BindingSyntax.md) article. That part supports about 20 different kinds of settings which determine where is the source, what [formatters, converters and transformers](Formatters.md) are involved, binding behavior options and so on.

The left part, the `target operation` is much simpler and determines how to link the binding to its target. The `target` is either the HTML element on which the attribute is specified or the instance of a BindKraft class attached to it (with [data-class](BindingSyntax/DataClass.md) attribute).

How they are used is explained in the chapters about [Templates](Templates.md) and [Views](View.md). To provide an idea to the hasty reader, let's give a simple examples:

Once materialized (brought to life) template is usually referred as view (non-official term). Such a view may be a form that shows in a window or piece in another view/template. Most templates that do something usually start with an element that has a `data-class` attribute, thus when materialized they have an initialized and ready to function instance of a BK class. As an old tradition from old technologies some programmers call it "code behind", but this is probably not precise enough with all the nested such pieces we can have.

In such a class an important business logic can be implemented - one that turns the life template into a form or a component, or universally usable control and so on. Considerable part of this is achieved by this code by controlling the bindings in the template - all of them specified on it or (mostly) on its children and their children (and so on).

Having the bindings in place means the code in this object (remember we talk about the root) can get rid of code that reads fields, properties from one place and saves them to another - the bindings will do this wholesale.

For example:
```Javascript
    this.updateTargets();
```
will update the targets from their sources for all the data bindings on elements under the root element on which our class is attached.

Another example:
```Javascript
    this.updateTargets("flag1|flag3");
```
will update the targets for all the binding under the root which are marked with flag1 or flag3 or both (eg. `data-bind-val="{bind path=something flags=flag3}`). In a complex template updating binding in groups one defines according to the possible changes this can improve the performance drastically.

Another example:
```Javascript
    var binding = this.findBindingByName("binding1");
    binding.updateTarget();
```
This will find a specific binding marked with a name and will trigger only that binding.

Another example:
```html
 <input type="text" data-bind-val="{bind source=myroot path=$myproperty writedata=input}" />
```
This will instruct the binding to listen for the input event on its target and immediately update its source if the event occurs.

If you are new to BindKraft you may have noticed that this means the bindings are mostly triggered explicitly and they can be automatic only if appropriate settings are specified in them. Yes, this is true, but it looks as a limitation only at first glance, having direct control and wholesale or filtered, or individual access to them enables all kinds of tricks which can limit the code needed to couple of lines when simplicity is the goal, or fine tune the updates with more code when the main goal is no performance lost fo unneeded updates. This is a somewhat unusual approach to data binding if compared not only to Javascript data binding oriented frameworks, but also to non-WEB solutions following the data binding road. It is one of the core ideas in BindKraft - make it easy instead of fully automated. The effect is that the programmer can automate the process any way they want and never fall in the sad situation of automation that misses something you need.

### Target operation

It is probably obvious even from the examples that the `target operation` has much simpler and limited syntax compared to the binding expression. The decision to use valid HTML attributes determined a lot about the syntax we can use, which made the value of the attribute the right place for the bulk of the settings, leaving to the target operation only the minimum that is best kept separated for better readability.

The target operation can take the following forms:

data-bind-`targetop`=...

data-bind-`$propertyname`=

data-bind-`targetop[index]`=

data-bind-`$propertyname[index]`=

The forms with square brackets [ ] in them are indexed forms and the index is usually rather a key - textual key.

The forms that start with $ are references to pseudo/active properties on the attached BindKraft object. They can be non-indexed or indexed as can be seen from the example above.

#### data-bind-`targetop`=...

This form refers to one of the built-in BindKraft target operations. They all act on the DOM element to which the attribute belong. The list of the supported operations and details about them is in [Supported target operations](BindingSyntax/targetops.md).

For a quick idea what they do, here are a few examples:

```html
<span data-bind-text="{read path=caption}"></span>
```
This one sets the text in the span element from the field "caption" in the local data context.

```html
<input type="text" data-bind-val="{bind path=caption}"/>
```
This one sets/gets the value of a text field input element.


## Event handling bindings


