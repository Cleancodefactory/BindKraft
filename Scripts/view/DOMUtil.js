
/**
 * Low level DOM utilities. This will soon be moved into IIFE, please import it to avoid errors when this happens.
 * 
 * Some general principles used in this file:
 * 
 * Border callback: A callback function called to determine if an HTMLElement is a border beyond which the operations 
 * should not be performed. This is widely used across many methods below. The border callback can return 3 kinds of values:
 * true - checked with === it means DO process the element and go no further
 * false - checked with === do NOT process the element and go no further
 * null|undefined - not a border, go further.
 * 
 * 
 */
var DOMUtil = {};
DOMUtil.$defaultTrimRegEx = /^\s*(.*?)\s*$/;
/**
	trim - trims the string
	@param str:string - the string to be trimmed
	@param [re:RegEx] - custom regular expression to use - must have one and only one capturing group, has to be inside ^ ... $
*/
DOMUtil.trim = function (str, re) {
    var tre = re || DOMUtil.$defaultTrimRegEx;
    if (str != null) {
        var m = tre.exec(str);
        if (m != null) {
            return m[1];
        }
    }
    return str;
}
/**
	AddToken - adds the specified token to the tokens in string (separated with delim)
	Designed mainly for strings with unique tokens.
	
	@param str:string - the string with tokens
	@param tkn:string - one ore more tokens to add (separated with the same delim)
	@param [retkn:RegEx] - custom regular expression for tokenization
	@param [delim:string = " "] - Delimiter string
	@return string - the modified string or the same if nothing can be done
	
	@remarks - Works with one or more tokens. Each token is added only if it does not exist in the str.

*/
DOMUtil.addToken = function (str, tkn, retkn, delim) {
		retkn = retkn || /\S+/g;
		delim = delim || " ";
		var str_tokens = (str || "").match(retkn) || [];
		var tkn_tokens = (tkn || "").match(retkn) || [];
		var result = str || "";
		var i,j;

		for (var j = 0; j < tkn_tokens.length; j++) {
			for (i = 0; i < str_tokens.length; i++) {
				if (str_tokens[i] == tkn_tokens[j]) break;
			}
			if (i >= str_tokens.length) result += delim + tkn_tokens[j];
		}
		return this.trim(result);
	};
/**
	removeToken - adds the specified token to the tokens in string (separated with delim)
	@see addToken
	
	@param str:string - the string with tokens
	@param tkn:string - one ore more tokens to add (separated with the same delim)
	@param [retkn:RegEx] - custom regular expression for tokenization
	@param [delim:string = " "] - Delimiter string
	
	@return string - the modified string

*/		
DOMUtil.removeToken = function (str, tkn, retkn, delim) {
    retkn = retkn || /\S+/g;
    delim = delim || " ";
    var str_tokens = (str || "").match(retkn) || [];
    var tkn_tokens = (tkn || "").match(retkn) || [];
    var result = "";
    var j;
    for (var i = 0; i < str_tokens.length; i++) {
        for (j = 0; j < tkn_tokens.length; j++) {
            if (str_tokens[i] == tkn_tokens[j]) break;
        }
        if (j >= tkn_tokens.length) result += delim + str_tokens[i];
    }
    return this.trim(result);
}
/**
 * 
 * @param {*} str 
 * @param {RegExp} tkn 
 * @param {*} retkn 
 * @param {*} delim 
 * @returns 
 */
