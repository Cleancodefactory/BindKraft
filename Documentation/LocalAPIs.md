# LocalAPI

This feature enables APIs for local usage (the same workspace - e.g. browser tab/window) to be exposed and consumed by any local client. This applies both to the system and to API exposed by apps/daemons.

Why we need this? While such API can be accessed directly through some singletons, for instance, the naming becomes messy, the class names many and easy to forget, there is no protection against calling on the instances methods that should not be called directly and no general mocking mechanism is available. The `Local API` aims at solving these problems and most of the existing API will gradually migrate to exposure as `Local API` (the old ways to access them will remain for some time to guarantee compatibility.)

...
## Consuming Local API

The Local API are consumed through the `LocalAPIClient` class. For apps there are additional goodies enabling them to do this declaratively and in dependency injection fashion if they prefer (this is shown in more detail later in this article).

### Usage of LocalAPIClient - general concerns

This class can be used anywhere in any kind of code. Still, the best way to do this would be to use one instance of `LocalAPIClient` in any scope where it is easily accessible for any code working in that scope. Creating separate instances of `LocalAPIClient` every time some API is needed will involve additional work - not much, but unnecessary. Furthermore each instance of the LocalAPIClient creates proxies for the requested API and this will induce additional performance and memory costs without practical reasons to justify it.

For example in an app a single LocalAPIClient for the entire app will be enough in most scenarios. Even if that is inconvenient for some reason one client in a view will be fine and there would be no need of others created and quickly abandoned in separate methods. Of course, one should decide according to the circumstances - the point is - the initialization of LocalAPIClient costs some more memory and processing and while the costs are not great one should avoid creation of unneeded instances if one is accessible conveniently enough.

### Usage

When you know the services you need. Assume this code is part of some class.

```Javascript
// The constructor is a good place to init the client, but this can be done also
// in the init() method of a class derived from Base, for instance.
function MyClass() {
    MyParentClass.apply(this,arguments);
    this.local = new LocalAPIClient({
        "IAPI1": null,
        IAPI2: null
        IAPI3: "legacy"
    })
}
// Later in the code some usage in some method
MyClass.prototype.someMethof = function() {
    // One way of doing it
    this.local.getAPI("IAPI2").apiMethod(someargs);
    // Another way 
    this.local.API.IAPI2.apiMethod(someargs);
}
```

The interfaces in the example are just an example, of course. What is the difference between the two example lines?

If the IAPI2 was not available when the `LocalAPIClient` was created (in the constructor in the example), then the `getAPI()` method will try to re-obtain it from the system local API hub(s), while the this.local.API.apiMethod assumes the API was obtained and will attempt call a method over the particular API.

Apparently failure is possible and one can expect something can go wrong especially when the specific API one needs is exposed by an app or a daemon. The exposing app/daemon needs to be running in order the API it provides to be registered with the system and this may or may not be so. On the other hand with system provided API it is virtually guaranteed that the API will be found at the first try or not at all (if the system is somehow misconfigured or corrupt).

This dictates the ways to consume an API: 
* The system provided ones can be consumed with less care, because problems with them are likely solvable during the development and exceptions will be a sign to configure the system properly.
* API provided by apps and daemons, on the other hand, may not always be available. Right now BindKraftJS does not provide an auto-start functionality tied directly to a request for a Local API and it is unlikely to have one in future. Starting an app/daemon on demand is possible for apps/daemons designed to act that way, but not all local API correspond to such services.

So, a better pattern of local API usage, mostly for app provided API would look more like this:

```Javascript
// The constructor is a good place to init the client, but this can be done also
// in the init() method of a class derived from Base, for instance.
function MyClass() {
    MyParentClass.apply(this,arguments);
    this.local = new LocalAPIClient({
        "IAPI1": null,
        IAPI2: null,
        IAPI3: "legacy"
    })
}
// Later in the code some usage in some method
MyClass.prototype.someMethof = function() {
    // One way of doing it
    var iapi2 = this.local.getAPI("IAPI2");
    if (iapi2 != null){
        iapi2.apiMethod(someargs);
    }
    // Or the other way
    if (!this.local.API.IAPI2) {
        // Attempt to request it again
        if (this.local.attachAPIConf("IAPI2")) {
            // we got it this time
            this.local.API.IAPI2.apiMethod(someargs);
        }
    }
}
```
The calls to methods of LocalAPIClient can deal with both - names of interfaces and interface definitions alike. The calls used above can be used both ways:

