# String additions

In the standard String class BK adds a few useful methods, both instance and static ones (scroll further for them).

The static methods are obviously only loosely associated with the string class and some are exposed in alternative ways as well.

## Instance methods

### inSet
usage
```Javascript
    var b = somestring.inSet(theset,bkeys)
```
theset - string, array or object in which to search `somestring`. If is:
- a string - the search is for a substring (case sensitive)
- an object - the values are searched and search is successful if one matches `somestring` (case sensitive). Works with array too.

bkeys - if true is passed, instead of values the object's keys are compared to `somestring`. This one is not appropriate for an array - the results are not very useful except in a few cases that hardly fit the inSet intended scenarios.

Returns boolean - true if found, false if not.

## Static methods

### `String.reGroups` and `String.reGroups2`

Both methods take the same arguments and do the same, but compose their result differently. Depending on what you do one of them could be significantly more convenient to use than the other.

```Javascript
var x = String.reGroups(stringToParse, regexp[, name1[, name2 ...]]);
and 
var x = String.reGroups(stringToParse, regexp[, name1[, name2 ...]]);
```

The arguments:

- `stringToParse` - a string to be processed. If it is null - result with no matches will be returned
- `regexp` - Regular expression or string. If it is a string it will be converted to regular expression with global flag set. If it is a regular expression and its global flag is not set, it will be recreated with global flag and the these flags will be preserved: ignoreCase (i), miltiline (m). For compatibility reasons any other flags will not be preserved, but they are not useful in any way for the operations performed by these functions and thus should not be used anyway.
- `name1, name2, name3 ...` - strings as group/column names. Usually these should match the number of capture groups in the regex or they can be less if not all groups are desired `(Case A)`. If there are no capture groups `(Case B)` only the first name is used or the names can be omitted entirely and an internal name "match" will be used instead.
Alternatively the names can be specified as an array of strings in place of name1 - especially needed in cases where they are generated programmatically.
I.E. If no name or a single name is specified only the result will have only one "column".

- `Return result`

    * `reGroups`: an object containing one property per each specified name and an array in it with the n-th capture to which this name corresponds. Additionally a property `hasmatches` is included that is filled with the number of "rows" - successful matches. It will be 0 if nothing matches and can be used to check for success (if (x.hasmatches) { do something } ). If not all names are unique the matches with the same name for their position will go into the same column and it will be longer than the rest (this could be useful sometimes). So, in general the result returns the captures as a table, built with parallel arrays - one per column (when column names are unique).
    * `reGroups2`: In this case the result is constructed in the opposite manner - an array is returned with an object in each of its elements, where one property for each column exists with its value for the corresponding "row"/match. For better interchangeability the array has a property `hasmatches` with the number of "rows"/matches just like in the case of `reGroups`, but length will have the same value, so it can be used instead.

    When there are no matches the results are still returned, but empty and with `hasmatches` set to 0.

Additionally both methods will try to avoid deadlocks and return the result up to this point immediately if they detect that the regular expression cycles on the same position in the string. This is usually exactly what should happen and the result is correct, but if such a case is possible one should consider if this is true and avoid deadlocks unless they are part of the normal functionality. An example of how this may happen - matching the begin of the expression (with the ^ pattern) may be desired, but will not advance the matching further. If stopping the parsing there is what one wants - this is ok and can be left to the method to deal with it, but if that is not the case the regular expression should be redesigned.

**Examples**:

```Javascript

x = String.reGroups("a=1|b=4|x=sdf",/(\w+)\=([^=]+)(?=$|\|)/g,"Name","Value");
	will return:
    {
        hasmatches: 3, 
        Name: (3) ["a", "b", "x"],
        Value: (3) ["1", "4", "sdf"]
    }
    
x = String.reGroups2("a=1|b=4|x=sdf",/(\w+)\=([^=]+)(?=$|\|)/g,"Name","Value");
	will return:
	x = [
		{Name: "a", Value: "1"},
		{Name: "b", Value: "4"},
		{Name: "x", Value: "sdf"}
	]
	and also
	x.hasmatches == 3    
```

In a wide range of scenarios usage of these functions is simpler than direct usage of regular expressions and designing cycles to collect their results. Having some additional protection against mistakenly omitted flags and eternal cycles also helps to lower the complexity of the coded needed in many parsing tasks.