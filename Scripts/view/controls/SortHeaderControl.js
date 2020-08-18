


/*STANDARD SORTING HEADER*/
function SortHeaderControl() {
    Base.apply(this, arguments);
}
SortHeaderControl.Inherit(Base, "SortHeaderControl");
SortHeaderControl.Implement(IUIControl);
SortHeaderControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraftstyles/control-sortheader"));
SortHeaderControl.Implement(ICustomParameterizationStdImpl, "templateName", "fieldname", "displayname");
SortHeaderControl.Defaults({
	templateName: "bindkraftstyles/control-sortheader"
});
SortHeaderControl.ImplementProperty("fieldname", new InitializeStringParameter("Field name for the header"));
SortHeaderControl.ImplementProperty("displayname", new InitializeStringParameter("Display field name for the header"));
SortHeaderControl.prototype.$dataarea = null;
SortHeaderControl.prototype.get_dataarea = function () {
    return this.$dataarea;
};
SortHeaderControl.prototype.set_dataarea = function (v) {
    this.$dataarea = v;
};
// It seems that the binding parameter gets lost when reread from the _control context.
// UIHeader.ImplementProperty("dataarea", new InitializeObject("Must be bound to a data area."));
SortHeaderControl.prototype.init = function () {
    var el = $(this.root);
    var tml = this.get_template();
    if (typeof tml == "string" && tml.length > 0) {
        var el = new DOMUtilElement(this.root);
        el.Empty();
        el.append(tml);
    }
};

