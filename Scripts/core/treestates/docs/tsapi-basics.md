# TSAPI - Basics

Tress States API in BindKraft is intended to provide **abstraction** with which apps using it can be treated as constructions capable to be in a finite number of parameterized states and the changes made by the user through the UI:

- create new variants of states by defining a state (or states) for new values of their parameters.

- create data associated with the existing or newly created states (typically persisted in a database or other storage)

## From abstraction to everyday usage

The functionality backed by TSAPI is most often similar to the popular `routing` concept which can be seen in both client and server side WEB oriented libraries. TSAPI in contrast with most of them, is not directly coupled with URL navigation and can be used for other purposes or applied in more abstract fashion to an application architecture.

This, more abstract, approach has an important advantage over the prevalent tightly coupled with the URL navigation solutions found in most WEB frameworks. It enables apps to be build as a tree of states and consider the app life cycle and its interaction with the user as transitions between states instead of building the app as innumerable and unorganized reactions to events. In state-driven app the reactions of the events are always transitions from one state to another.

To simplify the explanation we are going to illustrate tree state based apps by talking about navigation through states, but remember it is not necessary this to be in any way coupled with the URL navigation - it just makes it easier to understand.

