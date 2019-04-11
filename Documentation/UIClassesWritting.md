# Writing UI classes in BindKraft Javascript

Virtually all user interface (UI) related classes are derived in some way from the class **Base** (view/base/base.js). The class hierarchy beyond Base is quite deep, it contains both simple classes directly bound to a HTML element in a template (using data-class attribute) and classes that go much beyond that - e.g. **window** classes (BaseWindow and derived) inherit Base as well, but they add so much other functionality that they are rarely perceived as Base-derived in everyday work and conversations.

The above means that any talk about UI needs to concentrate on certain area of usage in order to avoid mudding the topic with considerations from other inheritance branches of **Base**.

Here we will talk only about simple classes intended to be used in templates with the _data-class_ attribute

.........

## Life-cycle of data-class

Some details will be mentioned only briefly and explained later. Please refer to the next sections if you need to.

The Base derived classes specified in data-class attributes enrich the DOM with functionality, hook to events, fire custom ones and through a number of other methods form a piece of the UI that serves the application in various ways - reusable pieces of UI (like controls), views contained in windows (or other containers), dialogs, semi-reusable or locally repeated UI segments and so on.

These classes are not created directly, but during materialization of a template into a view/piece of a view. This happens on a lower level as a result of calling of one of 3 view core methods:

```Javascript
ViewBase.materializeIn (htmlEl_in, template)
ViewBase.materialize (htmlEl_in, template, how)
ViewBase.cloneTemplate(container, contentTemplate, data, bGroupElements)
```

They all perform the same materialization process, but provide convenience for different scenarios. We will cover them in separate article, because their usage is the heart of building new universally reusable UI components and controls. The everyday programming with BindKraft will not put you in touch with them directly, but only through usage of certain framework provided classes like Repeater, TemplateSwitcher, SelectableRepeater and many others. Your needs of HTML template materialization is typically fullfiled by using these and other classes in data-class attributes in your templates.

### The process step by step

The materialization of a template starts from the root (or roots) and recursively rolls through all the DOM elements until it reaches the leaf elements. So the process can be described fully by describing what happens with any given DOM node.

1. Create
    When there is a data-class specified an instance of that class is created and attached to the DOM node internally (in the avtiveClass property of the node)
        It is important to call your parent's constructor, because important parts of this process are done in the **Base**'s constructor.
2.  Paremeterization
    The parameters speified after the class name in data-class and the parameters specified in the data-parameters are parsed and prepared to be set to the newly created instance. It does not matter where they are specified - in the data-class after the class name or in the data-parameters, the system combines the both lists and uses them as a single one.
3.  

## Initialization

Classes intended to work in specific environments usually have dedicated methods for initialization. Depending on the lifecycle of the environment these methods can be one and more, sometimes combined with other responsibilities. In BindKraft the initialization methods are extracted as separate ones and not mixed with others. Because of the phases of the initialization process there are 3 or if you count the constructor - 4. One does not need to implement them all, but only the one(s) that best fit the functionality of the class being developed.

init - function() { } - no objects (data-class)
postinit - have objects, don't have bindings
finalinit - everything is live

TODO: ...

### Template binding

Let us remind everybody - __template__ is just a passive markup, most often HTML in textual. It is materialized at some point and becomes a __view__ from the point of view of the code that initiated the materialization.

BindKRaftJS has interfaces that enable Base derived classes to implement some of them and achieve certain features - e.g. ability to set their template from outside (programmatically or through binding), serve as sources that feed templates to other instances (usually of the same class) in other places of the same view and so on.

Controls and other reusable components often need templates and in most cases they work with their default ones, but some of them can accept custom templates easily enough to make writing such templates feasible in certain scenarios.

We will continue the topic about templates later, but no matter how a template is set there is the big question - __how the template binds to the code__ so that it can control it. What this means is that the component has to know about certain elements of the template so that it can control them, listen for events and so on. A template may require also certain requirements to be met - e.g. to contain elements that are required by the logic of the components and all these need to be known to the component.

In all those cases we have two distinct scenarios - dynamic template changes (can happen at any time during the life cycle) and initial templates (used immediately after the component instantiation)

#### Initial templates

There are several approaches to this problem:
- The traditional method is to document data-key names for the important elements and search for them in the code of the components, then save eferences to those elements in properties. These can be initialized at almost any point - __init__, __postinit__ and __finalinit__.
- The new and handier method involves reference inject bindings - __data-on-pluginto__ and __finalinit__ method.

