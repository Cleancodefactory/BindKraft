# BindKraft Javascript (BindKraftJS)

This is the start page of the BindKraftJS documentation. See the sections below for links to overviews, tutorials and references.

**Contents at a glance**

- General overviews - general articles about concepts and architecture.
- Tutorials - tutorial articles.
- References - links to class references and articles describing specific features, separated into sections: `core`, `view`, `windowing`, `system` and `other`.
- Integration - articles about integration of BindKraftJS with the server side software.

## General overviews

[BindKraft](BindKraft.md) - general overview of the concept, architecture and philosophy of the platform.

[Templates](Templates.md) and [views](View.md)

>[Class specifiers](BindingSyntax/DataClass.md) (data-class)

>[Bindings](Bindings.md) - Data and event bindings.

>[Markers](BindingSyntax/Markers.md) (data-class)

Additional overviews of specific features are listed in the "References" section further in this document.

## Tutorials

Not yet included in this documentation.

## References and thematic articles

### OOP in BindKraft (overview articles)

* [OOP in BindKraftJS](OOP.md) 
* [OOP Conventions and terms](OOPConventions.md) 
* [OOP - declaring interfaces](OOPInterfaces.md)
* [OOP Helpers](OOPHelpers.md) 
* [Runtime documentation and annotation](RuntimeSelfDoc.md)


### [Core OOP classes and interfaces reference](CoreClasses.md) - The core classes forming the platform on non-visual conceptual level. Building blocks used widely.

* [Operations](Operations.md), frequently used classes: [Operation](CoreClasses/Operation.md), [ChunkedOperation](CoreClasses/ChunkedOperation.md) 
* [Memory FS](MemoryFS.md) 
* [Writing interface implementers](WritingInterfaceImplementers.md) 
* [Connectors](Connectors.md) 
* [BKUrl](BKUrl.md) 
* [Initializers](Initializers.md)

#### Miscellaneous core features: 

* [Translators](Translators.md) 
* [Mergers](Mergers.md) 
* [Value checkers](ValueCheckers.md)
* [Defaults](UsingDefaults.md)

### [View level classes and interfaces reference](ViewClasses.md) - The classes that build the UI basics - data binding, validation etc.

* [Templates](Templates.md) 
* [Writing UI classes (components)](UIClassesWritting.md)
* [data-class](DataClass.md) - data-class={...}
* [Binding syntax](BindingSyntax.md) - data-bind-something={...} and data-on-event={...}
    * [Bindings](Bindings.md) - overview and usage discussion
    * [Target expressions](Bindings.md#target-operation)
* [Markers](BindingSyntax/Markers.md) - data-context-border="true", data-template-root="true" etc.
* [Using formatters](UsingFormatters.md)
* [Formatters - creating](Formatters.md)

### [Windowing classes and interfaces reference](WindowingClasses.md) - The classes forming the windowing subsystem.

* [Window behaviors](Windowing/WindowBehaviors.md)
* [Window message handling](Windowing/WindowMessagesHandling.md)

### [System classes and interfaces reference](SystemClasses.md) - The system, app, daemon and API forming elements of the OOP.

* [SysShell overview](SysShell.md)
* [Local API](LocalAPIs.md)
* [List of system Local API](LocalAPIList.md)
* [System settings](SystemClasses/SystemSettings.md) |
* [BKInit - instance configuration](BkInit.md)
* [System CL commands](SystemClasses/globalcommands.md)
### [Data types/formats](DataTypes/DataTypes.md) - the structures for various purposes. Non-strict Javscript data consisting of objects, arrays and values arranged according to the conventions described in the section.

### [Others](OtherClasses.md) - Specific classes and interfaces that do not fit into other categories.

* [Settings, Persistence, State and shared data pieces](Settings_Persistence_State_and_shared_data_pieces.md)

* [Preliminary](Preliminary.md) - Partial documentation of classes that are under construction. These will move elsewhere once they become ready. This section is mostly for people involved in the BindKraft core development.

## Integration

[Platform utility](PlatformUtility.md) - A module where implementations of a tiny set of integration routines is placed. This module provides the glue needed to put BindKraftJS on top of the specific server side software and technology. Optional set of additional integration conveniences is also placed there. The module has to exist in any BindKraft setup.

## Advanced topics

These articles require intimate knowledge of BindKraftJS architecture.

[Local (Managed) proxy building](Advanced/ManagedProxies.md)