DOMUtil.removeTokenRegEx = function (str, tkn, retkn, delim) {
    retkn = retkn || /\S+/g;
    delim = delim || " ";
    var str_tokens = (str || "").match(retkn) || [];
    var tkn_token = tkn;
	if (tkn_token instanceof RegExp) {
		var result = "";
		for (var i = 0; i < str_tokens.length; i++) {
			
			if (str_tokens[i] == tkn_token) continue;
			
			if (j >= tkn_tokens.length) result += delim + str_tokens[i];
		}
		return this.trim(result);
	}
}
/**
	tokenCount - counts the tokens that occur in the passed string
	@see addToken
	
	@param str:string - the string with tokens
	@param tkn:string - one ore more tokens to add (separated with the same delim)
	@param [retkn:RegEx] - custom regular expression for tokenization
	@param [delim:string = " "] - Delimiter string
	
	@return number - the number of tokens appearing in str

*/
DOMUtil.countToken = function (str, tkn, retkn, delim) {
    retkn = retkn || /\S+/g;
    delim = delim || " ";
    var str_tokens = (str || "").match(retkn) || [];
    var tkn_tokens = (tkn || "").match(retkn) || [];
    var result = 0;
    var j;
    for (var i = 0; i < str_tokens.length; i++) {
        for (j = 0; j < tkn_tokens.length; j++) {
            if (str_tokens[i] == tkn_tokens[j]) {
                result++;
                break;
            };
        }
    }
    return result;
}
/**
	toggleToken - Toggles the existence of a token in the passed string.
	@see addToken
	Designed to work with strings with unique tokens. In other cases the results may be unpredictable.
	
	@param str:string - the string with tokens
	@param tkn:string - one ore more tokens to add (separated with the same delim)
	@param [retkn:RegEx] - custom regular expression for tokenization
	@param [delim:string = " "] - Delimiter string
	
	@return string - the modified string

*/
DOMUtil.toggleToken = function (str, tkn, retkn, delim) {
    retkn = retkn || /\S+/g;
    delim = delim || " ";
    var found = false;
    var str_tokens = (str || "").match(retkn) || [];
    var tkn_tokens = (tkn || "").match(retkn) || [];
    var result = "";

    for (var i = 0; i < tkn_tokens.length; i++) {
        found = false;
        for (var j = 0; j < str_tokens.length; j++) {
            if (str_tokens[j] == tkn_tokens[i]) {
                str_tokens.splice(j, 1);
                found = true;
                break;
            }
        }
        if (!found) result += delim + tkn_tokens[i];
    }
	var _r = "";
    for (var j = 0; j < str_tokens.length; j++) _r += delim + str_tokens[j];
    return this.trim(_r + result);
}
DOMUtil.addClass = function(el,cls) {
	if (el != null) {
		el.className = DOMUtil.addToken(el.className,cls);
		return el.className;
	}
}
DOMUtil.removeClass = function(el,cls) {
	if (el != null) {
		el.className = DOMUtil.removeToken(el.className,cls);
		return el.className;
	}
}
DOMUtil.removeClassRegEx = function(el, clsRegEx) {
	if (el != null) {
		el.className = DOMUtil.removeClassRegEx(el.className.clsRegEx);
		return el.className;
	}
}
DOMUtil.countClass = function(el,cls) {
	if (el != null) {
		return DOMUtil.countToken(el.className,cls);
	}
	return 0;
}
DOMUtil.toggleClass = function(el,cls) {
	if (el != null) {
		el.className = DOMUtil.toggleToken(el.className,cls);
		return el.className;
	}
}
// Light DOM stuff
DOMUtil.attr = function(el, attrname, val) {
	if (el instanceof HTMLElement && typeof attrname == "string") {
		if (arguments.length > 2) {
			if (val == null) {
				el.removeAttribute(attrname);
			} else {
				el.setAttribute(attrname, val);
			}
			return val;
		} else {
			var r = null;
			if (el.hasAttribute(attrname)) {
				r = el.getAttribute(attrname);
				if (r == null) return "";
				return r;
			}
		}
	}
	return null;
}
DOMUtil.getAttributes = function(el,pattern) {
	var i, attr;
	if (el instanceof Element) {
		var re = null, obj = {};
		if (typeof pattern == "string") {
			re = new RegExp(pattern);
		} else if (pattern instanceof RegExp) {
			re = pattern;
		} else if (pattern != null) {
			throw "Argument pattern must either null, string pattern or predefined RegExp (non-global)";
		}
		var attrs;
		if (re == null) {
			attrs = el.attributes;
			for (i = 0; i < attrs.length; i++) {
				attr = attrs[i];
				obj[attr.name] = attr.value;
			}
		} else {
			if (re.global) re = new RegExp(re.source);
			attrs = el.attributes;
			var match;
			for (i = 0; i < attrs.length; i++) {
				attr = attrs[i];
				re.lastIndex = 0;
				match = re.exec(attr.name);
				if (match != null) {
					if (match.length > 1 && match[1] != null && match[1].length > 0) {
						obj[match[1]] = attr.value;
					} else {
						obj[match[0]] = attr.value;
					}
				}
				
			}
		}
		return obj;
	} else if (el instanceof NodeList || el instanceof HTMLCollection) {
		var oattrs,_arr = [];
		for (i = 0;i < el.length; i++) {
			oattrs = DOMUtil.getAttributes(el[i],pattern);
			if (BaseObject.is(oattrs, "object")) {
				_arr.push(oattrs);
			}
		}
		return _arr;
	}
	return null;
}
// Helpers
DOMUtil.arrayFrom = function(nodes) {
	var i, arr = [];
	if (nodes instanceof NodeList || nodes instanceof HTMLCollection) {
		for (i = 0; i < nodes.length;i++) {
			if (nodes[i] instanceof HTMLElement) {
				arr.push(nodes[i]);
			}
		}
	}
	return arr;
}
// Nodes
DOMUtil.detach = function(node) {
	var i;
	if (node instanceof HTMLElement) {
		if (node.parentElement instanceof HTMLElement) {
			try {
				return node.parentElement.removeChild(node);
			} catch (e) {
				return node;
			}
		}
	} else if (node instanceof NodeList || node instanceof HTMLCollection) {
		var nodes = DOMUtil.arrayFrom(node);
		for (i = 0; i < nodes.length; i++) {
			DOMUtil.detach(nodes[i]);
		}
		return node;
	}
	return node;
}
DOMUtil.$obliterateDom = function(dom) {
	var arr;
	if (dom instanceof HTMLElement) {
		arr = JBUtil.domrefproperties.split(",");
        for (var i = 0; i < arr.length; i++) {
            BaseObject.obliterate(dom[arr[i].trim()]); // Obliterates jbclasses in those propes (arrays of classes as well)
        }
        if (JBUtil.domdestructors != null) {
            for (var k in JBUtil.domdestructors) {
                if (typeof JBUtil.domdestructors[k] == "function") {
                    JBUtil.domdestructors[k](dom);
                }
            }
        }
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList) {
		arr = DOMUtil.arrayFrom(dom);
		for (var i = 0;i< arr.length;i++) {
			this.$obliterateDom(arr[i]);
		}
	}
}

