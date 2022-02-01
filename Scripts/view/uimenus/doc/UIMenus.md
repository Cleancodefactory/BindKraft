# UIMenus


## UIMenuItem

The item's environment consists of:

* The `item` itself - mostly data carrying object.
* `processor` - The code processing the item's "events"
* `ui component` - a component that represents the item visually. It also generates the item's events.
* `slot` - houses one or more `ui components` for the items put in it.


### **The `item`**

has:

`owner` - the view, app part or something else that owns the item. The `owner` usually defines the `item` and has the best idea what it does.

`processor` - is connected with the `ui component` representing the `item`. The connection interface is determined by the processor.

`slot` - has to create the `ui component` and host it, but must first choose the class of the `ui component`. This happens in geOpinion method by asking in this order: the processor, the owner, the item and can assume a fallback used when they have no opinion.

The purpose of the `ui component` selection process is determine its class by:

- what the processor can handle (first priority)
- what the item can suggest as default.
- check if the selection made this way is actually possible (i.e. check if the processor can handle the selected `ui component`)

In end the processor is preserved in the item.$processor property and if the actual processor is using a proxy/wrapper it can access it from there. E.g.

    item.get_processor().set_text('hello')


### **Why "events"**?

Instead of numerous events and backing data the `item`'s UI representation - the `ui component` is almost directly connected to the item's `processor` using an interface compatible with the interface specified by the processor (directly or indirectly).

The interface not only calls through that interface methods of the `processor` from the `ui component`, but also the `processor` can call the `ui component` through it - as much as designed. For example an edit box item provides set_text/get_text properties and the connection interface `IUIMenuEditProcessor` for such cases defines them.

This way there is no need to save a lot of data into the item to be used by the component - it is directly accessed for the `ui component` and/or the `processor` as defined by the particular connection interface.

Based on this model the connection interfaces define the possible abstract types of menu items - the interfaces define what can be done with each kind and what it can report.
