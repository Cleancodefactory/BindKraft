# Requestable interfaces (IRequestInterface)

`IRequestInterface` is the basis of "buffered" interfaces - these are interfaces that can be exposed through a proxy. These interfaces have to extend IRequestInterface directly ot indirectly:

```Javascript
    function IMyInterface() {}
    IMyInterface.Interface("IMyInterface", "IRequestInterface");
```

Normally (as in most OOP languages) interfaces are used through casting, but there are scenarios where they serve as a contract between objects that should not and cannot call them directly over the reference to the object implementing them. The most obvious case is remoting - reference is impossible to obtain, a transport and the corresponding encoding/decoding of the calls has to occur. Even in less demanding scenarios it is desirable to stick to the interfaces and prevent the clients to cast the reference they have to something they should not use. Therefore a proxy that implements only the interface and translates the calls to the real instance may be needed for various reasons and what this entails is a strict interface obedience - no way to call anything, but the declared by the interface methods.

There are two kinds of interfaces implemented that way by purpose:
- for remoting (and isolation)
- for isolation only

The difference is important, because the isolation does not imply additional restrictions, it only needs creation of a proxy to be possible. Purposing an interface for remoting is more demanding - the methods of the interface must be all asynchronous. In BindKraftJS this means they have to return Operation. To be honest it is possible to make this less demanding, but the result will be often confusing because of the involved hidden processing, while designing the method to return operation basically gives the right idea how to implement even if the developer considers it as a local (not remote) one and human mistakes would be less likely to occur.

When implementing interfaces for `isolation` only they can be used through the LocalAPI feature (see [LocalAPI](LocalAPI.md) ) and optionally for private local communication with other apps and daemons.

When implementing interfaces for `remoting` they can be exposed in remoting contexts that can be found from connected remote clients.

TODO: Continue the article. Leave the details for LocalAPI, remoting, daemons, private local communication for separate articles.