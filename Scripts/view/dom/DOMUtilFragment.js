function DOMUtilFragment(fragment, singleroot) {
	BaseObject.apply(this,arguments);
	if (typeof fragment == "boolean" && fragment == true) {
		this.$singleroot = true;
	} else if(BaseObject.is(fragment, "DOMUtilFragment")) {
		return fragment.clone();
	} else { 
		this.set_fragment(fragment);
		this.$singleroot = (singleroot?true:false);
	}
}
DOMUtilFragment.Inherit(BaseObject,"DOMUtilFragment");
DOMUtilFragment.prototype.$fragment = null;
DOMUtilFragment.prototype.$singleroot = false;
DOMUtilFragment.prototype.clone = function() {
	var fr = (this.$fragment != null)?this.$fragment.cloneNode(true):null;
	return new DOMUtilFragment(fr, this.$singleroot);
}
DOMUtilFragment.prototype.get_fragment = function() {
	return this.$fragment;
}
DOMUtilFragment.prototype.checkSingleRoot = function(fragment) {
	if (!this.$singleroot) return;
	if (fragment != null && fragment instanceof DocumentFragment) {
		if (fragment.childNodes.length > 1) throw "This instance of DOMUtilFragment has single root set and would not accept fragments with more than one root HTML elemens";
	}
}
DOMUtilFragment.prototype.set_fragment = function(v) {
	if (typeof v === "string") {
		this.$fragment = DOMUtil.fragmentFromHTML(v);
	} else if (v instanceof DocumentFragment) {
		this.$fragment = DOMUtil.cleanupDOMFragment(v);
	} else if (v == null) {
		this.$fragment = null; // clean up
	} else if (v instanceof HTMLElement || v instanceof HTMLCollection || v instanceof NodeList || BaseObject.is(v,"Array")) {
		this.$fragment = document.createDocumentFragment();
		if (this.add(v)) { // Add makes checks for single root so avoid duplicate checks
			return this.$fragment;
		}
		this.$fragment = null; // Unsuccessful content addition will leave empty fragment we do not want to keep for prolonged periods.
	}
	this.checkSingleRoot(this.$fragment);
	return this.$fragment;
}
DOMUtilFragment.prototype.get_root = function(bCreateGroup) { // Gets the root element.
	if (this.$fragment != null) {
		if (bCreateGroup) {
			throw "get_root(true) not implemented yet";
		}
		if (this.$fragment.childNodes.length > 0) {
			return this.$fragment.childNodes[0];
		}
	}
	return null;
}
DOMUtilFragment.prototype.get_roots = function(bCreateGroup) {
	var result = [];
	if (this.$fragment != null) {
		if (bCreateGroup) throw "get_roots(true) not implemented yet";
		if (this.$fragment.childNodes.length > 0) {
			for (var i = 0;i < this.$fragment.childNodes.length; result.push(this.$fragment.childNodes[i++]));
		}
	}
	return result;
}
DOMUtilFragment.prototype.filter = function(selector) {
	var roots = this.get_roots();
	if (roots.length > 0) {
		return DOMUtil.filterElements(roots, selector);
	}
	return [];
}
DOMUtilFragment.prototype.filterByKey = function(key) {
	var roots = this.get_roots();
	if (roots.length > 0) {
		return DOMUtil.filterElements(roots, '[data-key='+key+']');
	}
	return [];
}

DOMUtilFragment.prototype.filterAsFragment = function(selector, clone) {
	var arr = this.filter(selector);
	return new DOMUtilFragment(arr.Select(function(idx, el) {
		return (clone?el.cloneNode(true):el);
	}));
}
DOMUtilFragment.prototype.filterByKeyAsFragment = function(key, clone) {
	var arr = this.filterByKey(key);
	return new DOMUtilFragment(arr.Select(function(idx, el) {
		return (clone?el.cloneNode(true):el);
	}));
}
DOMUtilFragment.prototype.queryAllByDataKey = function(datakey, clone) {
	var arr = DOMUtil.queryAllByDataKey(this.get_roots(), datakey);
	if (arr != null) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof HTMLElement) {
				arr[i] = clone?arr[i].cloneNode(true):arr[i];
			}
		}
		return new DOMUtilFragment(arr);
	}
	return new DOMUtilFragment(); // Empty fragment
}
DOMUtilFragment.prototype.queryOneByDataKey = function(datakey, clone) {
	var el = DOMUtil.queryOneByDataKey(this.$element, datakey);
	if (el != null && clone) {
		el = el.cloneNode(true);
	}
	return new DOMUtilFragment(el);
}
DOMUtilFragment.prototype.queryOne = function(selector, clone) {
	var el = DOMUtil.queryOne(this.$element, selector);
	var el = DOMUtil.queryOneByDataKey(this.$element, datakey);
	if (el != null && clone) {
		el = el.cloneNode(true);
	}
	return new DOMUtilFragment(el);
}
DOMUtilFragment.prototype.queryAll = function(selector,clone) {
	var arr = DOMUtil.queryAll(this.$element, selector);
	if (arr != null) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof HTMLElement) {
				arr[i] = clone?arr[i].cloneNode(true):arr[i];
			}
		}
		return new DOMUtilFragment(arr);
	}
	return new DOMUtilFragment(); // Empty fragment
}

DOMUtilFragment.prototype.add = function(content,how) {
	var me = this;
	// Inner code
	function $addNode(v) {
		if (how == null || how == "append") {
			if (me.$fragment == null) { me.$fragment = document.createDocumentFragment(); }
			me.$fragment.appendChild(v);
		} else if (how == "prepend") {
			if (me.$fragment == null) { me.$fragment = document.createDocumentFragment(); }
			me.$fragment.insertBefore(v,me.$fragment.firstChild);
		} else {
			return false; // No action
		}
		me.checkSingleRoot(me.$fragment);
		return true;
	}
	// Outer code
	if (content != null && this.$fragment != null) {
		if (content instanceof HTMLElement) {
			return $addNode(content)
		} else if (content instanceof DocumentFragment) {
			var filteredFragment = DOMUtil.cleanupDOMFragment(content);
			return $addNode(filteredFragment);
		} else if (content instanceof HTMLCollection || content instanceof NodeList || BaseObject.is(content, "Array")) {
			var fr = DOMUtil.fragmentFromCollection(content);
			if (fr != null) {
				return $addNode(fr);
			}
		} else if (typeof content === "string") {
			var fr = DOMUtil.fragmentFromHTML(content);
			if (fr != null) {
				return $addNode(fr);
			}
		}
	}
	return false;
}
DOMUtilFragment.prototype.get_isempty = function() {
	if (this.$fragment == null) return true;
	if (this.$fragment.childNodes.length == 0) return true;
	return false;
}
DOMUtilFragment.prototype.toString = function() {
	if (this.$fragment == null) return "";
	if (this.$fragment.childNodes.length == 0) return "";
	var n,s = "";
	for (var i = 0; i < this.$fragment.childNodes.length; i++) {
		n = this.$fragment.childNodes[i];
		if (n instanceof Element) {
			s += n.outerHTML;
		}
		
	}
	return s;
}