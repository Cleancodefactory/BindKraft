<!-- vscode-markdown-toc -->
* 1. [Requirements](#requirements)
* 2. [How this works and where is it used](#how-this-works-and-where-is-it-used)
* 3. [Proxy generation](#proxy-generation)
    * 3.1. [What are the strict and non-strict modes?](#what-are-the-strict-and-non-strict-modes?)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# Managed proxies

(This is advanced topic. Typically one only needs to know that these proxies exist).

The so called `managed proxies` are intended to provide isolation between client and server locally (inside the local workspace). 

Despite the similarities between remote and local stubbing techniques they have very different natural limitations. This is the reason for the existence of two different and somewhat similar sets of interfaces and classes in this area.

So, the local proxies can be seen as collapsed remoting and as proxy and stub combined into one and the same object. For the developer there is a more important difference - the local isolation (through the proxies) does not require all methods to return operations (to be asynchronous). This alone justifies the existence of the local proxies.

##  1. <a name='requirements'></a>Requirements

A local (managed) proxy can wrap only interfaces extending the `IManagedInterface`:

```Javascript
function IManagedInterface() {}
IManagedInterface.Interface("IManagedInterface");
IManagedInterface.prototype.GetInterface = function(iface);
IManagedInterface.prototype.Release = function();
```
The implementation of the interface is actually very simple, because:

>The `Release` method is implemented by the proxy internally and no implementation is needed by the class that provides services based on interfaces extending IManagedInterface.

>The `GetInterface` method have to be implemented, but this is done in a very trivial manner. The server class have to implement it as simple method returning the reference to the object on which the requested (in the `iface` argument) interface is implemented. The rest of the work is again done by the internally generated proxy.

##  2. <a name='how-this-works-and-where-is-it-used'></a>How this works and where is it used

These client-server relations can potentially exist in quite many scenarios - anywhere where isolation between client and server code is preferred/required. I.e. in general all the Javascript in the local workspace runs in the one and the same Javascript workspace context - the javascript context of the WEB page. At a very general level any two objects in the workspace may have some way one of them (the client) to request a reference to the other (the server) based on some interface known for the both parties (implemented by the server, called by the client). We ignore for the moment how and what enables the client to find the server and request the interface, but this mechanism is the one that decides to pass a direct reference or a wrapped one that will not allow the client to call on the server any methods that are not part of the requested interface, thus establishing certain level of isolation between them.

In BindKraftJS such relations are maintained through two mechanisms (in version 2.8, later versions may introduce new ones).

>`Local API` - Applications or singleton classes register themselves in a central "Local API" hub as providers of a service described by certain interface (they register the interface and their instance as its provider/server). Then any client (app, a class living anywhere in the workspace) can request that service from the "Local API" hub and they receive wrapped with a managed proxy reference to the server enabling them to call the methods of the requested interface on the server, but no others.

>`Running apps and daemons` - This is also called often a `shell interface`, because the system shell (The SysShell singleton) is the one that launches and manages the apps and daemons running in the workspace. through this interface other apps or just classes somewhere inside apps can request a service provided by some running app or daemon. The client in this case asks for a specific interface (that interface describes the service) and also specify a condition by which the shell to recognize the app/daemon from which it has to be obtained. The condition can vary from none (i.e. the first app capable to provide it) to application's class name, to some more advanced condition that determines a specific instance of the app. The important thing here is that after that app is found the shell very much like the local API returns a wrapped in a managed proxy reference to that app/daemon, limited to the requested interface like in the Local API case.

It is not prohibited to implement custom scenarios like these. So, the technique and the involved mechanisms are open for wider use if somebody deems them useful and appropriate in a custom scenario.

##  3. <a name='proxy-generation'></a>Proxy generation

It is probably already obvious that the bulk of the proxy generation work will be done by the system behind the scenes, but there are cases in which the developers have to wrap references to objects themselves. Another reason to familiarize with the proxy generation is to know how, why and when to control/configure it.

So, before going into the details how this is done by the local API and the shell, let us see what the generation process is by itself.

The proxy generation needs two things to be known/obtained:

>The interface identifying the service being requested.

>A reference to an instantiated object that implements the interface.

The interface SHOULD extend IManagedInterface. It is possible to put BindKraft or perform the generation in a very relaxed manner and ignore this, but it is a very bad practice with potential to cause a mounting number of mistakes down the line. To avoid that all default settings forbid it and exceptions will be thrown if a proxy generation is attempted on inappropriate interface.

To generate a local managed proxy one needs the `DummyInterfaceProxyBuilder`. The proxy generation is based on the `IProxyInterfaceBuilder` interface, but it covers both the local managed case (the one we discuss here) and the remoting (which is outside of our topic). To avoid confusion one should notice that for remoting there are more elements required - some transport is necessary, ways to establish basic connection to another workspace and so on. All this means that in case of remoting the `IProxyInterfaceBuilder` interface will be implemented by a number of different builders, will need configuration and so on.

For the local proxies there are no such complication and one proxy builder is enough for all cases and this is the `DummyInterfaceProxyBuilder`.

To obtain one the apps can get it from the AppGate instance they receive from the shell, which is the recommended way. In other situations (in a system code for instance) a more direct approach will be needed and the builder can be obtained either:

>As a singleton from `DummyInterfaceProxyBuilder.Default()` which is configured according to the BindKraft core settings.

>As a new instance: `new DummyInterfaceProxyBuilder(strict)`

Here the `strict` argument is optional and if omitted the new instance will just follow the BindKraft core settings as the singleton above. If `true` or `false` are passed to the constructor the builder will be created for strict or non-strict mode accordingly.

There are further considerations for the strict and non-strict mode and it is highly recommended to use non-strict mode only for development time testing and experimenting. It is also important to notice that this is better done through BindKraft core settings and not through `new DummyInterfaceProxyBuilder(strict)`. The reason is that the builder generates a new class for each proxy and the strict/non-strict mode argument will have effect only when the builder generates a proxy for that interface and server class for the first time. Just have this in mind and do not use non-strict mode in production!

###  3.1. <a name='what-are-the-strict-and-non-strict-modes?'></a>What are the strict and non-strict modes?

In strict mode all the requirements are either enforced or cause exceptions if they are not met. In non-strict mode one can cut some corners. This is sometimes done by the system, but is not recommended otherwise.

>In strict mode the methods cannot return references to instances of BindKraft classes unless they are wrapped in a proxy.

>In strict mode all interfaces involved in this have to extend IManagedInterface

In non-strict mode both requirements are ignored. Notice the first one - it is the reason we are talking about the possibility to cut corners. In strict mode once you get a service wrapped in a proxy all new references have to be wrapped in proxies (One can trick the system, of course, but this is not the point). This means that in a piece of code where this reference is called extensively there will be noticeable performance penalties caused by the proxy and this is the reason to allow this rule to be ignored sometimes.

It is probably already apparent that using the builder's constructor or the core settings is good only for development time and is not true way to deal with potential performance bottlenecks. For that purpose there is a way to declare interfaces in such a way that no matter what the rest of the configuration is whenever a proxy is generated for them it will be as you specify - strict or non-strict respectively.

To do this one has to declare the interface for the specific service this way:

```Javascript
function IMyService1() {}
IMyService1.Interface("IMyService1", "IManagedInterfaceStrict");
// instead of
function IMyService1() {}
IMyService1.Interface("IMyService1", "IManagedInterface");
```

This tells the proxy builder to always create strict proxy for that interface.

For the other case - non-strict proxy requirement by design:

```Javascript
function IMyService2() {}
IMyService2.Interface("IMyService2", "IManagedInterfaceNonstrict");
// instead of
function IMyService2() {}
IMyService2.Interface("IMyService2", "IManagedInterface");
```

Both `IManagedInterfaceStrict` and `IManagedInterfaceNonstrict` interfaces extend the `IManagedInterface`, so the service interface will meet the requirements, but will have a built-in marker by which the builder will recognize its explicit needs.

In the overwhelming majority of scenarios using strict proxies is fine and protects the developers from omissions in their code that can cause loss of isolation and consequently interference between apps. However, there are rare, but legitimate cases in which breaking the isolation is acceptable sacrifice.