DOMUtil.obliterateDom = function(dom, bAndSelf) { // public, recursive
	var i;
	if (dom instanceof HTMLElement) {
		for (i = 0; i < dom.childNodes.length;i++) {
			var node = dom.childNodes[i];
			if (node instanceof HTMLElement) {
				DOMUtil.obliterateDom(node, true);
			}
		}
		if (bAndSelf) {
			DOMUtil.$obliterateDom(dom);
		}
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList) {
		for (i = 0; i < dom.length; i++) {
			DOMUtil.obliterateDom(dom[i], bAndSelf);
		}		
	}
}
DOMUtil.empty = function(dom) {
	var i;
	if (dom instanceof HTMLElement) {
		while (dom.firstChild) {
			dom.removeChild(dom.firstChild);
		}
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList) {
		var arr = Array.createCopyOf(dom);
		for (i = 0; i < arr.length; i++) {
			DOMUtil.empty(arr[i]);
		}		
	}
}
DOMUtil.Empty = function(dom) {
	DOMUtil.obliterateDom(dom);
	DOMUtil.empty(dom);
}
DOMUtil.remove = function(dom) {
	var i;
	DOMUtil.empty(dom);
	if (dom instanceof HTMLElement) {
		DOMUtil.detach(dom);
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList) {
		var arr = Array.createCopyOf(dom);
		for (i = 0; i < arr.length; i++) {
			DOMUtil.remove(arr[i]);
		}		
	}
}
DOMUtil.Remove = function(dom) {
	DOMUtil.obliterateDom(dom);
	DOMUtil.remove(dom);
}
// Node functionality (search etc.)
/* Should not be used - does not honor BK borders
DOMUtil.closestParent = function(dom, selector, bAndSelf) {
	if (dom instanceof HTMLElement) {
		if (bAndSelf) {
			if (dom.matches(selector)) {
				return dom;
			}
		}
		var p = dom.parentElement;
		while (p != null && p instanceof HTMLElement) {
			if (p.matches(selector)) return p;
			p = p.parentElement;
		}
	}
	return null;
}
*/
//#region Element(s) operation
DOMUtil.ownText = function(dom) {
	var i;
	if (dom instanceof HTMLElement) {
		var s = ""
		for (i = 0; i < dom.childNodes.length; i++) {
			if (dom.ChildNodes[i].nodeType == 3) {
				s += dom.ChildNodes[i].textContent;
			}
		}
		return s;
	} else if (dom instanceof Node) {
		return dom.textContent;
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		var s = "";
		for (i = 0; i < dom.length; i++) {
			if (dom[i] instanceof HTMLElement) {
				s += this.ownText(dom[i]);
			}
		}
		return s;
	}
	return "";
}
DOMUtil.clearTextNodes = function(dom, depth) {
	depth = depth || 0;
	var i;
	if (dom instanceof HTMLElement) {
		var nodes = [];
		for (i = 0; i < dom.childNodes.length; i++) {
			if (dom.childNodes[i].nodeType == 3) {
				nodes.push(dom.childNodes[i]);
			}
		}
		for (i = nodes.length - 1; i >= 0; i--) {
			try {
				dom.removeChild(nodes[i]);
			} catch (e) {	}
		}
		depth --;
		if (depth < 0) return;
		for (i = 0; i < dom.childNodes.length; i++) {
			if (dom instanceof HTMLElement) {
				this.clearTextNodes(dom.childNodes[i],depth - 1);
			}
		}
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		for (i = 0; i < dom.length; i++) {
			if (dom[i] instanceof HTMLElement) {
				this.clearTextNodes(dom[i], depth);
			}
		}
	}
}
DOMUtil.setTextWithElements = function(dom, text) {
	if (dom instanceof HTMLElement) {
		DOMUtil.clearTextNodes(dom,0);
		if (typeof text == "string") {
			var res = String.parseSplit(text, /\{(?:(\w+):)?(\d+)\}/g, function(o) {
				var x, tag, nodematch;
				if (o.separator != null) {
					if (o.separator[1] != null) {
						tag = o.separator[1];
						x = parseInt(o.separator[2],10);
						// not using xpath because of IE
						nodematch = -1;
						for (var i = 0; i < dom.childNodes.length; i++) {
							if (dom.childNodes[i].tagName && dom.childNodes[i].tagName.toLowerCase() == tag) {
								nodematch++;
								if (nodematch == x) {
									return dom.childNodes[i];
								}
							}
						}
						return null;
					} else {
						x = parseInt(o.separator[2],10);
						if (x >= 0 && x < dom.childNodes.length) {
							return dom.childNodes[x];
						} else {
							return null;
						}
					}
				} else {
					return null;
				}
			});
			if (res.length > 0) {
				for (var j = 0;j < res.length; j++) {
					var r = res[j];
					if (r.separator == null) {
						dom.appendChild(document.createTextNode(r.part));
					} else if (r.separator instanceof HTMLElement) {
						dom.insertBefore(document.createTextNode(r.part),r.separator);
					}
				}
			} else {
				dom.textContent = text;
			}
		}
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		for (i = 0; i < dom.length; i++) {
			if (dom[i] instanceof HTMLElement) {
				this.setTextWithElements(dom[i], text);
			}
		}
	}
}
/**
 * @param {HTMLElement|NodeList|HTMLCollection|Array<HTMLElement>} dom
 * @param {object|string} style - Either css attribute name or object with multiple attribute with values
 * @param {string} val - Optional, required if style is string. The value to set to the style attribute.
 * 
 * The style name(s) are in the CSS syntax and not the style property syntax e.g.
 * DOMUtil.setStyle(el, "background-color", "#DDDDDD")
 * DOMUtil.setStyle(el, {"background-color", "#DDDDDD" })
 */