```Javascript
var iapi2 = this.local.getAPI("IAPI2");
var iapi2 = this.local.getAPI(IAPI2);
//
this.local.attachAPIConf("IAPI2");
this.local.attachAPIConf(IAPI2);
```

### More about the list of requested API in LocalAPIClient constructor

Local API is identified by its interface. There is that `variation` options that allows more than one version of the same API to be registered with the system, but unlike other systems in similar circumstances it is not designed for normal usage. Variations are recommended only as temporary solutions for keeping old code working after breaking changes in API implementation. If you wonder why - don't forget where this all works! The whole system works in the browser and is downloaded as a huge Javascript bundle or set of Javascript files. If it becomes a practice to include legacy versions of implementations there is a risk that their number will grow unchecked until it becomes too big and mostly more and more difficult to manage. This situation is very different from the scenario in which the same can happen with a server side system - everything is there and there is no need to send it constantly to user browsers. For this reason the variations are not and will never become a proper versioning system enabling at run time the clients of a local API to decide which version to use.

Now that this has been said let us take a look at the list given to the LocalAPIClient. It is also called _configuration_ of the client.

```Javascript
this.local = new LocalAPIClient({
        IAPI1: null,
        IAPI2: null,
        IAPI3: "legacy"
    })
```
Each API you need is included in the list. Those that are needed in their default version (and most often than not - the only version available) are included with value of `null`. The cases where specific variation is needed - the variation is the value. You can check more about how API with variations is registered further in this document - in the sections covering the exposure of local API.

Each local API from the list will be requested during the construction of the LocalAPIClient. A reference to the proxy to it will be placed int the **LocalAPIClient.prototype.API** under the name of the interface. If the particular API cannot be obtained it can be re-requested later with attachAPIConf:

### attachAPIConf

We used the method **attachAPIConf(someapiinterface)** above. It re-equests an API from the configuration passed to the constructor and return **true** if it succeeds.

A smarter approach would be to request an API only if it was not previously obtained successfully:

### getAPI(apiinterface)

This one will return the proxy if it is already successfully obtained and will re-request it if it was not. Finally if this succeeds it will return it or **null** otherwise.

### attachAPI(interface, variation)

There is also an explicit way to request an API through the LocalAPIClient - even if it was not included in the initial configuration.

```Javascript
// If previously this.local = new LocalAPIClient();
if (this.local.attachAPI(someapiinterface, variation_or_null));
```
attachAPI will request the API you specify and if it succeeds will return true. The API's proxy will then be available in the API._interfacename_ property for further usage.

Using attachAPI directly should be avoided and especially if variations are used.

### Source local API hubs - where the local API come from

The LocalAPIClient will use by default the **LocalAPI.Default()** system default Local API hub. In case you want to specify the hub(s) explicitly LocalAPIClient can be created with any number of hubs specified explicitly instead of letting it to choose which ones to use.

```Javascript
this.locAPI = new LocalAPIClient({
    IAPI1: null,
    IAPI2: null
}, LocalAPI.Default(),MySecretAPIHub.Default(),someotherhub);
```

Any parameter after the configuration can be an existing instance of LocalAPI hub. Still, the system assumes only one is the default - LocalAPI.Default() and allows an additional one to be specified in System settings **LocalAPI** property (can be read like this **System.Default().get_settings("localAPI")**).

When LocalAPIClient is created without any explicitly specified hubs it will use the one specified in system settings (see tha paragraph above) and then the system default (LocalAPI.Default()). Each requested API will be requested from these two hubs in this order - from the one in system settings first, then if not found - from the LocalAPI.Default(). If there is no hub specified in the system settings, only the LocalAPI.Default() will be asked for the API.

This is the recommended way to use the LocalAPIClient and the option to specify a LocalAPI hub in the system settings, instead of only using the LocalAPI.Default() enables mock API implementations to be widely supplied to all its clients. 

Explicitly specified local API hubs are sometimes needed:
- By system code that needs to work with real implementations always;
- When custom hubs are used (with API you do not want to make available for the entire system)
- When you do not want your code to use mocks.

A more elaborate mocking is available to apps through the app launching process (see [SysShell](SysShell).launch)

## Exposing a Local API

