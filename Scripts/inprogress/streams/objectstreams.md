# Object streams
Object streams define comms in which objects are read/written sequentially. Obtaining a stream is a separate matter and depends on the physical nature of the stream and usually on a kind of coordinator/ dispatchher which can implement another interface that returns a working stream fro  some of its methods.

There are 2 consumer interfaces for reading and for writing (sending). Most often both are implemented by the same server, but read-only and write only streams are permitted. The consumer interfaces assume existence or at least behavior based on internal queues (read / write).

To enable implementation of the consuumer facing behavior for different kind of streams there are also low level bare functionality interfaces.

## Consumer interfaces

```javascript

IMessageReadStream
IMessageWriteStream

```

## Low level implementation interfaces

```javascript

IMessageReadStreamReceiver
IMessageWriteStreamSender

```