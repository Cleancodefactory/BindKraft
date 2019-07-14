function DOMUtilElement(el, bclone) {
	BaseObject.apply(this, arguments);
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
DOMUtilElement.prototype.get_isempty = function() {
	return (this.$element != null);
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
DOMUtilElement.prototype.attr = function(attrname, val) {
	if (this.$element instanceof HTMLElement) {
		if (argumens.length > 1) {
			return DOMUtil.attr(this.$element,attrname,val);
		} else {
			return DOMUtil.attr(this.$element,attrname);
		}
	}
}
// Clonning
DOMUtilElement.prototype.clone = function() {
	if (this.$element != null) {
		return new DOMUtilElement(this.$element.cloneNode(true));
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
// Query selector
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
DOMUtilElement.prototype.queryAllByDataKey = function(datakey) {
	var arr = DOMUtil.queryAllByDataKey(ths.$element, datakey);
	if (arr != null) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof HTMLElement) {
				arr[i] = new DOMUtilElement(arr[i]);
			}
		}
		return arr;
	}
	return [];
}
DOMUtilElement.prototype.queryOneByDataKey = function(datakey) {
	var el = DOMUtil.queryOneByDataKey(this.$element, datakey);
	return new DOMUtilElement(el);
}
DOMUtilElement.prototype.queryOne = function(selector) {
	var el = DOMUtil.queryOne(this.$element, selector);
	return new DOMUtilElement(el);
}
DOMUtilElement.prototype.queryAll = function(selector) {
	var arr = DOMUtil.queryAll(this.$element, selector);
	if (arr != null) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof HTMLElement) {
				arr[i] = new DOMUtilElement(arr[i]);
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

// BindKraft special
DOMUtilElement.prototype.obliterateDOM = function(bSelfToo) {
	DOMUtil.obliterateDom(this.$element, bSelfToo);
}
DOMUtilElement.prototype.Empty = function() {
	DOMUtil.Empty(this.$element);
}
DOMUtilElement.prototype.Remove = function() {
	DOMUtil.Remove(this.$element);
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