DOMUtil.setStyle = function(dom, style, val) {
	if (dom instanceof HTMLElement) {
		if (typeof style == "string") {
			dom.style.setProperty(style, val);
			return true;
		} else if (typeof style == "object") {
			for (var key in style) {
				if (style.hasOwnProperty(key)) {
					this.setStyle(dom, key, style[key]);
				}
			}
			return true;
		}
		return false;
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		for (var i = 0; i < dom.length; i++) {
			if (dom[i] instanceof HTMLElement) {
				if (!this.setStyle(dom[i], style, val)) return false;
			}
		}
		return true;
	}
	return false;
}

DOMUtil.getStyle = function(dom, style, bComputed) {
	if (dom instanceof HTMLElement) {
		if (typeof style == "string") {
			var cssdecl = null;
			if (bComputed) {
				cssdecl = window.getComputedStyle(dom);
			} else {
				cssdecl = dom.style;
			}
			return cssdecl.getProperty(style);
		} else if (typeof style == "object") {
			var result = {};
			for (var key in style) {
				if (style.hasOwnProperty(key)) {
					result[key] = this.getStyle(dom, key, bComputed);
				}
			}
			return result;
		}
		return null;
	}
}
DOMUtil.hideElement = function(dom) {
	if (!(dom instanceof HTMLElement)) return;
	var result = false;
	var _displ = dom.style.display;
	if (_displ != "none") { result = true;}
	dom.style.display = "none";
	if (_displ != null && _displ.length != 0 && _displ != "none") {
		dom.__lastStyleDisplay = _displ;
	} else {
		delete dom.__lastStyleDisplay;
	}
	return result;	
}
DOMUtil.unHideElement = function(dom) {
	if (!(dom instanceof HTMLElement)) return;
	var result = false;
	var _curdispl = dom.style.display;
	if (_curdispl == "none") {
		result = true;
	}
	var _displ = null;
	if (dom.__lastStyleDisplay != null && dom.__lastStyleDisplay.length > 0 && dom.__lastStyleDisplay != "none") {
		_displ = dom.__lastStyleDisplay;
	} else {
		_displ = "";
	}
	dom.style.display = _displ;
	return result;
}
//#endregion
/**
	Checks if the element or set of elements all match a selector or at least one of the selectors (if array of
	selectors is supplied

	@param dom {HTMLElement|NodeList|HTMLCollection|Array<HTMLElement>} - single or set of elements - only HTMLElement-s are processed, the others will never pass.
	@param selector {string|Array<string>} - selector to test against
	@returns {boolean} - true if all the elements match the selector
*/
DOMUtil.matchesSelector = function(dom, selector) {
	var i;
	if (dom instanceof HTMLElement) {
		if (typeof selector == "string") {
			if (dom.matches(selector)) return true;
		} else if (BaseObject.is(selector, "Array")) {
			for (i = 0; i < selector.length; i++) {
				if (dom.matches(selector[i])) return true;
			}
		}
		return false;
		
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		for (i = 0; i < dom.length; i++) {
			if (dom[i] instanceof HTMLElement) {
				if (!this.matchesSelector(dom[i], selector)) return false;
			}
		}
		return true;
	}
}