This is typically done in an app, but system features may not be part of an app. The important fact to notice here is that an app can be started and stopped and its API have to be registered and revoked correspondingly. The system APIs, on the other hand, are always available and they are registered, but never revoked. See the design recommendations and conventions in the last subsection for details.

To expose an API it has to be implemented in a class, instantiated when app or daemon initializes and then it has to be registered. Later the API has to be revoked on app/daemon shutdown. The API is defined as an `interface` and this is the first step - to declare an interface for the local API you want to implement.

From that point on there are two ways one can choose from:

- low level explicit registration by directly communicating with the LocalAPI hub of choice (usually the LocalAPI.Default()) or manually implementing the `IImplementsLocalAPI` interface.
- Using the implementer of the `IImplementsLocalAPI` interface - `IImplementsLocalAPIImpl` which does most of the work, expecting from the developer only to implement a single method that returns a list of the implemented APIs.

Both approaches are described below with a special digression detailing the implementation requirements of IImplementLocalAPI for those who want to implement it manually (without the aforementioned implementer). The `SysShell.launchXXX` methods have built-in support for apps implementing `IImplementsLocalAPI` interface and even if you do not have plans to do this without the implementer that section will help you to understand the life cycles of local APIs better.

Below we describe first how to implement the API functionality and then how to expose it - first the simpler implementer based approach and then the others.

### Implementing the functionality that will be exposed as local API

**Step 1**

To provide others with ways to use something you implement as local API it has to be behind one or more interfaces. Plan how the functionality will be used - the method call sequences (if they are needed), classes of objects that will be obtained and possibly returned back through such calls. In reality one rarely needs to expose many interfaces even for a very complicated API - because even if you need dozens of interfaces, usually exposing only one is enough to give the clients of your API the entry points they need. The other interfaces will come into play from return results of method calls. So, consider your functionality and try to identify what has to be exposed directly as entry point(s) and doesn't.

Now comes the moment to define the interface that will be exposed as local API.

```Javascript
function IMyLocalAPI1 () {}
IMyLocalAPI1.Interface("IMyLocalAPI1");
IMyLocalAPI1.prototype.Api1Method = function() { throw "not implemented"; }
...

```

As you can see there is nothing special to be concerned about. If you have some experience with other interconnection techniques in BindKraft, you may wonder why the interface does not extend `IRequestInterface`? This would be reasonable question - proxy builders and some other remoting components are used by the LocalAPI, but the purpose of the local API is what the name says - to be local. For that reason none of the additional requirements apply to local API implementations and techniques and remoting components are used only because they are capable to provide some needed functions. The actual procedure when API is exposed locally is only a small part od the analogous procedure for remoting - proxies are created for interfaces, but no transport is used, no stubs are needed and so on. So, it is a (utterly) stripped down procedure of the procedure that has to be followed for exposing an interface remotely. IRequestInterface is one of the elements that are not needed locally and are skipped.

**Step 2**

Implement the interface over the `instance` of some class, which one?

Often this will be the class of te app itself, but this is not mandatory in any way. Once can create a separate class and create instance of it, keeping it in a field of the app for example. It is not typical, but this can be done also on some other app element - even a window (not recommended, but possible). The only critically important factor here is to do this over an instance that will live as long as the app lives. While other solutions are not impossible, they will be difficult to implement (registration and revocation should be done as a consequence of something specific happening in the app, this should be tracked carefully - which can be a complicated matter and so on).

Furthermore we are talking about API - anybody hearing this would expect it to be dependable and not something elusive that is there, then disappears, then appears again. An _example of a very bad idea_ for a local API would be exposing some functionality strictly dependent on the UI state of the app and only available under certain states, but not in others. There could be a sensible reason to do so, but this should be done differently - the API should be implemented as a front that will give the caller indication if what he wants to do is done or impossible when invoked. It may also include separate call for determining this at any moment ... Basically an API should be stable and available for app's life time or provided by the system and always available - this is what any developer would expect from an API.

Implementation in the app's class may look like this:

```Javascript
function MyAPIClass() {
    BaseObject.apply(this, arguments);
    ...
}
MyAPIClass.Implement(IMyLocalAPI1);
MyAPIClass.prototype.Api1Method = function() { return "Well, I exist!";}
```

TODO: Working example(s) - this is best understood in a full example.

Now assuming one has the implementations, they have to be exposed to the system.

