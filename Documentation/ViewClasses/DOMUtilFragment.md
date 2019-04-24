# DOMUtilFragment class

Primarily designed for internal usage in BindKraftJS this class can be sometimes useful directly if manipulation of HTML fragments is necessary.

## Constructor

**DOMUtilFragment(fragment, singleroot)**

    Creates a new DOMUtilFragment object.

>**fragment** - optional initializer. Can be a string containing HTML or a previously created [DocumentFragment](https://developer.mozilla.org/docs/Web/API/DocumentFragment) object. In both cases the fragment is filtered and only [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) nodes will remain in its root. When omitted the object will be created empty and later a fragment can be set using the `set_fragment` (the same filtering applies).

>**singleroot** - optional boolean. If `true` will configure the new instance to accept only single root fragments. It will throw an exception when fragment is set (when using `set_fragment` and `fragment` argument in the `constructor`) and it has more than single root element.

Example:

```Javascript
var f = new DOMUtilFragment('<div><span>Some text</span></div>');
```

## Properties

**get/set_fragment**

    Gets or sets the fragment. Like in the constructor both HTML string and previously created DocumentFragment can be set. See the constructor above for the filtering that occurs.

**get_root(bCreateGroup)**

    Gets the root element from the fragment. Will actually pick the first one without checking.

>**bCreateGroup** - **not implemented yet**. Will group multiple root elements (some other changes are needed first)