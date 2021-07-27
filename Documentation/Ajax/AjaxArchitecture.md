# BindKraft Ajax architecture.

This architecture was and is developed after version 2.24. It obsoletes the old jquery based one.

## Architecture brief

A complete construction capable of handling ajax requests is called henceforth a `pipeline`. One or more `pipelines` can exist in memory, but only one is the system default pipeline. It is not encouraged to use private pipeline instances, but in some rare cases this could still be desirable and is perfectly possible.

Each pipeline has the same general construction:

1. **Request sender utility.** 

    Usually implemented as `implementer` this becomes part of the classes that use the pipeline. 

    The sender utility schedules the request into the ajax queue (`IAjaxSendQueue`) as an object implementing `IAjaxRequest` interface.

2. `Queue inspectors`

    A set of `IAjaxSendQueueInspector` objects is configured to monitor the queue.

    The inspectors implement filtering of the requests by various criteria and most often by using `IRequestInspector` objects.

    Each queue inspector serves one carrier TODO....