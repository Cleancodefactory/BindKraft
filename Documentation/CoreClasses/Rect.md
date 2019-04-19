# Rect class

Just a rectangle class, but with useful DOM integration.

Without a context the values in the rectangle do not belong to any specific coordinate system. Only certain methods assume certain coordinate systems.

## Interfaces implemented

[IObjectifiable](IObjectifiable.md)

## Inherits from

[Point](Point.md)

## constructor

```Javascript
Rect(x, y, w, h)
Rect(pt,pt)
Rect(pt,object)
Rect(array)
Rect(object)
Rect(pt, w, h)
```

## Fields

>**x** - the x coordinate of the top left corner

>**y** - the y coordinate of the top left corner

>**w** - the width of the rectangle

>**h** - the height of the rectangle

## Static methods

Rect.**fromArray**(array)

Rect.**empty**()

Rect.**fromDOMElement**(el)

Rect.**fromDOMElementOffset**(el)

Rect.**fromBoundingClientRectangle**(el)

Rect.**fromDOMElementInner**(el)

Rect.**maxRect**(rect_array)

## Methods

Rect.prototype.**isEmpty**()

Rect.prototype.**isValid**()

Rect.prototype.**isRegular**(checkTypesToo)

Rect.prototype.**regularize**()

Rect.prototype.**mapFromToElements**(el1, el2)

Rect.prototype.**toDOMElement**(el)

Rect.prototype.clearPos()

Rect.prototype.clearSize()



## Properties

Rect.prototype.get/set_**size**()

Rect.prototype.get_**right**()

Rect.prototype.get_**bottom**()

Rect.prototype.contains(pt), Rect.prototype.contains(rect)

Rect.prototype.innerSpaceFor(pt), Rect.prototype.innerSpaceFor(rect)

Rect.prototype.innerSpaceForAnchoredRectangle(rect, anchor), Rect.prototype.innerSpaceForAnchoredRectangle(pt, anchor)

Rect.prototype.mapToInsides(rect, anchor), Rect.prototype.mapToInsides(pt, anchor)

Rect.prototype.intersectWith(rect)

Rect.prototype.center(rect)

Rect.prototype.adjustPopUp(pt, rect, method[, shit_x, shift_y])

Rect.prototype.surfaceArea()

Rect.prototype.toString()