var Materialize = {
	cloneTemplate: function (container, contentTemplate, data, bGroupElements) {
		var fr = new DOMUtilFragment(contentTemplate);
			
		var roots = fr.get_roots();
		var _container = new DOMUtilElement(container);
		_container.append(fr);
		
		//$(container).append(item);
		if (bGroupElements && roots.length > 1) {
			new ElementGroup(roots);
		}
		ViewBase.$intenal_initialize(roots, true);
		var o;
		for (var i = 0; i < roots.length; i++) {
			o = roots[i];
			if (o != null) {
				o.dataContext = data;
				o.hasDataContext = true;
			}
		}
		if (roots.length > 1) {
			return roots;
		} else if (roots.length == 1) {
			return roots[0];
		} else {
			return null;
		}
	},
	activeClasses: function(els, _type) {
		var type = _type || "Base";
		if (els instanceof HTMLElement) {
			return BaseObject.is(els.activeClass,type)?els.activeClass:null;
		} else if (els instanceof NodeList || els instanceof HTMLCollection || BaseObject.is(els,"Array") ) {
			var cls, result = [];
			for (var i = 0; i < els.length; i++) {
				cls = this.activeClasses(els[i], type);
				if (cls != null) result.push(cls);
			}
			return result;
		}
		return null;
	}
}