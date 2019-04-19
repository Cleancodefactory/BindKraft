# Point class

A point, but with useful methods and integration with the other geometric classes and DOM.

## Interfaces implemented

IObjectifiable

## constructor
```Javascript
Point(x,y)
Point(pt)
Point(object)
Point(array)
```

>**x** - number, x coordinate

>**y** - number, y coordinate

>**pt** - Point object

>**object** - plain object that has `x` and `y` fields, which are used as x and y coordinates for the created Point.

>**array** - an array. The element 0 is used for x and element 1 for y.

## Fields

**x**

    The x coordinate of the point

**y**

    The y coordinate of the point

## Static methods

Point.**fromArray**

## Methods

Point.prototype.**objectifyInstance**()

>See [IObjectifiable](IObjectifiable.md)

Point.prototype.**individualizeInstance**(v)

>See [IObjectifiable](IObjectifiable.md)

Point.prototype.**isValid**()

    Checks if both coordinates are numbers and not NaN

Point.prototype.**toString**()

    Returns textual representation in the form "x=####, y=####"

Point.prototype.**subtract**(p)

    Returns the point resulting from subtracting this from p as vectors from the same coordinate system.

>**p** - another `Point` object. null will cause the method to return copy of itself.

Point.prototype.**add**(p)

    Returns the point resulting from adding this to p as vectors from the same coordinate system.

>**p** - another `Point` object. null will cause the method to return copy of itself.

Point.prototype.**distance**(p)

    Returns the distance to p

>**p** - another `Point` object. null will cause the method to return null.

Point.prototype.**mapRelativeFromTo**(ptBaseCurrent, ptBaseNew)

>Assuming that the coordinates of `ptBaseCurrent`, `ptBaseNew` are expressed int he same coordinate system returns a new point result of mapping `this` point from a coordinate system centered on `ptBaseCurrent` to coordinate system centered on `ptBaseNew`.

>**ptBaseCurrent**, **ptBaseNew** - Point objects or null. When null is passed for any one of the arguments a `new Point(0,0)` is used in its place.

Point.prototype.**mapTo**(ptBaseNew)

>Equivalent to `mapRelativeFromTo(null, ptBaseNew)`. Assumes `this` point and `ptBaseNew` are expressed in the same coordinate system, returns a new point resulting of mapping `this` point into coordinate system starting at `ptBaseNew`.

Point.prototype.**mapFromToElements**(el1, el2)

>Makes the same transformation like `mapRelativeFromTo`, but takes the viewport coordinates of the passed elements. The coordinates are taken relatively to the browser's viewport (see [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)).

>**el1**, **el2** - DOM elements or null. If any of the arguments is null Point(0,0) is used in its place. The result of using a null is - mapping to/from the browser's window viewport.
