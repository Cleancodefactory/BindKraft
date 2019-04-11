
/*CLASS*/
function DataViewerControl() {
	Base.apply(this, arguments);
}
DataViewerControl.Inherit(Base, "DataViewerControl");
DataViewerControl.Implement(IUIControl);
DataViewerControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-dataviewer"));
DataViewerControl.ImplementProperty("expanded", new InitializeBooleanParameter("Expanded visualization of the data.", false));
DataViewerControl.$defaults = {
	templateName: "bindkraft/control-dataviewer"
};
DataViewerControl.prototype.$init = function () {
    // Inject the predefined template
    var el = $(this.root);
	this.root.hasDataContext = true;
	var tml = this.get_template();
	el.empty();
    el.append(tml);
	
	/* We probably do not need this
	var tml = el.children().clone();
	if (tml.length == 0) {
		var tmlName = this.get_templateName();
		if (tmlName == null) {
			tmlName = ".j_framework_dataviewer";
			// We must do something else here - may be exception or supply built-in template, the decision should be driven by the policies we agree upon.
			tml = $(tmlName).children().clone();
		} else {
			tml = $(tmlName).children().clone();
		}
	}
	if (tml != null && tml.length > 0) {
		el.Empty();
		el.append(tml);
	}
	*/
    Base.prototype.$init.apply(this, arguments);
};