/**
	@param dom* {NodeList|HTMLCollection|Array<HTMLElement>}	- set of elements - only HTMLElement-s are processed, the others will never pass.
	@param dom** {HTMLElement} - Single element.
	@param selector {string} - (optional) CSS selector, any element matches if omitted or null (useful for filtering by node type).
	@param elType {object} (optional) Type to filter, HTMLElement is assumed if omitted. Example types: Node, Element, HTMLElement 
	
	@returns in case * the dom element if it matches the selector, otherwise null. in case ** an array of the elements that match the selector
*/
DOMUtil.filterElements = function(dom,selector,elType) {
	var _ElementType = elType || HTMLElement;
	if (dom instanceof _ElementType) {
		if (selector == null || dom.matches(selector)) {
			return dom;
		}
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		var el,result = [];
		for (var i = 0; i < dom.length; i++) {
			if (dom[i] instanceof _ElementType) {
				el = this.filterElements(dom[i], selector,_ElementType);
				if (el) result.push(el);
			}
		}
		return result;
	}
	return null;
}
DOMUtil.cloneElements = function(dom, elType) {
	var _ElementType = elType || HTMLElement;
	if (dom instanceof _ElementType) {
		return dom.cloneNode(true);
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		var el,result = [];
		for (var i = 0; i < dom.length; i++) {
			if (dom[i] instanceof _ElementType) {
				el = this.cloneElements(dom[i], _ElementType);
				if (el) result.push(el);
			}
		}
		return result;
	}
	return null;
}
/**
	Slower than querySelector, but will honor borders throughly.
	Searches by selector from element or set of elements up to the borders defined by the callback.
	
	@param dom {HTMLElement|NodeList|HTMLCollection|Array<HTMLElement>}
	@param selector {string} - CSS selector
	@param callback {callback} - callback(node) that can return:
				false - to stop the recursion before processing the node
				true  - to stop the recurstion after processing the node
				undefined - permit further processing
	@param _result  {accumulator} - usually not passed from outside - recursion accumulator
	@param _nonroot {boolean-like} - internally used in recursion
	
	@returns {Array<HTMLElement>} - an array of the found elements
*/
DOMUtil.findElements = function(dom,selector,callback, _result, _nonroot) { // callback(node) -> false => stop
	var result = _result|| [];
	var b;
	var inroot = _nonroot?false:true;
	if (dom instanceof HTMLElement) {
		b = null;
		if (callback != null && (b = callback(dom, inroot)) === false) return result; // Skip this branch
		if (dom.matches(selector)) {
			result.push(dom);
		}
		if (b === true) return result;
		if (dom.children != null && dom.children.length > 0) {
			DOMUtil.findElements(dom.children,selector,callback, result, true);
		}
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList || BaseObject.is(dom, "Array")) {
		for (var i = 0; i < dom.length; i++) {
			DOMUtil.findElements(dom[i],selector,callback, result, _nonroot);
		}
	} else if (dom instanceof Document) {
		return DOMUtil.findElements(dom.body, selector, callback, _nonroot);
	}
	return result;
}
/**
 * @param dom 		{*}			dom element or a collection of such to start from
 * @param selector	{string}	selector to search for
 * @param callback  {function}	
 * @param _nonroot	{boolean-like}	Do not pass this argument, it is passed internally in recursions
 * 									and specifies when the current element is not the root element
 */
