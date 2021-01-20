# LocalAPI class

Implements a local API hub in which providers of services can register and clients can request those services through [LocalAPIClient](LocalAPIClient.md) or [AppGate](AppGate.md).

One instance of LocalAPI is globally available as singleton in each BindKraft workspace (WEB page) and is referred to as the "default" LocalAPI hub.

Normally other hubs than the default one are not user, nor necessary. Such hubs are supported by the [SysShell](SysShell.md), but only as means to mock certain services for development and testing purposes. Implementation of custom/private hubs while possible is not a recommended practice, because it will go against the concept of service availability throughout the workspace.

There is ongoing development that will put LocalAPI in another important role - as service bridge between linked workspaces (different browser contexts like, for example tabs, holding references to each other).

## Getting hold of the default LocalAPI

In order to register an API an implementation has to obtain reference to the default hub. Here are pointers detailing how to do it depending on the nature of the implementation.

### Permanent API implementations

Permanent API is an implementation that basically extends the BindKraft and lives with the workspace. They may be implemented in separate modules or as future classes of BK, what makes them permanent is that their functionality is not part of the life of an App or other construct that can be turned on or off.

These API can use directly `LocalAPI.Default()` to obtain a reference to the default LocalAPI hub.

### Application supplied API implementation

Apps can provide local API to various effect. Some such API can be designed to allow other apps to control the behavior and function of the implementing app, others can provide more traditional services like access to data in abstract manner, usually packed in objects living in the provider app with only interfaces to them supplied to the consumer.

Here an important consideration has to be noted - apps can run in multiple instances. Some will be implemented to avoid that, but others will not and some will even be designed exactly for that kind of usage - in multiple instances, each dealing with different data for example.

For the above reasons services can be requested from apps in two ways - directly from the LocalAPI default hub if they register the services there or through the system shell, by finding an app instance and querying it for services. To get hold on the shell one can use obtain IShellApi through he same default LocalAPI hub or use the AppGate object passed to the app by the shell. The AppGate has some convenient methods for direct work with the shell. There is a 3-d way which is not recommended for future use - through the global variable Shell. It will be maintained for forseeable future, but can be restricted only to certain debug modes at some point. More details about using the exposed API are covered in using LocalAPI.

