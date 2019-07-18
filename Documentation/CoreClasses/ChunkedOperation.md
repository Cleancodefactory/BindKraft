# ChunkedOperation

This class inherits from Operation and is a fully functional operation, but in addition it is capable of reporting "chunks" of the work being done. Chunked operations are used in all cases where the task performed should be seen not just as an operation that starts and completes, but also as intermediate reports - between the start and the completion.

This abstraction fits (probably unexpectedly) many cases - from dialogs that apply settings and the user can apply changes multiple times before completing the dialog, to scenarios where progress is reported, to scenarios where this mechanism is used as means for constant communication with some object for its entire lifetime. Changing a little the way one views certain events can quite often put them into the category for which chunked operations are simple and convenient way to track process, state, chain of actions and so on.

## Declaration

```Javascript
function ChunkedOperation(taskproc, timeout);
ChunkedOperation.Inherit(Operation, "ChunkedOperation");
ChunkedOperation.Implement(IChunkedOperationHandlingCallbackImpl);
ChunkedOperation.prototype.ReportOperationChunk(success, errorinfo_or_data);
ChunkedOperation.prototype.chunk(callback, callbackfail);
```

Interfaces implemented:

IChunkedOperation, IChunkedOperationHandling, IOperation, IChunkedOperationHandlingCallbacks, IOperationHandling, IOperationHandlingCallbacks, IOperationReset

## Members

**ChunkedOperation.prototype.chunk(`callback`, `callbackfail`);**

Sets a callback to receive chunk reports.

**callback** - A callback (function, Delegate, EventDispatcher or any IInvokeWithArrayArgs object). The callback has the following prototype:

```Javascript
function(success, data)
```
The callback can return `false` to force the operation to complete (unsuccessfully) and no more chunk results will be reported. Any other return value will be ignored.

When success is false the `data` contains an error (string).

**callbackfail** - optional second callback, If specified all successful chunks will be reported to the first (`callback`) and all non-successful to the second (`callbackfail`). The success argument will still be passed to both.

What is successful chunk and what is non-successful is up to the code that calls `ReportOperationChunk` and corresponds to the specifics of the task. In other words this is up to the programmer who decided to use this approach.


**ChunkedOperation.prototype.ReportOperationChunk(success, errorinfo_or_data);**

Used by the other side to report chunks of data (work done). It follows the same pattern as CompleteOperation and has two arguments:

**success** - `true` reports successful chunk and data should contain the reported data. `false` reports un-successful chunk and data should contain error info (preferably string message).

**data** - (errorinfo_or_data) - the data or error being reported.

Obviously applying the chunked operation abstraction in all kinds of scenarios means that in some of them there is no possible meaning to assign to successful and non-successful chunks and they are all just successful. There is nothing wrong with that, the separation of hte chunks into successful/non-successful is just an option the programmer can use when it makes sense and ignore otherwise.

## Remarks

At the moment of writing there is no mechanism similar to `whencomplete()` for reporting chunks. Therefore, without additional effort to implement this in your own callback only one (two if separate are defined for successful/non-successful) callback can receive the chunk reports. It seems logical to keep it that way, because the chunks are more or less a way to abstract progress into workable pieces of data. This implies the chunk data is likely to be processed by the callbacks and applied to something in a very intentional manner. I.e. the abstraction that chunked operations define seems to be an intentional task execution with funneling the chunks done into the purpose for which this was done in the first place. Reporting them to multiple listeners may look tempting, but in most cases they will have very different reasons to do so and very different use for the data - the purpose of the data is usually fully known only for the code that starts the task and any other listeners will likely need some filtered/transformed data - adapted to their function.

It is important to distinguish between `completion` of an operation and `intermediate progress` chunks. The completion of an operation is interesting for potentially many parties, most of them interested in the completion, but not in the specific data in order to achieve synchronization. Unlike completion the intermediate progress does not signify such an universally recognizable event and the data it carries is what makes it useful, which in turn relates this usefulness to the "understanding" of the data (remember successful chunk is arbitrary and meaningful only in the specific scenario implementation).

This is the reason for not including a ready-to-use mechanism to broadcast chunks to many parties, we fear that this can lead to mistakes and possibly to attempts to use the chunks as some kind of "sub-operations" which will be wrong.