### Shell's support for apps exposing local API

Local API can be exposed "manually"/"actively", by explicitly registering interface implementation instances into some `LocalAPI` hub (the class LocalAPI is exactly that, LocalAPI.Default() is the system default hub, it is usually the only one, but others can be used for private reasons, mocking etc.). Apparently this approach has its setbacks:

The most important reason to depend on the Shell instead of manually/actively registering in the system hub or other hub(s) of your choice, is the nature of the usage of an API. Other apps just find the API and use it, but the question is how they find it?

Without additional means, doing everything on your own, both the servers of an API and clients of the API expose and consume API respectively by using a hub they have to know about explicitly. Then, isn't the system hub (`LocalAPI.Default()`) exactly that? Yes and no - remember that software development also includes various ways of testing code, sometimes sandboxing for various reasons (not limited to testing) and so on. The ability to replace the hub (in this case) and in the general case all kinds of dependencies is not an exotic requirement, but something we prefer to have when needed. This is what the Shell's support gives you.

SysShell.launchXXX (methods like: `launch`, `launchone`, `launchEx` etc.), visible globally as `Shell.launchXXX(...)` are responsible for starting and stopping an app. This is internally a complicated process that takes care about many details which remain largely transparent for the developer, but their results are in high demand.

Exposition of Local API during launch and shutdown:

1. launch procedure starts ...
2. _... other steps ..._
3. Instance of the app's class is created - **app**
4. _... other steps ..._
5. List of hubs where the APIs have to be registered is created.
    Currently only one hub is supported. By default this is `LocalAPI.Default()`, but a replacement can be passed in `option.RegisterInLocalAPIHub` when calling `launchEx`. (see SysShell documentation for alternatives and more info)
6. .. other steps ... one of the steps 7. or 8. happens
7. app initialization is performed and completes successfully (asynchronously or synchronously). continue to step 9.
8. app initialization is performed and fails (asynchronously or synchronously). The launch is cancelled and no API registration occurs.
9. If **app** supports `IImplementsLocalAPI` interface. `app.registerLocalAPI(hub)` is called for each hub into which it should register (currently only one hub).
10. In the **app's** registerLocalAPI the app calls hub.registerAPI once for each interface it wants to register and remembers the returned cookie for revocation on shutdown. This is done by the `IImplementsLocalAPIImpl` automatially (see the next section) or by manually written code depending on the implementation (see later in the article some hints how can this can be implemented).
11. app functions for some period
12. app starts shutdown sequence for some reason.
13. Early in the shutdown sequence, before anything important is done `app.revokeLocalAPI(hub)` is called for each hub (the same hubs previously passed in step 9.). Currently this can be only one hub.
14. In the revokeLocalAPI method the **app** calls the `hub.revokeAPI` for each previously exposed interface. For the reasons mentioned above the exposed interfaces are usually always the same, but it is possible to have rare exceptions - apps registering different API interfaces depending on some factors (not a recommended pattern).

_On a side note the `AppGate` object the app receives in its constructor, also provides methods for registration and revocation of local API. The hub where this occurs is managed by the Shell appropriately, but this approach is not recommended. The reason to avoid it is in the nature of the app's lifecycle. When using the `IImplementsLocalAPI` the app is called by the Shell when it starts and when it stops to register/revoke the API it provides, i.e. the API is available for the entire life of the app's instance. This is the normal way local API should behave. Using AppGate an app can register/revoke API at any point of its lifecycle which will make the availability of the API unpredictable and undetectable in advance. When done through `IImplementsLocalAPI` all API provided by an app becomes available when it is started, thus a procedure to start the app when its API is needed can be implemented easily by any consumers of the API. This is not possible in the other case (AppGate based), because the availability of the API will depend on some internal logic of the providing app._ 

The feature in AppGate is mostly provided for system apps and should be avoided in any regular app. If the lifecycle of the app has phases during which the API cannot function, this should be implemented as behavior of the API and not as its availability. Do not forget that consumers of the API can obtain it and hold a reference for a long time, during which periods when the API cannot function can exist. In that case clients will be forced to stick to a pattern of API usage in which it is obtained used and immediately released, which is certainly not the best way to treat the consumers of your API.

### Exposing local API using the IImplementsLocalAPIImpl

`IImplementsLocalAPIImpl` will be deprecated, because the method described above is simple enough and more straightforward.



