function DOMUtilElement(el, bclone) {
	BaseObject.apply(this, arguments);
	if (BaseObject.is(el, "DOMUtilElement")) el = el.get_element();
	this.reInit(el,bclone);
}
DOMUtilElement.Inherit(BaseObject, "DOMUtilElement");
DOMUtilElement.prototype.$element = null;
// Init/reinit, basics
DOMUtilElement.prototype.reInit = function(el, bClone) {
	if (el != null && el instanceof HTMLElement) {
		if (bClone) {
			this.$element = el.cloneNode(true);
		} else {
			this.$element = el;
		}
		return true;
	} else if (typeof el == "string") {
		if (/^[a-zA-Z0-9\_\-]+$/.test(el)) { // treat as tag name
			this.$element = document.createElement(el);
			if (this.$element != null) return true;
		} else { // treat as HTML
			var fr = DOMUtil.fragmentFromHTML(el,true);
			if (fr != null) {
				// Find the first HTMLElement and use it - everything else goes away
				for (var i = 0;i < fr.childNodes.length; i++) {
					if (fr.childNodes[i] instanceof HTMLElement) {
						this.$element = fr.removeChild(fr.childNodes[i]);
						return true;
					}
				}
			}
		}
	} else if (BaseObject.isJQuery(el)) { 
		if (el.length > 0) {
			return this.reInit(el.get(0),bClone);
		}
	} else if (window.DOMMNode && el instanceof DOMMNode) {
		if (el._node != null) return this.reInit(el._node);
	}
	return false;
}

//#region Properties
DOMUtilElement.IsEmpty = function(due) {
	if (BaseObject.is(due, "DOMUtilElement")) {
		return due.get_isempty();
	}
	return true;
}
DOMUtilElement.prototype.get_isempty = function() {
	if (this.$element != null) {
		if (this.$element.childNodes.length > 0) return false;
	}
	return true;
}
DOMUtilElement.prototype.get_haschildren = function() {
	if (this.$element != null) {
		if (this.$element.childNodes.length > 0) {
			for (var i = 0; i < this.$element.childNodes.length; i++) {
				if (this.$element.childNodes[i] instanceof HTMLElement) return true;
			}
		}
	}
	return false;
}
DOMUtilElement.prototype.get_children = function() {
	var result = [];
	if (this.$element == null) return result;
	for (var i = 0; i < this.$element.childNodes.length; i++) {
		if (this.$element.childNodes[i] instanceof HTMLElement) {
			result.push(new DOMUtilElement(this.$element.childNodes[i]));
		}
	}
	return result;
}
DOMUtilElement.prototype.get_clonedchildren = function() {
	var result = [];
	if (this.$element == null) return result;
	for (var i = 0; i < this.$element.childNodes.length; i++) {
		if (this.$element.childNodes[i] instanceof HTMLElement) {
			result.push(new DOMUtilElement(this.$element.childNodes[i], true));
		}
	}
	return result;
}


