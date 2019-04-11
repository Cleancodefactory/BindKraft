


/*
ElementGroup is not intended for public use. It is used internally by the framework core functions and may be useful for developers of reusable components.
They should use it to group several DOM elements to behave as single element in respect to the data-key name resolution. The name resolution is done automatically
by the CJBUTL, the implementors should use only the constuctor. It can be called with jQuery sets, arrays of DOM elements or single DOM elements. Each DOM element
or set of DOM elements passed as arguments to the constructor become part of the group. The creator of the group MUST NOT keep a reference to it!
*/
/*CLASS*/
function ElementGroup() {
    BaseObject.apply(this);
    this.registerElements.apply(this, arguments);
};
ElementGroup.Inherit(BaseObject, "ElementGroup");
ElementGroup.description = "Used by ViewBase.cloneTemplate to group DOM elements so that they can be searched by data-key together";
ElementGroup.$domPropName = "jbElementGroup";
ElementGroup.registerDOMDestructor(ElementGroup.$domPropName);
ElementGroup.markSiblingGroup = function(el) {
	var allKeys = el.attr("data-sibling-group");
	if (!BaseObject.is(allKeys, "string") || allKeys.length == 0) return;
	el.removeAttr("data-sibling-group");
	var e = null, grpKey = null, k;
	var arrKeys = allKeys.split(",");
	for (k = 0; k < arrKeys.length; k++) {
		grpKey = arrKeys[k];
		if (grpKey.length > 0) {
			for (var i = 0; i < el.length; i++) {
				e = el[i];
				if (BaseObject.isDOM(el)) e = el;
				if (e != null) {
					if (!BaseObject.is(e[ElementGroup.$domPropName], "Array")) e[ElementGroup.$domPropName] = [];
					e[ElementGroup.$domPropName].addElement(grpKey);
				}
			}
		}
	}
}

ElementGroup.getElementSet = function (el, resultIn) {
    var result = (resultIn == null) ? [] : resultIn;
    if (BaseObject.isJQuery(el)) {
        for (var i = 0; i < el.length; i++) {
            result = ElementGroup.getElementSet(el[i], result);
        }
    } else if (el.nodeType) {
        if (BaseObject.is(el[ElementGroup.$domPropName], "ElementGroup")) {
            result = el[ElementGroup.$domPropName].concatElements(result);
        } else if (BaseObject.is(el[ElementGroup.$domPropName], "Array")) {
            var arr = el[ElementGroup.$domPropName];
            for (var j = 0; j < arr.length; j++) {
                if (BaseObject.is(arr[j], "ElementGroup")) {
                    result = arr[j].concatElements(result);
                } else if (BaseObject.is(arr[j], "string")) {
					// traverse all siblings for the same string
					var g = ElementGroup.$traverseSiblings(el, arr[j]);
					if (g != null) {
						result = g.concatElements(result);
					}
				}
            }
        } else {
            result.addElement(el);
        }
    }
    return result;
}.Description("Returns an array of the grouped elements (if any). Call with single argunment (element or jquery element), " +
			  "it can potentially participate in multiple groups and all the elements from all the groups are extracted and" +
			  " returned as naked elements in the result. If the element is not grouped empty array is returned");
ElementGroup.prototype.groupName = null;
ElementGroup.$traverseSiblings = function(inEl, grpKey) { // Returns a grouper (existing or new if none exists)
	var el = $(inEl);
	if (el.length > 0) {
		var siblings = el.parent().children();
		var t, s = null, grouper = null, toregister = [];
		for (var i = 0; i < siblings.length; i++) {
			s = siblings[i];
			ElementGroup.markSiblingGroup($(s));
			if (BaseObject.is(s[ElementGroup.$domPropName], "ElementGroup") && s[ElementGroup.$domPropName].groupName == grpKey) {
				grouper = s[ElementGroup.$domPropName];
			} else if (BaseObject.is(s[ElementGroup.$domPropName], "Array")) {
				t = s[ElementGroup.$domPropName];
				for (var j = 0; j < t.length; j++) {
					if (BaseObject.is(t[j], "ElementGroup") && t[j].groupName == grpKey) {
						grouper = t[j];
						break;
					} else if (BaseObject.is(t[j], "string") && t[j] == grpKey) {
						toregister.push(s);
						t[j] = null;
						break;
					}
				}
			}
		}
		if (grouper == null) {
			grouper = new ElementGroup();
			grouper.groupName = grpKey;
		}
		grouper.registerElements(toregister);
		return grouper;
	}
	return null;
}
ElementGroup.prototype.obliterate = function () {
    var i;
    if (BaseObject.is(this.elements, "Array")) {
        for (i = 0; i < this.elements.length; i++) {
            this.unRegisterElement(this.elements[i]);
        }
    }
    BaseObject.prototype.obliterate.apply(this, arguments);
};
ElementGroup.prototype.registerElements = function () {
    var o;
    for (var i = 0; i < arguments.length; i++) {
        o = arguments[i];
        if (BaseObject.isJQuery(o) || BaseObject.is(o, "Array")) {
            for (var j = 0; j < o.length; j++) {
                if (o[j] != null) {
                    this.registerElement(o[j]);
                }
            }
        } else if (o.nodeType) {
            this.registerElement(o);
        }
    }
}.Description("Accepts any number of arguments, incl arrays and each element/param is added to the registered elements.");
ElementGroup.prototype.unRegisterElement = function (domEl) {
    if (domEl != null) {
        if (domEl[ElementGroup.$domPropName] != null) domEl[ElementGroup.$domPropName].removeElement(this);
        if (this.elements != null) this.elements.removeElement(domEl);
    }
};
ElementGroup.prototype.registerElement = function (domEl) {
    if (domEl != null) {
        if (domEl[ElementGroup.$domPropName] == null) domEl[ElementGroup.$domPropName] = [];
        domEl[ElementGroup.$domPropName].addElement(this);
        this.elements.addElement(domEl);
    }
};
ElementGroup.prototype.elements = new InitializeArray("Group's elements");
ElementGroup.prototype.add = function () {
    this.registerElements.apply(this, arguments);
};
ElementGroup.prototype.getGroupAsJQuery = function () {
    return $(this.elements);
};
ElementGroup.prototype.concatElements = function (resultIn) {
    var result = (resultIn == null) ? [] : resultIn;
    for (var i = 0; i < this.elements.length; result.addElement(this.elements[i++]));
    return result;
};