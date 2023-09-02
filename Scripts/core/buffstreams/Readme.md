# Buffered streams

## Interfaces

### Consumer interfaces

`IBuffStreamRead` and `IBuffStreamWrite` are used by code reading/writing to.from the stream, while
IBuffUnlLoad is used by the transmitter of the data in the write buffer and
IIBuffLoad is used by the receiver that receives data from underlying implementation and puts it in the read buffer.