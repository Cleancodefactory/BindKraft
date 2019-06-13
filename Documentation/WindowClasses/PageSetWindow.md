# PageSetWindow


## Members reference

**constructor**

### PageSetWindow()

>The usual window constructor (see [BaseWindow](BaseWindow.md)).

    Typically page set windows and most of their subclasses (like TabSetWindow for instance) are shown maximized in some containing window - e.g. the main app window, in a splitter and so on. The example construction below is a very typical way to create a page set or a tab set without bothering with too much parameters.

```Javascript
    /* A code that will most likely be in the app's 
        AppBaseEx.prototype.initialize. op is an Operation created early in the method's body like this:
        var op = new Operation();
        Of course, the more complex the structure and its initilization becomes,
        the management of the operation and possibly multiple operations will become more complex.
    */
    this.tabs = new TabSetWindow(WindowStyleFlags.fillparent | WindowStyleFlags.adjustclient | WindowStyleFlags.visible | WindowStyleFlags.parentnotify,
            {
                on_Create: function(msg) {
                    op.CompleteOperation(true,null);
                }
            }
        );
```

**Methods**

### PageSetWindow.prototype.updateTabs()

    Refreshes the system area of the window. Usually the PageSetWindow is used with a very simple template with no need of updates, but window classes that inherit from PageSetWindow do use templates displaying for example tabs, tabs and menus and so on.


### PageSetWindow.prototype.addPage(page, options)

>page - the window to add as a page(tab). If the window is currently a child of another window you should remove it from there and then add it to the PageSetWindow (or the windows that inherit from it - like TabSetWindow).

>options - Boolean or a plain object. When it is a boolean `true` will make the new page (tab) active, `false` will not activate it until it is done through UI or programmatically later.

TODO: Describe the object case

### PageSetWindow.prototype.removePage(page)

>page - the window to remove.

This can be also achieved with `BaseWindow.prototype.removeChild`, or by setting to `null` the `page.set_windowparent(null)`. However, it is recommended to use the `removePage` method whenever it is known that you work with a PageSetWindow.

### PageSetWindow.prototype.removeAllPages()

### PageSetWindow.prototype.selectPage(page)

    Activates the page


**Properties**

### PageSetWindow.prototype.get_selectedpage()

    Returns the selected page (A BaseWindow derived object)

### PageSetWindow.prototype.set_currentindex(v)

>v - integer. The index of the page to activate.

### PageSetWindow.prototype.get_pages()

    Returns an Array of all the non-disaled pages

