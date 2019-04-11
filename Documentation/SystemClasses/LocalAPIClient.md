# LocalAPIClient class

Enables usage of functionality exposed as [Local API](LocalAPIs.md) by the system or by running apps/daemons.

Apps can use it directly, but they have a somewhat better way to do so through [IUsingLocalAPIImpl](IUsingLocalAPIImpl.md) implementor. The advantage is better mocking support on per-app level.

## Constructor

> [LocalAPIClient](LocalAPIClient/constructor.md)()

Creates a new instance, filled with all the requested API that can be obtained at the time of creation.