Before continuing let us say this - both methods are applicable for dynamic template changes, but dynamic changes depend on the role of the component - not all components need to support this and being dynamic it means that the templates are actually reinitialized on each change and initialization will happen in the code that processes the change (mostoften coincides with work data changes). Typical controls rarely need dynamic changes, but components that use templates to generate data driven content (like repeaters) usually support it. By their nature this kind of components keep the materialized item(s) separate from the code of the component itself. The reason for that is rather obvious - dynamic template changes are needed mostly for templates with minimal special requirements. The templates have to encompass the data passed to them, but they rarely need to supply to the components knowledge for certain elements in them - the very need to change templates dynamically comes from cases where this is usually true.

So, while this is not mandated by some law, we can safely say that most components fall into one of the two categories - components loading templates only initially and components that are capable to change them dynamically and do this together with the work data changes (and have none or minimal requirements to the template structure). Cases other than these are actually rare - when such needs happen it is usually more natural and useful for many more reasons to implement it in two different nested components - one holds the other through another template (think of a control with static template that is using a repeater with dynamically supplied template to show some list as part of the control's UI).

BINDING A TEMPLATE USING __data-on-pluginto__

For an example with which to demonstrate this lets take a simple component that appends some text from a text box to an element when you press enter in the text box. We will intentionally do the last bit without bindings (which is the right way) in order to show how references can be injected from the template into the component.

```Javascript
function MyComponent() { Base.apply(this,arguments);}
MyComponent.Inherit(Base,"MyComponent");
MyComponent.Implement(IUIControl);
MyComponent.prototype.mytemplate = '<input type="text" data-bind-val="{bind source=__control path=$newtext}" data-on-keyup="{bind source=__control path=DoAppend}"/><div data-on-pluginto="{bind source=__control path=$logarea}></div>"';
// Properties that will hold the elements from the template.
MyComponent.ImplementProperty("text", new InitializeTextParameter("The text from the text box will go here and we will append it to the div below",null));
MyComponent.ImplementProperty("logarea", new Initialize("A ref to the div where we will append text will be injected here from the template",null))
MyComponent.prototype.init = function() {
    // Do it cheaply - inject the template text early, so that will got processed automatically (init is called before the children elements are materialized). We will make it harder a bit later.
    this.root.innerHTML = this.mytemplate;
}
MyComponent.prototype.DoAppend = function(e) {
    if (e.which == 13) {
        // make sure we have the most recent data from the text box
        this.updateSources();
        // Check if the area has been injected
        if (this.get_logarea()) {
            if (this.get_text() != null && this.get_text().length > 0)
                this.get_logarea().textContent += get_text();
            } else {
                alert ("nothing to append");
            }
        } else {
            // Complain for the lack of logging place
            alert("The template does not inject into logarea propery a DOM element where to put the log");
        }
    }
}
```

Again - the above example can be implemented in much easier manner with more bindings, but we need to show how templates are used in a very simple scenario!

The important piece here is that we just piggybacked the materialization processing by injecting the template before the process reaches the children of the elemnent on which the component is attached.

The down sides are - the template is in plain text, cannot be changed at run time and we cannot even copy it from another component (well, assume there is one that has the template we need) and we can think of a number of other features we lack.

Lets try to solve these problems step by step. Our first step will be to get the template from outside. This can happen if our component is instantiated like this in the template of the view of its host:

```HTML
... some other html ...
<div data-class="SomeOtherComponent" data-key="othercomponent">
... some other html ...
<div data-class="MyComponent @template={read source=__view/othercomponent path=$template}"></div>
```

What we need to change in order this to work is to add a get_template property. The @ parameterization syntax works in a way that gives us a nice feature for free - the implementation we write is its default functionality - it works when it is NOT specified in the markup like above (see the @template= .... part). When the parameter is provided instead of our code the property will return the source of the binding specified in the parameters:

```Javascript
MyComponent.prototype.get_template = function() {
    // Our default code:
    return this.mytemplate;
}
```

It looks simple, but what about that example SomeOtherComponent? Yes there is a catch - that component must implement the ITemplateSource interface which among other things defines the get_template property. So, the source for our template has to be implemented as such - a source for templates, otherwise this wont work.