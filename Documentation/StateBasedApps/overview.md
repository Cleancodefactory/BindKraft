# Treestates overview - State based apps

The `treestates` feature is not necessarily fully dedicated to the building of the so called state based apps, but this is the main reason for its existence.

So, before describing what the `treestates` do, we have to describe what is a state based app (alternatively called state driven app).

## A state based app (SBA)

SBA is a way to construct an app in such a way, that it can move between states that can be easily persisted in a chain of values that are unique and can be used at any time to restore the application state from the chain.

**Popular techniques used in other environments**

In the real world the best known examples for state based apps are the WEB apps using a "router"/"routing" feature. In many WEB development frameworks such apps are "routed" which means the path from the URL is treated as a route to a "place" in the app. This works by pointing the specific routes to specific components/controllers/etc.. of the app and treating some parts of the route as parameters.

So for example a path like `/part1/part2/param1/param2` can be directed to a component/controller (whatever the name and the function is in the particular framework) based on /part1/part2 section of the path, while the other parts are treated as parameters.

**BindKraft's approach**

While routing is easy to deal with and familiar to many it can be seen as a specific case part of a more general abstraction - a state tree. 

TODO: More about this

## Treestates composition and processing

We will ignore all serialization/deserialization concerns in this section.

Let us assume that an app has state represented as a chain of objects:

`[ object1, object2, object3, ...]`

Of course, in Javascript they are just an array. Each object represents certain `node` - an abstraction defined by the app. For instance, the first node may be entering document mode, then the second will describe the opened document, the third will, for example, describe a location in the document and so on. 

So, each object will keep the minimal data needed by the application to describe that state, then the next state in relation to the other. In practice the app does not need to consider chain of states - it can just treat all its states as separate and unrelated (at least from development point of view.). To illustrate this over the example scenario we started to imagine above, we can say that a state that points to a location in a document requires a document and entering document mode. Getting together all the parameters needed for each of those together we can represent the necessary data in a single object and not in a chain. The object will be fatter, but why not? 

Well, the typical routing approach does exactly that - points to the code that has to do the entire job by using the available parameters. The improvement over that the tree state gives us is the recognition of the fact that all apps have internal hierarchy. Using the illustrative fantasy above - opening a document, requires document mode, but this document mode may have more than one sub-modes - for the sake of the example - text and table documents on one hand, on other we may want to open the app in a state in which it is ready to open documents, but none is opened yet. Each level (state node) has possible branching under it and the states naturally pile one over the other in certain order - one that follows the functionality. "Routing" along a tree of states (i.e. they are related) looks more natural and easy to implement by reusing simpler pieces of code. Deeper states can be achieved by reaching them through the tree, implementing simpler logic for each step and letting the state tree to lead us to the next. In contrast the usual routing solutions expect this to happen implicitly, because they do not even recognize the existence of relations. The fact that the generated from such states URL, for example, look hierarchical is an effect and not substance.

The objects in the chain can look something like that:

`[
    { prop1: 12},
    { prop2: "text", prop3: 4 },
    { prop4: 100}
]`

and if we have the description that defines all those names and value types, we can represent this as "linear" - only the values linearized:

`[ [12], [text, 4], [100] ]`

and even just as a sequence of values:

`[ 12, text, 4, 100 ]`

This minification obviously gives us more options to serialize this in a very compact form - for use in the path part of an URL for instance (like most routing solutions in use today).