DOMUtilElement.prototype.get_element = function() {
	return this.$element;
}
// CSS Classes
DOMUtilElement.prototype.get_classes = function() {
	if (this.$element instanceof HTMLElement) {
		return this.$element.className;
	}
	return null;
}
DOMUtilElement.prototype.set_classes = function(v) {
	if (this.$element instanceof HTMLElement) {
		this.$element.className = v;
	}
	return null;
}
DOMUtilElement.prototype.get_text = function() {
	if (this.$element instanceof HTMLElement) {
		return this.$element.textContent;
	}
	return null;
}
DOMUtilElement.prototype.set_text = function(v) {
	if (this.$element instanceof HTMLElement) {
		this.$element.textContent = v;
	}
}
DOMUtilElement.prototype.get_owntext = function() {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.ownText(this.$element);
	}
	return null;
}
DOMUtilElement.prototype.get_rect = function() {
	var GRect = Class("GRect");
	if (this.$element instanceof HTMLElement) {
		return GRect.fromDOMElementOffset(this.$element);
	}
	return GRect.empty();
}
DOMUtilElement.prototype.get_clientrect = function() {
	var GRect = Class("GRect");
	if (this.$element instanceof HTMLElement) {
		return GRect.fromDOMElementClient(this.$element);
	}
	return GRect.empty();
}
//#endregion
DOMUtilElement.prototype.setTextAroundElements = function(text) {
	if (this.$element instanceof HTMLElement) {
		DOMUtil.setTextWithElements(this.$element, text);
	}
}
DOMUtilElement.prototype.clearTextNodes = function(depth) {
	if (this.$element instanceof HTMLElement) {
		DOMUtil.clearTextNodes(this.$element, depth);
	}
}
DOMUtilElement.prototype.setStyle = function(style, val) {
	if (this.$element instanceof HTMLElement) {
		DOMUtil.setStyle(this.$element, style, val);
	}
}
DOMUtilElement.prototype.getStyle = function(style, bComputed) {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.getStyle(this.$element, style, bComputed);
	}
	return null;
}
DOMUtilElement.prototype.addClass = function(cls) {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.addClass(this.$element, cls);
	}
	return null;
}
DOMUtilElement.prototype.removeClass = function(cls) {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.removeClass(this.$element, cls);
	}
	return null;
}
DOMUtilElement.prototype.toggleClass = function(cls) {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.toggleClass(this.$element, cls);
	}
	return null;
}
DOMUtilElement.prototype.countClass = function(cls) {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.countClass(this.$element, cls);
	}
	return 0;
}
// Primitive
/**
 * Gets/sets attribute of the element. When called with val of null - removes the attribute.
 * 
 * @param {String} attrname - the name of the attribute
 * @param {String} val - the value of the attribute. If omitted only returns the attribute's value.
 */
DOMUtilElement.prototype.attr = function(attrname, val) {
	if (this.$element instanceof HTMLElement) {
		if (arguments.length > 1) {
			return DOMUtil.attr(this.$element,attrname,val);
		} else {
			return DOMUtil.attr(this.$element,attrname);
		}
	}
}
/**
 * Gets an object with properties the names of the attributes of the element, containing their values.
 * If pattern (as regular expression) is specified only the matching attributes are included. See pattern 
 * for more details
 * 
 * @param {string|Regexp} pattern - optional parameter, If passed it is converted to a regular expression and only the attributes
 * 							matching it are included. The regular expression can contain a single capturing group, If it does - the
 * 							properties of the resulting object are the values captured and not the whole attribute names.
 * @returns {object} an object containing the attributes of the element with their values. See also pattern.
 */
DOMUtilElement.prototype.getAttributes = function(pattern) {
	if (this.$element instanceof HTMLElement) {
		return DOMUtil.getAttributes(this.$element, pattern);
	}
	return null;
}
// Clonning
DOMUtilElement.prototype.clone = function() {
	if (this.$element != null) {
		return new DOMUtilElement(this.$element.cloneNode(true));
	}
	return new DOMUtilElement();
}
DOMUtilElement.prototype.shallowClone = function() {
	if (this.$element != null) {
		return new DOMUtilElement(this.$element.cloneNode(false));
	}
	return new DOMUtilElement();
}
// DOM management
DOMUtilElement.prototype.add = function(content, how) {
	if (this.$element == null) return false;
	// Inner code
		var me = this;
		function $addNode(v) {
			if (how == null || how == "append") {
				me.$element.appendChild(v);
			} else if (how == "prepend") {
				me.$element.insertBefore(v,me.$element.firstChild);
			} else {
				return false; // No action
			}
			return true;
		}
	// Outer
	var fr;
	if (content != null) {
		if (BaseObject.is(content,"DOMUtilFragment")) {
			return $addNode(content.get_fragment());
		} else if (content instanceof DocumentFragment) {
			return $addNode(content);
		} else if (content instanceof HTMLElement) {
			return $addNode(content);
		} else if (content instanceof NodeList || content instanceof HTMLCollection || BaseObject.is(content,"Array") ) {
			fr = DOMUtil.fragmentFromCollection(content);
			if (fr != null) {
				return $addNode(fr);
			}
		} else if (typeof content === "string") {
			fr = DOMUtil.fragmentFromHTML(content);
			if (fr != null) {
				return $addNode(fr);
			}
		}
	}
	return false;
}
DOMUtilElement.prototype.append = function(content) {
	return this.add(content,"append");
}
DOMUtilElement.prototype.prepend = function(content) {
	return this.add(content,"prepend");
}
DOMUtilElement.prototype.detach = function() {
	DOMUtil.detach(this.$element);
}
// Query selector based
/**
 * 
 * @param {string} selector Optional selector the children must match, * should work like omitting it entirely
 * @returns {Array<HTMLElement>} The children possibly filtered by the selector (if specified)
 */