DOMUtil.findElement = function(dom, selector, callback, _nonroot) { // callback(node) -> false => stop
	var el;
	var b;
	var inroot = _nonroot?false:true;
	if (dom instanceof HTMLElement) {
		b = null;
		if (callback != null && (b = callback(dom,inroot)) === false) return null; // Skip this branch
		if (dom.matches(selector)) {
			return dom;
		}
		if (b === true) return null;
		if (dom.children != null && dom.children.length > 0) {
			return DOMUtil.findElement(dom.children,selector,callback, true);
		}
		return null;
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList || BaseObject.is(dom, "Array")) {
		for (var i = 0; i < dom.length; i++) {
			el = DOMUtil.findElement(dom[i],selector,callback, _nonroot);
			if (el != null) return el;
		}
	} else if (dom instanceof Document) {
		return DOMUtil.findElement(dom.body,selector, callback);
	}
	return null;
}
/**
 * Looks for a parent specified by the selector and returns it. If a border of a view is hit 
 * or otherwise the parent is not found null is returned.
 * 
 * @param dom {HTMLElement} - the element whose parent to find
 * @param selector {string|HTMLElement} - the parent to find - string selector or an element 
 * 					to check if it is a parent of dom
 * @param callback {function} - Border callback
 * 
 */
DOMUtil.findParent = function(dom, selector, callback) {
	var b;
	if (dom instanceof HTMLElement) {
		b = null;
		if (callback != null && (b = callback(dom)) === false) return null;
		if (selector instanceof HTMLElement && dom == selector) return dom;
		if (typeof selector == "string" && dom.matches(selector)) {
			return dom;
		}
		if (b === true) return null;
		var p = dom.parentElement;
		while (p != null && p instanceof HTMLElement) {
			b = null;
			if (callback != null && (b = callback(dom)) === false) return null;
			if (selector instanceof HTMLElement && p == selector) return p;
			if (typeof selector == "string" && p.matches(selector)) {
				return p;
			}
			p = p.parentElement;
			if (b === true) return null;
		}
	}
	return null;
}
/**
	Creates a DocumentFragment from the HTML text. Only the root level HTMLElement-s are included.
*/
DOMUtil.fragmentFromHTML = function(html,bNoFilter) {
	var fr = document.createDocumentFragment();
	var div = document.createElement("div");
	// We keep the div in a fragment that will be forgotten later
	// this is a little precaution for suspected bugs in some older browsers
	fr.appendChild(div);
	div.innerHTML = html;
	var r = document.createDocumentFragment();
	// The original may contain text nodes, so we copy at Node level
	var n;
	while (n = div.firstChild) {
		if (n instanceof HTMLElement || bNoFilter) {
			r.appendChild(n);
		} else {
			div.removeChild(n); // In order the cycle to progress further
		}
	}
	return r;
}
DOMUtil.fragmentFromCollection = function(coll,bClone) {
	if (coll instanceof HTMLCollection || coll instanceof NodeList || BaseObject.is(coll, "Array")) {
		var fr = document.createDocumentFragment();
		for (var i = coll.length; i >= 0; i--) {
			if (coll[i] instanceof HTMLElement) {
				if (bClone) {
					fr.insertBefore(coll[i].cloneNode(true), fr.firstChild);
				} else {
					fr.insertBefore(coll[i], fr.firstChild);
				}
			}
		}
		return fr;
	}
	return null;
}
/**
	Cleans the given fragment from root level non HTMLElement nodes.
*/
DOMUtil.cleanupDOMFragment = function(frg) {
	var i;
	if (frg instanceof DocumentFragment) {
		var nodes = [];
		for (i=0; i<frg.childNodes.length;i++) nodes.push(frg.childNodes[i]);
		for (i=0; i < nodes.length; i++) {
			if (!(nodes[i] instanceof HTMLElement)) {
				try {
					frg.removeChild(nodes[i]);
				} catch(ex) {
					// Just skipping potential errors
				}
			}
		}
	}
	return frg;
}

