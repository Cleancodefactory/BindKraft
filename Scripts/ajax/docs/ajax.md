# Ajax subsystem

The Ajax subsystem can be used in two ways - private (a complete ajax subsystem used by certain app or apps only) and global - subsystem available for the whole workspace.

> The global usage is the primary way it is expected to be used.

## Goals

 - The requests are sent in an uniform manner using methods attached to the classes by implementers. 
 - All the requests go into the send queue and wait to be picked for further processing.
 - The requests are processed by a number of configured carriers.
 - Each carrier has pickers consisting of queue inspectors (which in turn usually depend on request inspectors). 
 - The carrier picks the requests that match its criteria and passes them to packers that prepare the requests for sending.
 - then the requests are given to the senders which do the rest. 

 ## Interfaces, classes and their roles

 

 `**AjaxPipeline**` - holds the entire construction together. Normally the code that uses ajax communicates only with it and most often indirectly - through an implementer and manipulation object (see later).

  > `IAjaxRequest` - represents a non-packed (non-prepared for sending) request. This is the object that travels the pipeline.
 
  > `IAjaxSendQueue` - A pool rather, receives the requests from the code. Typically the requests are created and configured by an implementer (IAjaxConnectedImpl is the main one)

  > `IAjaxCarrier` - the main element of the pipeline. Combines picking requests from send queue using pickers, packing them the same way and sending them the same way.

  >>`IAjaxSendQueueInspector` - The task of these objects (pickers) is to pick requests from the send queue based on certain rules - some general, most of them specific to the individual picker. Although they can be implemented in various ways, typically they use one or more `IAjaxRequestInspector` to probe the send queue. The queue probing is done in two steps - `check` and `grab`. The reason for that is to make possible to determine which and how many requests to pick depending on multiple factors

  >>> `IAjaxRequestInspector` - The basic request inspection component. The inspectors can be configurable, test standard request characteristics and custom ones (`IAjaxAttachedInfo` plays important role here)

  >>>> `IAjaxAttachedInfo` - This interface implements features that enable pieces of data to be attached to an object under two kinds of tags - `type` (interface or class) or specific `instance`. While these features (especially the first one) are used in more places, they are most often needed by `request inspectors` to recognize especially marked requests and to cache inspection results and avoid performing calculations again.
    
  >> `IAjaxRequestPacker` - 
    ...  