DOMUtilElement.prototype.children = function(selector) {
	var ch = this.get_children();
	if (ch.length > 0) {
		if (typeof selector === "string" && !/^\s*$/.test(selector)) {
			ch = DOMUtil.filterElements(ch,selector);
		}
	}
	return ch;
}
// 	 Low level - return packed elements or null
DOMUtilElement.prototype.findElements = function(selector, callback) {
	var arr = DOMUtil.findElements(this.$element,selector,callback);
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] instanceof HTMLElement) {
			arr[i] = new DOMUtilElement(arr[i]);
		}
	}
	return arr;
}
DOMUtilElement.prototype.findElement = function(selector, callback) {
	var el = DOMUtil.findElement(this.$element, selector, callback);
	if (el instanceof HTMLElement) {
		return new DOMUtilElement(el);
	}
	return null;
}

DOMUtilElement.prototype.findParent = function(selector, callback) {
	var pel = DOMUtil.findParent(this.$element, selector, callback);
	if (pel instanceof HTMLElement) {
		return new DOMUtilElement(pel);
	}
	return null;
}
// High level - return packed elements
DOMUtilElement.prototype.queryAllByDataKey = function(datakey, clone) {
	var arr = DOMUtil.queryAllByDataKey(this.$element, datakey);
	if (arr != null) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof HTMLElement) {
				arr[i] = new DOMUtilElement(arr[i], clone);
			}
		}
		return arr;
	}
	return [];
}
DOMUtilElement.prototype.queryOneByDataKey = function(datakey, clone) {
	var el = DOMUtil.queryOneByDataKey(this.$element, datakey);
	return new DOMUtilElement(el,clone);
}
DOMUtilElement.prototype.queryOne = function(selector, clone) {
	var el = DOMUtil.queryOne(this.$element, selector);
	return new DOMUtilElement(el,clone);
}
DOMUtilElement.prototype.queryAll = function(selector,clone) {
	var arr = DOMUtil.queryAll(this.$element, selector);
	if (arr != null) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof HTMLElement) {
				arr[i] = new DOMUtilElement(arr[i],clone);
			}
		}
		return arr;
	}
	return [];
}
DOMUtilElement.prototype.parentByDataKey = function(datakey) {
	var pel = DOMUtil.parentByDataKey(this.$element, datakey);
	return new DOMUtilElement(pel);
}


DOMUtilElement.prototype.cloneChildrenAsFragment = function() {
	var arr = [];
	if (this.$element != null) {
		for (var i = 0;i < this.$element.childNodes.length;i++) {
			arr.push(this.$element.childNodes[i].cloneNode(true));
		}
	}
 	return new DOMUtilFragment(arr);
}
DOMUtilElement.prototype.cloneAsFragment = function() {
 	return new DOMUtilFragment(this.$element.cloneNode(true));
}

// BindKraft special
DOMUtilElement.prototype.obliterateDOM = function(bSelfToo) {
	DOMUtil.obliterateDom(this.$element, bSelfToo);
	return this;
}
DOMUtilElement.prototype.Empty = function() {
	DOMUtil.Empty(this.$element);
	return this;
}
DOMUtilElement.prototype.Remove = function() {
	DOMUtil.Remove(this.$element);
	return this;
}
DOMUtilElement.prototype.activeclass = function(typereq) { // Incorrect classes are not returned
	var t = typereq || "Base";
	if (Class.is(t, "Base")) {
		if (BaseObject.is(this.$element.activeClass,t)) return this.$element.activeClass;
	}
	return null;
}


// Statics
DOMUtilElement.appendIn = function(el, content) {
	var domel = new DOMUtilElement(el);
	if (!domel.get_isempty()) {
		return domel.append(content);
	}
	return false;
}
DOMUtilElement.prependIn = function(el, content) {
	var domel = new DOMUtilElement(el);
	if (!domel.get_isempty()) {
		return domel.prepend(content);
	}
	return false;
}