function DOMUtilElement(el, bclone) {
	BaseObject.apply(this, arguments);
	this.reInit(el,bclone);
}
DOMUtilElement.Inherit(BaseObject, "DOMUtilElement");
DOMUtilElement.prototype.$element = null;
DOMUtilElement.prototype.clone = function() {
	if (this.$element != null) {
		return new DOMUtilElement(this.$element.cloneNode(true));
	}
	return new DOMUtilElement();
}
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