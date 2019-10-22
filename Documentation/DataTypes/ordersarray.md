# Orders array

Structure:

```Javascript
[
    [fieldname1, direction1],
    [fieldname2, direction2],
    ....
    [fieldnameN, directionN]
]
```

This type is used to transfer/set/configure multi-column ordering where applicable. Each element of the array is turn an array with two elements:

**fieldname** - A string defining a field/column name

**direction** - A string defining direction or null. It can take only these values: "ASC", "DESC", null, "". Null and empty string should be treated as "ASC".

For compatibility reasons the direction is specified in this SQL like manner, we consider wider usage of -1, 0, 1 direction, but for the moment this cannot be done without breaking the function of various components.



