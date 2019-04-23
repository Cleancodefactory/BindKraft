# TemplateConnector

This connector is **synchronous**. It will attempt fetching a static template from the templates register and if it is not found there from the DOM tree by id or class name.

TemplateConnnector class uses the same functionality the implementor ITemplateSourceImpl is using and most of the syntax and functionality will be the same (the exceptions are noted)

For implementing connector support in your components see [Supporting connectors](SupportingConnectors.md)

## Construction

```Javascript
    var connector = new TemplateConnector(template_names_list);
```

**template_names_list** - a string that can contain one or more template names separated with comma (if more than one is specified).

A template name is composed this way:

`modulename/templatename`

where the `modulename` is the name of the server side BindKraft module in which to look for the template.

and `templatename` is the name of the template. In most implementations (CoreKraft included) this is the name of the file in the directory templates of the module (without the file extension, which must be .html).

For example let see a code snippet that creates a SimpleViewWindow with an explicitly specified template:

```Javascript
    this.menuwindow = new SimpleViewWindow(
        new TemplateConnector("mymodule/simpleview-nocaption"),
        WindowStyleFlags.topmost | 
        WindowStyleFlags.adjustclient | 
        WindowStyleFlags.visible | 
        WindowStyleFlags.fillparent, 
        {
            url: this.moduleUrl("read","mainset","menuinit"),
            on_ViewLoaded: function (msg) {
                var view = msg.target.currentView;
                // Do something with the view loaded by the window
            },
            on_Destroy: this.thisCall(function (msg) {
                this.menuwindow = null;
            })
        });
```

TemplateConnector supports also a list of template names to be specified for fall-back behavior. If more than one is specified it will return the first one it finds. To do this we modify the relevant line from the example above like this:

```Javascript
    new TemplateConnector("mymodule/simpleview-nocaption,bindkraftstyles/window-simplewindow-headless"),
```

As a result if there is a template `simpleview-nocaption.html` in `mymodule` it will be fetched, otherwise the next one will be fetched - e.g. from the example above this will be the `window-simplewindow-headless.html` from the server side module `bindkraftstyles`.

### DOM fall-back

The underlying core functions and consequently the `TemplateConnector` support additional fall-back for each template name. For each template name in the list the connector will look for the template in the pre-loaded templates register and if it is not there they will try to find it in the HTML of the whole workspace page.

This is not recommended practice, but may be useful in some cases (mostly when running BindKraft with a very simple server side which is incapable of pre-loading the templates). If that is the case the template has to be enclosed in a _block html element_ (like `div` for example) with **id** or **class** set to `modulename_templatename` - i.e. the "/" replaced with underscore "_". Of course, these should be invisible (with display:none on the segment of the HTML that contains them.). For example if we do not have that html file in the `templates` directory of `mymodule`, we can put the template in the HTML of our workspace page like this:

```html
    <div style="display: none">
        ... something else ...
        <div id="mymodule_simpleview-nocaption">
            The template content goes here
        </div>
    </div>
```

What we had to put in the `simpleview-nocaption.html` in `mymodule/templates`, now goes in the html of the workspace. Obviously this mixes up together everything and is recommended only in scenarios where the server side is so weak (imagine a static content server only) that it cannot help us in any acceptable fashion.