# Orders array / Order fields array

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

## Case 1 Order fields array - specify fields containing the data

This is an indirection of a sort. 

**fieldname** - contains a string specifying the name of a field containing the actual field/column name to sort on.

**direction** - contains a string specifying the name of a field containing the actual sort direction. 

**Remarks**: Depending on where the so named fields are the expected values in them will differ. When an `order fields array` specifies fields in an IParameters source the direction field(s) are expected to contain  only these values: "ASC", "DESC", null, "". Null and empty string should be treated as "ASC". This is for compatibility reasons. Implementations may intelligently read both numeric and SQL-like notations, but writing to IParameters cannot determine what to write and SQL-like format is default. A new interface, derived from IParameters is considered as a way to migrate to numeric notations, but it is not yet decided (BK v.2.19).

## Case 2 Orders array - specify orders

**fieldname** - A string defining a field/column name

**direction** - A string defining direction or null. If  non-null it must be a number: positive - ascending order, 0 - no order, negative - descending order.





