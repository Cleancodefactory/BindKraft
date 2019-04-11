

/* NEWLY DESIGNED CHECK BOX */
function CheckBoxControl() {
    Base.apply(this, arguments);
    //this.$disabled = null;
}
CheckBoxControl.Inherit(Base, "CheckBoxControl");
CheckBoxControl.Implement(IUIControl);
CheckBoxControl.Implement(ICustomParameterization);
CheckBoxControl.Implement(IDisablable);
CheckBoxControl.Implement(IFreezable);
//CheckBoxControl.Implement(ITemplateSourceImpl, "bindkraftstyles/control-checkbox");

CheckBoxControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-checkbox"));
CheckBoxControl.$defaults = {
	templateName: "bindkraft/control-checkbox"
};


CheckBoxControl.$rootParametersSet = ["disabled","value"];
CheckBoxControl.prototype.setObjectParameter = function (name, value) {
    if (name.inSet(CheckBoxControl.$rootParametersSet)) return true;
	return false;
};
//Example for disabled: #disabled='1'
CheckBoxControl.ImplementActiveProperty("value", new InitializeStringParameter("Choose to which field to bind to.", null));
CheckBoxControl.Implement.$disabled = new InitializeStringParameter("Choose to which field to bind to.", null);
CheckBoxControl.prototype.checkedchangedevent = new InitializeEvent("Fired every time the checkbox check is changed");
CheckBoxControl.prototype.init = function () {
	// this.freezeEvents(this, function() {
	// 	var el = $(this.root);
	// 	var tml = $(".j_framework_control_checkbox");
	// 	el.empty();
	// 	el.append(tml.children().clone());
    // });

    // var el = $(this.root);
    // el.empty();
    // el.append(this.get_template());

    $$(this.root).first().empty().append(this.get_template());

    //Base.prototype.$init.apply(this, arguments);
};
CheckBoxControl.prototype.onCheckedChanged = function (sender, dc) {
    if (dc != null) {
        this.set_value(dc);
        this.checkedchangedevent.invoke(this, dc);
    }
};
CheckBoxControl.prototype.obliterate = function () {
    Base.prototype.obliterate.call(this);
};