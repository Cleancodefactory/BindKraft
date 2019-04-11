


/*STANDARD SORTING HEADER*/
function SortHeaderControl() {
    Base.apply(this, arguments);
}
SortHeaderControl.Inherit(Base, "SortHeaderControl");
SortHeaderControl.Implement(IUIControl);
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
SortHeaderControl.prototype.$init = function () {
    var el = $(this.root);
    var tml = $(".j_framework_control_sortheader");
    el.empty();
    el.append(tml.children().clone());
    Base.prototype.$init.apply(this, arguments);
};