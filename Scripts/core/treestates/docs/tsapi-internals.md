# TSAPI in Depth


## Overview

_This begins an in-depth description of the Tree States API. Read this and the following sections if you are going to write extensions for the API or low level functionality depending on it._

This API is typically the base of a `routing` | `history` | `state driven` application building approach. It enables the following:

* Define all the possible states of the application as a tree of nodes with their belonging parameters (called in this documentation `TSE` - standing for Tree State Element).

* View the app state as the chain of nodes leading from the root to the "current" node.

* Convert this state back and forth from array of objects with named parameters (called `tree state` or "state object set" sometimes) to array of arrays each representing the specific parameter's values (state) of a node from the chain (`linear state`).

* Define conditions for each parameter in each node so that the parameter can be recognized from its position and value (see `TSEU`).

> Based on TSApi applications can save their state in a `tree state` - an array containing an object with all the parameters for each node from the root to the node that represents the current state of the app.

> Having that `tree state`, it can be converted to `linear state` where each node's state is represented as array of the values of its parameters, ordered as defined in the definition of application's state tree (`App TSM` - tree state map).

> The `linear state` can be then serialized/deserialized to/from URL path or another similar in characteristics format.

> The application can obtain a `tree state` from somewhere, e.g. from navigation URL, history state or otherwise and react to it by putting itself in the corresponding state by using the node parameters in the chain of nodes. Each node is an object with named parameters which makes it more descriptive and easier to use. All the difficulties the app has to deal with are related to controlling its UI, obtaining all the information that is related to the parameters, filling the UI with it and preparing itself to enable the user to change values through the supported user actions in the top node of that chain.

## Routed / tree state driven app construction

In the section above one can see the TSApi's functionality as means to manage those parameters that unique define certain application states. In order to be state driven, the app has to implement architecture that can be easily put from one state into another, no matter if that other state is close or far from the previous.

> The implications of the above statement are enormous. To illustrate its meaning let's assume that we have two states where the window 1 in which user works is the first state and the other is another window 2 opened over/inside the last one. In typical non-state driven app this will likely involve a button that opens the second window 2 and something similar that closes it when the user finishes her activities there.

> While this can remain so in a state driven application it will be impractical, because such app will have to implement a duplicate mechanism for those changes based on reaction to a received/obtained `tree state` - a chain of objects where last of them will correspond to the state where the first window is opened and another to the second. In other words the app must be able to open the window 1 and window 2 by applying the tree state. Both windows can be still the second over / inside the first, which will also correspond to the fact that the state node for the second is defined only as a child of the state node for the first, but the way the opening and closing happens is not necessarily a response to a direct user action.

> Thus state driven applications usually avoid duplication by using the state as means to apply changes to their structure instead of doing it directly by opening, closing or otherwise changing something in response to explicit user action - in state driven applications it is more practical those user actions to change the `tree state` instead of opening and closing windows directly. The latter will increase the complexity of the app also by the need to `guess` the tree state of the application from micro changes caused by the user. This is error prone, as it was already said - involves duplication of functionality and loses one of the main benefits of having a stat driven app - the ability to identify each application "form" as a specific `tree state` and base your development on that.

Put that way the `tree state` driven apps in BindKraft should not be viewed as apps using routing, but as application defined by its `tree state map` consisting of pieces implementing each node in the tree in very loosely connected fashion. I.e. each state node's implementation should be as independent of the existence of the other nodes as possible and in the ideal case it will depend only on the states from the `tree state` of its parent nodes in the state chain.

This goes beyond the usual reasons for having a routing in server or client apps - nice URLs and possibly SEO friendliness. It also dictates architectural patterns which, if followed, can simplify and shorten the development process significantly.

### Not everything can be state driven.

It is not a contradiction to say so. It is not only too difficult, but also completely impractical to define all the details in an app as nodes in its `tree state map`. The correct way to understand everything said above is to realize that the states preserved in the state nodes are the minimal set of parameters that let you restore the app's state from them. E.g. show the same UI, fill it with the data for the item(s) identified by the state. This does not mean that all the date about the item is in the state - on the contrary only the identifying data should go there. For instance in typical apps using a DB this will be an Id or another identifying field/fields and all the rest will be loaded while restoring (applying the state). We can call all this data - **bound** to that specific state (identified by the specific parameter values).

While in a specific state the app should provide the user with the means to change the bound data and in some cases this may also include means to change the state values in such a way as to remove the specific state from the persistent storage (the DB for example), to move it in other part of the state tree and so on. The UI developed along these lines is well-defined and has to be able to take care for everything that can be changed in the bound data or removing the specific state, moving it or creating a new specific state - as appropriate for the specific project of course (not all of these actions will have to be available everywhere). I.e. random navigation must not exist, everything happens in the UI opened for this specific state and any navigation to elsewhere is an act of exiting the state node and its corresponding UI after applying or abandoning the changes to the item (bound data and identification data).

### Excluding from the state the detailed functionality you do not want to track

Imagine a place in your app where the edited item has a lot of bound data and it just can't be exposed to the used in single UI view/form or even worse - can't be represented in a set of forms (possibly shown in a tab-set for example), but instead needs some drill down forms/dialogs which may be even a whole hierarchy of UI elements opening one from the other. How to exclude this from the state tree and still continue developing a state driven app?

The obvious answer is to treat all the data involved as bound data and consequently all the UI that deals with it as part of the state node from which it opens directly or indirectly. Of course this means that no matter how deep the drill down UI goes it all should be easy to close programmatically if the state changes and the app has to mutate to another state.

