# Connectors

Connectors are classes inheriting from `Connector`. They provide a "connection" abstraction which is most often perceived as _fetching data_ abstraction (the reason why will get clear further in the document).

A connector is composed of a few parts common for all the connectors no matter what they do:

>**address** - a string representing the location of the data

>**host** - also called bind host. An instance of a class that gives a starting point for the address or/and defines the context needed for the connection

>**options** - Several possible options, not specific to a given connector type, but not necessarily supported by all connectors.

>**parameters** - An indexed property gives access to a single dictionary of parameters. It may or may not be used by each connector type. Parameters are useful, _but they usually limit the connector's abstraction - e.g. the option to use a different connector with the same component_.

The above list basically begins to describe the purpose of the connectors - to represent the way to fetch (and store when supported) some data/resource with a few standard components: 

    - the type of the connector (a string or class)

    - the address of the connector (a string)

    - the host (can be null for some connectors)

Over that some additional adjustments can be made, but they will limit the variety of connectors one can interchangeably use:

    - parameters - for example they can be filter parameters for DB query or in-memory data filter etc.

    - options - instruct the connector how to perform its operation. They are designed to be as independent of the implementation as possible, but this has limits too, so options will most often presume requirements not all connectors can meet.

## Operation procedure with connectors

The minimal needed knowledge about a connector is basically two strings (the type of the connector and the address) - these can be changed together. 

The host is determined by design by the client of the connectors. The host may or may not be able to provide the context needed by the connector being specified (through its type name for instance), but this is one of the vectors for improving a component that acts as a host - implement more features that different connectors need. This will enable the component to support more connectors and consequently more kinds of sources for the data it needs.

So, for a code that is using connectors the steps are:

**First step** - Obtain the connector from somewhere or alternatively create it and set the address and the host.

TODO: continue the document.
