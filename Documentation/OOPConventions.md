# OOP Conventions


## [pseudo] properties

## Indexed properties

How it looks from usave point of view
```Javascript
    var x = someobject;

    // Get value(s)
    v = x.get_someindexedprop("keyx"); // Get the value with index keyx
    v = x.get_someindexedprop(5); // Get the value with index 5
    v = x.get_someindexedprop(); // Get all the values*

    // Set value(s)
    x.set_someindexedprop("keyx", v); // Set the value with index keyx
    x.set_someindexedprop(5, v); // Set the value with index 5
    x.set_someindexedprop({ keyx: v, keyy: v1, keyz: v2 }); // Set many/all values at once**
    x.set_someindexedprop([ v, v1, v2]); // Set many/all values at once**
    x.set_someindexedprop(null); // Clear all values
```

    * Returning the internal object or array is permitted. One should check the documentation/source of the particular class to see how is it implemented (if this is important).
    ** Two behaviors are possible according to the convention. The documentation should clearly state which one is implemented
    1. Replace all values with the passed ones - replace the internal storage fully. Not recommended for public APIs.
    2. Create/replace values corresponding to the specified ones in the storage, but leave the other existing values intact. Recommended for public APIs.
