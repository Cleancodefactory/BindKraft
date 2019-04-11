# Base class

This class is the common ancestor for all the classes that can attach to the DOM. This includes all the classes marked in templates with the `data-class` attribute, the BindKraft windows (inheriting from BaseWindow) and others.

The `Base` class provides various functionality through its members. The most important areas covered are:
- Parsing bindings markup
- Bindings management (find, initiate, initate filtered subsets etc.), including asynchronous update targets processing.
- easy DOM event handling without bindings (preferred in some kinds of components)
- Quick search for nodes having attached active instances of Base with data-class attribute bypassing the DOM and based on characteristic of the framework classes.

The class also supports a number of methods typically needed by components.

## Search by data-class
### Members
