# Topical index

This document lists all the important topics about BindKraftJS with links to pages describing how and what can you do for/with each one of them.

## I. BndKraftJS - structure and principles
> Describe ths whole structure with block diagrams and basic principles (OOP, inheritance, implementers). Embedded syntactic examples only.
### Places to start
> High level tasks and classes with descriptions what can you do with them and references the more detailed descriptions from II and others where needed.
#### Create UI Component derived from Base
#### Create UI Control derived from Base
> Well. can we change the names of IUIControl to IUIComponent ot are we too late?
#### Create UI View
#### Create Window
#### Create App
#### Create Daemon
#### Create Validation rule
#### Create DOM Element behavior
#### Create Formatter(s) ??
> Decide if we want to ditch the systgem formatters and implement everything from CustomFormatterBase or alike
> Adhoc custom formatter will remain
#### Create boot process

## II. BindKraft's OOP for Javascript
### Inheritance
> How to inherit - and what hapens
### Declare support for  interfaces
### Define an interface and kinds of interfaces
#### Kinds of interfaces
> IRequestable kind
> x.Interface("my name", Inerface1, Inerfac2)
> How both work
> Equivalents in other techs (Jave/.NET like and COM like)
### Implementers - usage
### Create implementers
> Subtopics? for classInitialize and its parameters or single long story?
### Implementation Helpers
#### Initializers
> Quick links - declare event, declare calc property and others
#### Property implementers (Implement...Property) 
> Include explanation about Indexed properies and implementation conventions.
### Naming and other conventions
### Exceptions outside of the hierarchy
#### Array - Iterative methods, agregate methods, unique elements API
#### String
>> Remove unneeded and bad formatting functions and replace with better and thorough ones.
#### Date
### Registraions ??? (how to split these?)
### Obliteration and diagnostics
### SelfDocumentation and declarations
> We can increase the metainfo so that we can help intelli-tools

## III. Core classes
### Delegation and events
    Delegate, EventDispatcher, PropertyDelegate, etc.
> Will have to explain why these and not those (i.e. JS5,6,7 features)
### Async tasks (IAsyncResult - can we changed)
#### ControllableAsyncResult
### Operations and their parallels with Promises
### System and App commands
### Helper geometry classes
### Messenger and messages.
### ?? URL utilities
### Settings persistence (SettingsPersister, SettingsPersistenceProvider)
### Objectification
### Connectors ???? 
> Should we write only general basics here or everything etc. May be separate chapter for them?

## IV Views, components, controls, markup and so on.

### The concept of a view - bindings + HTML + components oversome DOM elements = view.
> No in-depth talk about bindigs and base classe - onl principles and the  minimum that makes it understandable.
>Mention: borders
#### Data context
> There was an example demonstrating nested data contexts
### Component - Deriving from Base
> Illustrate and show frequently used framework classes
#### Expander, Panel, (Toggler), (Fielfs implemented as/with expander - if we find any)
#### Repaater, TemplateSwitcher
> Add more basic components and even another 4-th level topic if necessary.

