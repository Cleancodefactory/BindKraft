# Window message handling process

This document is about the process of handling window messages. Before reading it one should familiarize with BindKraftJS windowing and window messaging in general.

## How the messages reach the window

Before discussing how the messages are handled it will be helpful to say a few words about how the messages _reach_ a specific window. By _reach_ we mean the point where it is determined that a particular message will be passed to the window message handling pipeline. There are some specific cases, but we will leave them for later and concentrate on the normal process.

There are the following possibilities:

1. The message is directly sent to the window. This usually happens through one of those two methods:

    ```Javascript
    WindowingMessage.fireOn(window, messageType, messageData); WindowingMessage.prototype.dispatchOn(window);
    ```

    There are other methods like `WindowingMessage.sendTo`, but they are mostly syntax sugar that ends up calling one of the above methods and we can ignore them for now.

2. The message is _posted_ to the window.

    ```Javascript
    WindowingMessage.postTo(window, messageType, messageData);
    ```

    Unlike the usual desktop windowing environments, BindKraftJS does not have message queues except one workspace global queue. That queue has more general purpose and is responsible for scheduling asynchronously tasks on the main thread (the document thread). The windowing messages are treated as one such task type and this is what postTo does - puts them in the global queue, from where the system scheduler will dispatch them on the specified window at a later point in time (exactly when depends on how much the system is loaded). 

    In the end this method again leads us to the same point - the `dispatchOn` method, but it gets called after a time asynchronously.

3. The message(s) are generated internally in response to another message or by a method that implements its functionality by sending one or more messages to its window. This, obviously, leads us to the same point as in 1.

4. Internal cross-window notifications. In a number of situations a window has to notify its parent or its children for something. In some scenarios (like destruction) it is more than notification - the message actually commands a child to do something.

    These all cases again involve the same methods as 1. but indirectly.

5. There are other situations, like broadcasting for example, but again they do the same, but to many windows in some fashion (broadcasting is discussed in detail later.)

The point of this list is that no matter how the messages are dealt with, they eventually reach the point where they have to be passed to the one and the same mechanism that `fireOn` and `dispatchOn` access directly. Therefore, we can discuss two separate sides of the matter:

 - the handling inside the window
 - the routing of a message until it reaches the window for which it is intended.

## The handling procedure

The handling starts by passing the message to the `BaseWindow.prototype.$handleWindowEvent` method.

TODO: Continue ...