# Array extensions

BindKraftJS (BK) defines a few additional methods over the Javascript Array object. The can be split into 3 groups:
- Query-like (Q)
- Unique elements method set (UE)
- Miscellaneous

    _The methods marked with * have some issues or are implemented in weird way. They will be updated soon (March/April 2019), please avoid to use them when possible._

If you want maximal backwards compatibility of your code with older Javascript and respectively older browser version you should prefer the methods defined by BindKraft over the similar methods in ES6 and above. In some respects BK methods are better - if nothing else they integrate better with BindKraft.

## Query-like extension methods

All the methods accept the same kind of callbacks, differing only in the expected return result (which is obvious from the purpose).

All the methods traverse the arrays from start to end in order - code that depends on the order of the elements can assume the order.

### Array.prototype.Select

```Javascript
result = _array_.Select(function(index, item) {
    // Non-null returns are included in the result
    // undefined/null results are not
});
```

### Array.prototype.Each

```Javascript
_array_.Each(function(index, item) {
    // Do with each element whatever you need to do    
});
```

### Array.prototype.All

Checks if all elements fulfill the condition checked by the callback

```Javascript
result = _array_.Each(function(index, item) {
    // return true/false to indicate if the particular element conforms to the condition
});
```

### Array.prototype.FirstOrDefault

```Javascript
result = _array_.FirstOrDefault(function(index, item) {
    // return non-null value to make it a result
    // null value skips to the next item
});
```

### Array.prototype.OrderBy

Orders the array by one or more fields

```Javascript
result = _array_.OrderBy({ fieldX: dir}....);
```

### Array.prototype.Delete

Removes the filtered items

```Javascript
result = _array_.Delete(function(index, item) {
    // return true-like to remove the element
});
```

### Array.prototype.Update*

A little risky method - prefer Each unless you know what you are doing.
If an element of the array is an array itself this will cascade on it. Also if `bobjects` is true-like it will check the element for a method Update and call it with the same callback (use with care)

It is recommended to use this with `bobjects` omitted. The other functionality can be useful, but can easily lead to unforseen problems if not used with extreme care.

```Javascript
result _array_.Update(function(index, item) {
    // Update the item
}, bobjects);
```

### Array.prototype.Aggregate

The only exception in the callback prototype. The result is created and repeatedly passed to the callback for update for each item and finally returned.

Any kind of aggregation can be implemented - over a number, object - whatever.

```Javascript
result = _array_.Aggregate(function(index, item, result) {
    // return the updated result.
    // if the result is null return a freshly created.
});
```

Example: count non-null elements
```Javascript
result = _array_.Aggregate(function(index, item, result) {
    if (result == null) result = 0;
    if (item != null) {
        result ++;
    }
    return result;
});
```