// Ready to call for frequent scenarios

DOMUtil.filterAllByDataKey = function(node, datakey) {
	return DOMUtil.filterElements(node, '[data-key="' + datakey + '"]');
}
DOMUtil.queryAllByDataKey = function(node, datakey) {
	return DOMUtil.findElements(node, '[data-key="' + datakey + '"]',DOMUtil.BorderCallbacks.DataKeysInViewIn);
}
DOMUtil.queryOneByDataKey = function(node, datakey) {
	return DOMUtil.findElement(node, '[data-key="' + datakey + '"]',DOMUtil.BorderCallbacks.DataKeysInViewIn);
}
DOMUtil.queryOne = function(node, selector) {
	if (arguments.length > 1) {
		return DOMUtil.findElement(node, selector,DOMUtil.BorderCallbacks.DataKeysInViewIn);
	} else {
		selector = node;
		return DOMUtil.findElement(document.body, selector,DOMUtil.BorderCallbacks.DataKeysInViewIn);
	}
}
DOMUtil.queryAll = function(node, selector) {
	if (arguments.length > 1) {
		return DOMUtil.findElements(node, selector,DOMUtil.BorderCallbacks.DataKeysInViewIn);
	} else {
		selector = node;
		return DOMUtil.findElements(document.body, selector,DOMUtil.BorderCallbacks.DataKeysInViewIn);
	}
}
DOMUtil.parentByDataKey = function(node, datakey) {
	return DOMUtil.findParent(node, '[data-key="' + datakey + '"]',DOMUtil.BorderCallbacks.DataKeysInViewOut);
}
DOMUtil.hasParent = function(node, dparent) {
	return DOMUtil.findParent(node, dparent, DOMUtil.BorderCallbacks.DataKeysInViewOut);
}
DOMUtil.queryForMainSlot = function(node) {
	return DOMUtil.findElement(node, '[data-key="_client"]',DOMUtil.BorderCallbacks.DataKeysInViewOut);
}
/**
	Combined "standard" search for slots in a window template
	data-key=_client -> main slot
*/
DOMUtil.querySlots = function(node) {
	var result = {
		main: null,
		named: {},
		nonamed: true // helps to check fast if there are any named slots found
	};
	// Lookup the main slot
	var el = DOMUtil.findElement(node, '[data-key="_client"]',DOMUtil.BorderCallbacks.DataKeysInViewOut);
	if (el != null) result.main = el;
	// Find the rest
	var arr = DOMUtil.findElements(node, '[data-sys-client="true"]',DOMUtil.BorderCallbacks.WindowSlotsIn);
	var n;
	// set in el the first found
	el = null;
	for (var i = 0; i < arr.length; i++) {
		el = arr[i];
		if (arr[i].matches('[data-key]')) {
			n = arr[i].getAttribute("data-key");
			if (typeof n == "string" && !/^\s*$/.test(n)) {
				if (n != "_client") { // This one should be found already if it exists and put in the main slot
					result.nonamed = false;
					result.named[n] = arr[i];
				}
			}
		} else { // has no name - if there is no main slot already - put it there
			if (result.main == null) { // First found only
				result.main  = arr[i];
			}			
		}
	}
	// if after all this we have not found main slot use the first found
	if (result.main == null) result.main = el;
	return result;
	
}



// Border callbacks
/*
	Borders
	~~~~~~~
	
	- Template border
	dom.getAttribute("data-template-root") != null
	dom.activeClass is ITemplateRoot
	
	- Component border
	dom.activeClass is IUIControl
	
	- data contextual
	dom.dataContext != null
	dom.hasDataContext == true;
	
	
	
	dom.activeClass - Base+
	
	dom.

*/
DOMUtil.BorderIndicator = {
	templateRoot: function(node) {
		if (JBUtil.isTemplateRoot(node)) return true;
	},
	controlRoot: function(node) {
		return BaseObject.is(node.activeClass, "IUIControl");
	},
	dataContextRoot: function(node) {
		return (node.dataContext != null || node.hasDataContext);
	}
};

