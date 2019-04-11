# Chains

## Data holder types

### IDescribedData

```javascript
function IDescribedData() { }

IDescribedData.Interface("IDescribedData");
IDescribedData.DeclarationBlock({
    datadescriptionmodel: "rw string * name of the description model (method, vocabulary) used. ",
    contenttype: { type: "rw string * the content type or (internal/memory or null) if it is just data in memory", init: null },
    aspect: "rw any * An aspect describing what the data is."
});
```

The `aspect` property is of type [`DataAspect`](#dataaspect).

### IDescribedDataHolder

The `IDescribedDataHolder` interface inherits from the core `IDataHolder` interface, which specifies the essential methods for any data holder:

```javascript
IDataHolder.prototype.get_data = function () { return null; }
IDataHolder.prototype.set_data = function (v) { }
IDataHolder.prototype.OnDataContextChanged = function () { } 
```

The `OnDataContextChanged()` must be called on every `set_data()` without checks if the data is the same or not. The check is difficult and controversial anyways.

The interface `IDescribedDataHolder` also inherits from [`IDescribedData`](#idescribeddata), which means that it has additional data description information.

### DataAspect

An `DataAspect` object describes the format specifics of a data object. The aspect has a `name`, which serves as an identifier. A `DataAspect` is registered in a specific [**vocabulary**](#vocabularies). 

```javascript
DataAspect.prototype.$aspectvocabulary = null;
DataAspect.prototype.$aspectname = null;
DataAspect.prototype.$datatag = null;
DataAspect.prototype.get_aspectvocabulary = function () { return this.$aspectvocabulary; };
DataAspect.prototype.get_aspectname = function () { return this.$aspectname; };
DataAspect.prototype.get_datatag = function () { return this.$datatag; };
DataAspect.prototype.set_datatag = function (v) { this.$datatag = v; }.Description("Custom tag which usually hints at the purpose of the data piece. Especially if multiple items of data of the same aspect is used for different purposes.");
```

Possible constructions:
* `aspect`: Either a object of type data aspect, or a string;
* `optional2`: An optional string, which can be used to specify the data aspect name, upon data aspect construction;

#### Vocabularies
A vocabulary is a set of  [`DataAspect`](#dataaspect) objects. Each data aspect is uniquely identified, by its name. The vocabulary is usually associated with ...
Below is an example of a vocabulary- **bindkraft**, containing some data aspects, related to objects used in the bindkraft framework.

```javascript
DataAspect.Vocabularies = {
    ...,
    "bindkraft": {
        "object/kraftresponse": new DataAspect("xml/kraftresponse"),
        "object/viewholder/heading": new DataAspect("xml/kraftresponse"),
        "object/dataholder": new DataAspect("xml/kraftresponse"),
        "object/kraftresponse": new DataAspect("object/kraftresponse"),
        "keyvaluepairs/IAjaxQueryStringParams": ...
    },
    ...
};
```

## ProcessingChain related types

### IProcessingChain

The `IProcessingChain` derived classes represent processing chain definitions &mdash; *what wares  ([IProcessingChainWare](#iprocessingchainware)) does the chain contain, and how they are ordered*. The chain elements (wares), are stored in the `wares` **readonly** array. The processing chain classes also contain methods for appending and prepending to the `wares` array: `append(els)`, `prepend(els)`. The `context` property contains a reference to a [`IProcessingChainContext`](#iprocessingchaincontext) object, which is an essential part of the chain processing. 

```javascript
function IProcessingChain() { }
IProcessingChain.Interface("IProcessingChain");
IProcessingChain.DeclarationBlock({
    wares: "r array * Chain elements",
    append: function (els) {},
    prepend: function (els) {},
    context: "r any * The IProcessingChainContext based context",
    step: function (ar) {}
});
```
The `step()` method should be used by any processing chain executor to advance the chain processing from the current to the next chain ware.

### IProcessingChainContext
The interface must be implemented only by the class(es) used by the chain processing chains to drive its execution. The classes implementing this interface serve as storage for the chain elements ([`IProcessingChainWare`](#iprocessingchainware) instances) where they can, find, pick, put the pieces of their work and sometimes even processing scoped state.

The task specific data is split into two places:
- an array (get_data) of objects (preferably IDescribedDataHolder).
- a context object - an instance of a class packing the specific task (e.g. ajax request, requested async calculation etc.).

The chain elements may cut/copy pieces of data from the context object and put them into the data array to expose them to potential processors. Then others can pick already processed pieces and attach them back. This approach enables coexistence of specialized and multipurpose elements in a chain where the specialized ones can decide what to expose for processing by others, when to do so and also pick it when it is done.

The described data interfaces enable purpose/structure oriented marking of data which can be used as a key for processing operations reusability.

```javascript
function IProcessingChainContext() { }
IProcessingChainContext.Interface("IProcessingChainContext");
IProcessingChainContext.DeclarationBlock({
    complete: function () { },
    next: function () { },
    abort: function () { },
    chain: "r any * The IProcessingChain to which this chain context belongs.",
    status: "r numeric * Current status - see ProcessingChainContextStatusFlags",
    current: "r numeric * Index of the current chain element will point to the currently executing one",
    datas: "r array * The objects for processing. What happens with them depends fully on the elements in the chain - replace, change state etc.",
    context: "r any * The object that represents the specific kind of task - ajaxrequest, complex calculation etc."
});

```
The `IProcessingChainContext` objects also specify the status of chain execution. This is accessible through the `status` property, which is a enumeration value from the `ProcessingChainContextStatusEnum` enumeration.

```javascript
var ProcessingChainContextStatusEnum = {
    idle: 0,
    busy: 1,
    started: 2,
    complete: 3,
    failure: 4
};
```

### IProcessingChainWare

All classes implementing the `IProcessingChainWare` interface represent chain wares, which can be linked together to form a specific [processing chain (`IProcessingChain`)](#iprocessingchain). All `IProcessingChainWare` implementations must define a non-trivial `execute()` method, which will be called whenever an instance of the specific ware is reached, as part of a processing chain execution.

```javascript
function IProcessingChainWare() { }
IProcessingChainWare.Interface("IProcessingChainWare");
IProcessingChainWare.DeclarationBlock({
    execute: function (work, context, success, failure) {}
});
```