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
			DOMUtil.obliterateDom(dom[i]);
		}		
	}
}
DOMUtil.empty = function(dom) {
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
/**
	@param dom* {NodeList|HTMLCollection|Array<HTMLElement>}	- set of elements - only HTMLElement-s are processed, the others will never pass.
	@param dom** {HTMLElement} - Single element.
	@param selector {string} - CSS selector
	
	@returns in case * the dom element if it matches the selector, otherwise null. in case ** an array of the elements that match the selector
*/
DOMUtil.filterElements = function(dom,selector) {
	if (dom instanceof HTMLElement) {
		if (dom.matches(selector)) {
			return dom;
		}
	} else if (dom instanceof NodeList || dom instanceof HTMLCollection || BaseObject.is(dom, "Array")) {
		var el,result = [];
		for (var i = 0; i < dom.length; i++) {
			if (dom[i] instanceof HTMLElement) {
				el = this.filterElements(dom[i]);
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
	
	@returns {Array<HTMLElement>} - an array of the found elements
*/
DOMUtil.findElements = function(dom,selector,callback, _result) { // callback(node) -> false => stop
	var result = _result|| [];
	var b;
	if (dom instanceof HTMLElement) {
		b = null;
		if (callback != null && (b = callback(dom)) === false) return result; // Skip this branch
		if (dom.matches(selector)) {
			result.push(dom);
		}
		if (b === true) return result;
		if (dom.children != null && dom.children.length > 0) {
			DOMUtil.findElements(dom.children,selector,callback, result);
		}
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList || BaseObject.is(dom, "Array")) {
		for (var i = 0; i < dom.length; i++) {
			DOMUtil.findElements(dom[i],selector,callback, result);
		}
	}
	return result;
}
DOMUtil.findElement = function(dom,selector,callback) { // callback(node) -> false => stop
	var el;
	var b;
	if (dom instanceof HTMLElement) {
		b = null;
		if (callback != null && (b = callback(dom)) === false) return null; // Skip this branch
		if (dom.matches(selector)) {
			return dom;
		}
		if (b === true) return null;
		if (dom.children != null && dom.children.length > 0) {
			return DOMUtil.findElement(dom.children,selector,callback);
		}
		return null;
	} else if (dom instanceof HTMLCollection || dom instanceof NodeList || BaseObject.is(dom, "Array")) {
		for (var i = 0; i < dom.length; i++) {
			el = DOMUtil.findElement(dom[i],selector,callback);
			if (el != null) return el;
		}
	}
	return null;
}
DOMUtil.findParent = function(dom, selector, callback) {
	var b;
	if (dom instanceof HTMLElement) {
		b = null;
		if (callback != null && (b = callback(dom)) === false) return null;
		if (dom.matches(selector)) {
			return dom;
		}
		if (b === true) return null;
		var p = dom.parentElement;
		while (p != null && p instanceof HTMLElement) {
			b = null;
			if (callback != null && (b = callback(dom)) === false) return null;
			if (p.matches(selector)) return p;
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
		for (var i = coll.lenght; i >= 0; i--) {
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

DOMUtil.queryAllByDataKey = function(node, datakey) {
	return DOMUtil.findElements(node, '[data-key="' + datakey + '"]',DOMUtil.BorderCallbacks.DataKeysInViewIn);
}
DOMUtil.queryOneByDataKey = function(node, datakey) {
	return DOMUtil.findElement(node, '[data-key="' + datakey + '"]',DOMUtil.BorderCallbacks.DataKeysInViewIn);
}
DOMUtil.queryOne = function(node, selector) {
	return DOMUtil.findElement(node, selector,DOMUtil.BorderCallbacks.DataKeysInViewIn);
}
DOMUtil.queryAll = function(node, selector) {
	return DOMUtil.findElements(node, selector,DOMUtil.BorderCallbacks.DataKeysInViewIn);
}
DOMUtil.parentByDataKey = function(node, datakey) {
	return DOMUtil.findParent(node, '[data-key="' + datakey + '"]',DOMUtil.BorderCallbacks.DataKeysInViewOut);
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
			if (typeof n == "string") {
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
		return (he.dataContext != null || he.hasDataContext);
	}
};

// DOMUtil.findElements callbacks
/* UNDER CONSTRUCTION
	They return 
	undefined - no opinion
	false - stop without processing the node
	true  - process this node and stop
*/
DOMUtil.BorderCallbacks = {
	WindowSlotsIn: function(node) { // window template from root, do not enter template borders and IUIControl-s
		var indicator = DOMUtil.BorderIndicator;
		if (indicator.templateRoot(node)) return false; // Templates are put in slots - they are not ours
		if (indicator.controlRoot(node)) return false; // Enclosed controls are not enclosed :)
		// undefined - permitted.
	},
	DataKeysInViewIn: function(node) {
		var indicator = DOMUtil.BorderIndicator;
		if (indicator.templateRoot(node)) return true; // Templates are put in slots - they are not ours
		if (indicator.controlRoot(node)) return true; // Enclosed controls are not enclosed :)
	},
	DataKeysInViewOut: function(node) {
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
