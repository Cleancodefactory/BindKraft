# ILocalProxyCollection

## Interface declaration

```Javascript
function ILocalProxyCollection() {}
ILocalProxyCollection.Interface("ILocalProxyCollection","IManagedInterface");
ILocalProxyCollection.prototype.count();
ILocalProxyCollection.prototype.item(index);
```

### count()

Returns the number of items in the collection.

### item(index)

Returns the item indexed by the `index` argument. If `index` is out of the collection bounds ( `index < 0 or index >= collection.count()`) null will be returned.

### Remarks

This interface is what the caller will receive in response to its call (directly or through operation depending on the method's design). The collection is read-only for the caller.

In order to have a method that returns it one has to declare it with `.ReturnType(ILocalProxyCollection)`. 

It can be used also as an input parameter when calling a method through a proxy. If this is allowed the method have to specify this type in the `.Arguments` declaration.

