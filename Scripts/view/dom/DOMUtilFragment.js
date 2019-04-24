function DOMUtilFragment(fragment, singleroot) {
	BaseObject.apply(this,arguments);
	this.set_fragment(fragment);
	this.$singleroot = (singleroot?true:false);
}
DOMUtilFragment.Inherit(BaseObject,"DOMUtilFragment");
DOMUtilFragment.prototype.$fragment = null;
DOMUtilFragment.prototype.$singleroot = false;
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
	}
	checkSingleRoot(this.$fragment);
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
