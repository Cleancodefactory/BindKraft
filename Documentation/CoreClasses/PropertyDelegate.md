# PropertyDelegate class

A Class that provides a construct that can be used as a property with a value calculated/fetched when not available or refreshed if too old.



## Constructor
  
```Javascript
    x = new PropertyDelegate(obj, path, calcCallBack, autoRefresh);
```

**Static creators**

```Javascript
    x = PropertyDelegate.CreateAttached(obj, path, calcCallBack, autoRefresh)
    x = PropertyDelegate.Create(calcCallBack, autoRefresh);
```

 `obj`	{BaseObject}	Optional. The object on which the property should be created.

 `path`	{string}		Optional. The name of the field in which the fetched value is held.

 `calcCallBack` {callback} The callback that calculates/fetches the value. callback proto function(obj) where obj is the object from the obj parameter.

 `autoRefresh` {integer} Optional. If a positive number is supplied specifies when the value becomes dirty (in milliseconds).

 ## Public properties and methods




