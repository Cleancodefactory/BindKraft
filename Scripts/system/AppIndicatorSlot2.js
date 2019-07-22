/**
	AppIndicatorSlot2
	
	This is a visual component capable of instantiating a single component in itself by using a class name and parameters. The slot supports
	instantiating and removing the internal component with optional pausing/unpausing.

Note:
	This class will replace AppIndicatorSlot in version 2.19 and further. The old assumed usage of the 
	old unprotected coross-app communications, but we have to keep it for a while until old indicators are
	updated, so a new class is created instead of changing or inheriting the old one.
	
*/
function AppIndicatorSlot2() {
	Base.apply(this, arguments);
}
AppIndicatorSlot2.Inherit(Base,"AppIndicatorSlot2");
AppIndicatorSlot2.Implement(IUIControl);
AppIndicatorSlot2.Implement(ICustomParameterizationStdImpl,"class");
AppIndicatorSlot2.ImplementProperty("class", new InitializeStringParameter("Class name of the indicator to load",null), null, "OnClassChanged"); // it has to support IAppIndicator

AppIndicatorSlot2.ImplementProperty("indicator", new Initialize("pluginto slot for the indicator component", null)); // it has to support IAppIndicator


AppIndicatorSlot2.prototype.OnClassChanged = function(prop, oldval, newval) {
	this.ExecWhenInitialized(arguments, function() {
		var me = this;
		this.$emptySlot().whencomplete().tell(function() {
			if (typeof newval == "string" && !/^\s*$/.test(newval)) {
				me.$fillSlot();
			}
		});
	});
}

AppIndicatorSlot2.prototype.$fillSlot = function() {
	var cinfo = this.get_class();
	if (typeof cinfo == "string" && cinfo.length > 0) {
		var p = JBUtil.parseDataClass(cinfo);
		if (p != null) {
			var clsdef = Class.getClassDef(p.className);
			if (Class.is(p.className, "IAppIndicator")) {
				var dtCls = p.className;
				if (p.parameters != null && !/^\s*$/.test(p.parameters)) {
					dtCls += '' + p.parameters;
				}
				var str = '<span data-class="' + dtCls + '" data-on-pluginto="{bind source=__control path=indicator}" data-context-border="true"></span>';
				var roots = Materialize.cloneTemplate(this.root, str, {});
				this.rebind();
				this.updateTargets();
				var ar = this.afterAsync(ar, function () {
					var arrObjs = Materialize.activeClasses(roots, "IAppIndicator");
					arrObjs.Each(function(idx, obj) {
							obj.plug();
					});
				});
			} else {
				this.LASTERROR(_Errors.compose(), p.className + " does not exist or does not support IAppIndicator", "$fillSlot");
			}
		}
	}
}
AppIndicatorSlot2.prototype.$emptySlot = function() {
	var op;
	if (BaseObject.is(this.get_indicator(),"IAppIndicator")) {
		op = Operation.From(this.get_indicator().unPlug());
	} else {
		op = Operation.From(null);
	}
	op.then(function(_op) {
		JBUtil.Empty(this.root);
		this.$indicator = null;
	});
	return op;
}