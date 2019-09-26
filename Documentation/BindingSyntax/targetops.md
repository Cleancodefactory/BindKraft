# Supported target operations in bindings

This document lists all the supported built-in target operations and additionally lists the rules for binding to indexed and non-indexed properties of BK class instances attached to elements of the template with the data-class attribute (in the end of the document).

## Built-in target operations

**text**

Sets/gets the text content of the element. When set all internal structure is destroyed and replaced with plain text.

**val**

Sets/gets the value of an element. Not all HTML elements have a value property! This will have no effect on those who don't.

**html**

Sets/gets the inner html of an element. No processing is performed on the html text - any BindKraft attributes specified in it will have no effect. Good for setting of small segments of HTML formatted content.

**src**

Sets/gets the src of a HTML element - not all have one and this will have effect only on those that have one (img for instance).

**checked**

Historically some form fields in HTML, the check boxes and radio buttons, have both value and checked property, but we are actually interested more if they are checked or not, while their value is of a little use in the browser. This operation sets/gets as boolean the checked state of these elements - no effect on other HTML elements. Please note that using radio inputs in browser javascript applications is not a good idea, they were designed with a special behavior for form submits and this behavior is nowadays more of a problem, than a blessing. It is better to use SelectableRepeater and images or some other method to show something that looks like radio button instead of the input type="radio" input.

**elementtitle**

Sets/gets the element title - shown by all browsers in a tool tip when the mouse hovers over the element. (Mobile behavior is not yet fully determined by all browsers. devices with pens will show it on hover, like the mouse case, but with capacitive touch-only screens the title is rarely visible)

**elementreadonly**

Sets/gets the read-only state of a HTML element. Will work with form field elements only.

**elementdisabled**

Disables(true)/enables(false) an element. Most useful with form fields and elements that can gain the keyboard focus (having tabindex for instance). This also disables/enables the elements children, thus enabling the programmer to disable bigger constructs in a single step. It also checks if the element on which it is specified has an attached class instance that supports the `IDsiablable` BK interface, that enables BK components to implement custom disabling if necessary. Disabling an element generally means it will refuse user input, gaining focus and usually also changes the look of the element/component in order to advise the user for the fact. Apparently custom implementations of IDisablable may treat this general guideline in their own manner.

**attributebyparameter**

Sets/gets the value of an attribute of the element. The attribute's name is specified in the binding's parameter. E.g. `data-bind-attributebyparameter="{read path=somepath parameter='title'}"` will set the title of the element like the `elementtitle` operation (see above), but as general attribute - of course this is more useful with some other attributes, especially attributes specific to some HTML elements only. There is something to note here - this sets the attribute and not the corresponding property (if one exists for this type of HTML element). This usually have the same effect, but exceptions are possible and are known to exist in Internet Explorer.

**elementattribute**[]

Like the elementattributebyparameter this operation lets you set/get the value of an attribute but as an indexed target operation. If we reiterate the example above it will look this way with this indexed target operation: `data-bind-elementattribute[title]="{read path=somepath}"`

_Styling operations_

**textcolor**

Sets/gets the color for the text - the same values can be assigned as those one can assing to the [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) style property, e.g. "#FFFF00" or "rgb(120,120,0)" and so on.

**backcolor**

Sets/gets the background color of an element. The colors are like in textcolor. See [background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) style property for the possible values.

**backimage**

Sets gets the background image url for the element. An url string pointing to the image is specified. As these are most often relative, this will be relative to the base URL of the BindKraft workspace. If unsure what it is open the browser console and check the result of `BKUrl.baseURL();`.

**backposition**

Sets/gets the background position (see the [background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) style property for the possible values)

**backgrnd**

Sets/gets the entire [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) style property.

**imgheight**,
**imgwidth**

