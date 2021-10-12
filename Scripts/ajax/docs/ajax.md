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

 **AjaxPipeline** - holds the entire construction together:
 
  `IAjaxSendQueue` - A pool rather, receives the requests from the code

  `IAjaxCarrier` - the main element of the pipeline. Combines picking requests from send queue using pickers, packing them and sending them - see blow for the details.

  
    
    ...  