// DOMUtil.findElements callbacks
/* Extended from time to time
	They return 
	undefined - no opinion
	false - stop without processing the node
	true  - process this node and stop
*/
/**
 * Produces a callback with parameters used by them as memory/aggregate
 * The parameters could be extended, but the order will be kept.
 * @param {integer} depth Maximum depth
 */
DOMUtil.DynamicCallbacks = function(name, depth) {
	var $parameters = {
		depth: depth
	};
	switch (name) {
		case "depth":
			// We do not check - we "believe" - too many checking has its dark sides too.
			return function(node, inroot) {
				if ($parameters.depth <= 0) return false;
				$parameters.depth--;
			}
		break;
		default:
			throw "Unknown callback";
	}

}
DOMUtil.BorderCallbacks = {
	// This one is a bit questionable
	WindowSlotsIn: function(node, inroot) { // window template from root, do not enter template borders and IUIControl-s
		var indicator = DOMUtil.BorderIndicator;
		if (indicator.templateRoot(node) && !inroot) return false; // Templates are put in slots - they are not ours
		if (indicator.controlRoot(node)) return false; // Enclosed controls are not enclosed :)
		// undefined - permitted.
	},
	// used for search toward the leaves
	DataKeysInViewIn: function(node, inroot) {
		var indicator = DOMUtil.BorderIndicator;
		if (indicator.templateRoot(node) && !inroot) return false; // Templates are put in slots - they are not ours
		if (indicator.controlRoot(node) && !inroot) return true; // Enclosed controls are not enclosed :)
	},
	// used for search toward the root
	DataKeysInViewOut: function(node, inroot) {
		var indicator = DOMUtil.BorderIndicator;
		if (indicator.templateRoot(node)) return true; // Templates are put in slots - they are not ours
		if (indicator.controlRoot(node)) return true; // Enclosed controls are not enclosed :)
	}
	// The commented code below is for conversation purposes - will be removed when the standard set is completed
	/*
	templateRoot: function(node) {
		if (JBUtil.isTemplateRoot(node)) return false;
	},
	controlBorder: function(node) {
		var he = DOMUtil.toDOMElement(node); // HTMLElement
		if (he != null) {
			if (BaseObject.is(he,"IUIControl")) return false;
		}
	},
	dataContext: function(node) {
		var he = DOMUtil.toDOMElement(node); // HTMLElement
		if (he != null) {
			if (he.dataContext != null || he.hasDataContext) return false;
		}
	},
	parentKeyBorder: function(node) {
		var he = DOMUtil.toDOMElement(node); // HTMLElement
		if (he != null) {
			var ac = he.activeClass;
			if (BaseObject.is(ac, "ITemplateRoot")) return true;
			if (he.getAttribute("data-template-root") != null) return true;
			if (BaseObject.is(ac, "IUIControl")) return true;
		}
	},
	childKeyBorder: function(node) {
	}
	*/
	/*
	,
	workBorder: function(node) {
		var f = DOMUtil.BorderCallbacks.templateRoot(node);
		if (typeof f != "boolean") {
			f = DOMUtil.BorderCallbacks.controlBorder
		}
	}
	*/
};


// Convertors
DOMUtil.toDOMElement = function(inp) {
	var i;
	if (BaseObject.isJQuery(inp)) {
		if (inp.length >= 1) {
			return inp.get(0);
		} else {
			return null;
		}
	} else if (inp instanceof HTMLElement) {
		return inp;
	} else if (inp instanceof HTMLCollection || inp instanceof NodeList) {
		if (inp.length > 0) {
			return inp[0];
		}
	} 
	if (window.DOMMNode && inp instanceof DOMMNode) {
		return inp._node;
	}
	return null;
}
DOMUtil.toDOMM = function(inp) {
	if (!window.DOMMNode) return null;
	var i, arr;
	if (BaseObject.isJQuery(inp)) {
		arr =[];
		if (inp.length == 1) {
			return new DOMMNode(inp.get(0));
		} else {
			for (i =0; i < inp.length; i++) {
				arr.push(inp.get(i));
			}
			return new DOMMCollection(arr);
		}
	} else if (inp instanceof HTMLElement) {
		return new DOMMNode(inp);
	} else if (inp instanceof HTMLCollection || inp instanceof NodeList) {
		arr =[];
		for (i =0; i < inp.length;i++) {
			arr.push(inp[i]);
		}
		return new DOMMCollection(arr);
	} else {
		return new DOMMCollection();
	}
};