These set/get [height](https://developer.mozilla.org/en-US/docs/Web/CSS/height) and [width](https://developer.mozilla.org/en-US/docs/Web/CSS/width) style properties of an element respectively. The name img*** can be deceiving - somebody named them that way and backwards compatibility is a bad girl sometimes - they apply to any element, not just to images.

**textalign**

Sets/gets [text-alignment](https://developer.mozilla.org/en-US/docs/Web/CSS/text-alignment) style property

**cssclass**

Sets/gets the value of the class attribute of the element as string.

**addcssclass**[]

Enables the programmer to toggle the existence of certain class in the class attribute of the element. The value assigned must be true or false and the class specified in the index will be added or removed respectively e.g. `data-bind-addcssclass[redish]="{read path=isactive}"`. Here the class **redish** will be assigned if the _isactive_ field in the local data context is true and will be removed otherwise.

**fontweight**

Sets gets the value of the [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) style attribute.

**indentination**

Sets/gets the `left-margin` style property in pixels.

**style**[]

If the style related target operations above are not enough, this enables acess to all the style properties, by specifying the style property name as index:
`data-bind-style[text-decoration]="{read path=decoration}"`. It is recommended to use the specialized target operation (if it exists) instead of this one, because some specialized operations do (and will do more in future) some validations and conversions which are not possible in the general target operation `style`.

_Visibility of an element_

**display**[]

Sets/gets the value of the `display` style property. A boolean-like value has to be transferred to the target. The binding will set the value of the `index` if the value is true and `none` if the value is false. E.g `data-bind-display[block]="{read path=isvisible}"` will hide the element if _isvisible_ is false and displayed as block element otherwise. As the HTML progressed the display modes grew and without specifying one it may be too hard or even impossible to determine it if the element is hidden initially. This target operation makes this deterministic. When read (updateSources) the binding will return true if the element is visible even if the current display mode is different from the specified index. This is not typically an issue, but can become if one decides to have multiple such bindings on the same element. This is possible and valid, no matter how unlikely it looks somebody to want to change the display mode that much.

**displaymode**

Sets/gets the value of the `display` style property as string. Usually the visibility is more conveniently controlled through boolean values, but in those cases when the programmer wants to bind the exact CSS values, this can be done through this target operation.

**elementvisible**

Similar to display[], but the mode is not specified. Assigning boolean value will hide/show the element, but if it is initially hidden, an empty string will be assigned to the `display` style property when true is assigned. Although it is often possible to determine the intended display value for when the element becomes visible by analyzing the style and CSS, this can be heavy operation impacting the predictability of the binding's performance with no guarantee for success. Thus we decided to do nothing and effectively assign the default display mode for the given element when the desired one is not known in advance.

**elementvisibility**

Sets/gets the visibility of the element. A boolean value triggers the operation and it changes the visibility style property between visible and hidden respectively.

**elementcollapsed**

Sets/gets the visibility of the element. A boolean value triggers the operation and it changes the [visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility) style property between visible and collapsed respectively. This is useful almost exclusively for tables only.

_Diagnostic and development only_

It is not recommended to use any of the following in production!

**datacontext**

Reads/sets the data context starting from the element (if any). Will not search for the data context encompassing the element - gets something only if data context is assigned to this element explicitly. Assigning data context will not trigger the (usually expected) processes of update of the bindings down the DOM tree of the template. Can be useful for experimenting, testing and searching for data-bound bugs.

**elementid**

Sets/gets the element id. Using element id-s in BindKraft is a very very bad idea. Almost everything visual one builds with BindKraft is designed to show in multiple instances and any fixed id will violate the uniqueness required by the HTML standards. Still, during development and debugging of elusive problem in a project, assigning id-s to some elements one wants to inspect directly can help a lot. This is reserved for these situations. It is theoretically possible to generate dynamically unique id-s from your classes and assign id-s to elements without causing any troubles, but it is ultimately pointless effort, because its goals can be achieved with much less code by using locally unique `data-key` assignments, access through bindings, assigning sub-components to properties and a number of other techniques 

