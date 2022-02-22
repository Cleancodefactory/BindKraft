function YesNoControl() {
    Base.apply(this, arguments);
}

YesNoControl.Inherit(Base, "YesNoControl");
YesNoControl.Implement(IUIControl);
YesNoControl.Implement(InterfaceImplementer("IAmbientDefaultsConsumerImpl"));
YesNoControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-yesno"));
YesNoControl.$defaults = {
	templateName: "bindkraft/control-yesno"
};

YesNoControl.prototype.obliterate = function () {
    this.yesElement = null;
    this.noElement = null;
    Base.prototype.obliterate.call(this);
};

YesNoControl.ImplementProperty("selectedCssClass", new InitializeStringParameter("CSS class for the selected state", "selected"));
YesNoControl.ImplementProperty("yestitle", new InitializeStringParameter("The display name of the yes value", "Yes"));
YesNoControl.ImplementProperty("notitle", new InitializeStringParameter("The display name of the no value", "No"));
YesNoControl.ImplementProperty("yesvalue", new InitializeParameter("The value for the yes state", true));
YesNoControl.ImplementProperty("novalue", new InitializeParameter("The value for the no state", false));
YesNoControl.ImplementProperty("yeskey", new InitializeStringParameter("The data-key of the yes element in the template", "yes_key"));
YesNoControl.ImplementProperty("nokey", new InitializeStringParameter("The data-key of the no element in the template", "no_key"));

YesNoControl.prototype.$value = false;  //The control has false default value

YesNoControl.prototype.changedevent = new InitializeEvent("Fired when the value changes");
YesNoControl.prototype.activatedevent = new InitializeEvent("Fired when the value changes");

YesNoControl.prototype.init = function () {
    ITemplateSourceImpl.InstantiateTemplate(this);
    

    this.yesElement = this.child(this.get_yeskey());
    this.noElement = this.child(this.get_nokey());
    this.updateControlUI();
};

YesNoControl.prototype.get_value = function () {
    return ((this.$value) ? this.get_yesvalue() : this.get_novalue());
};

YesNoControl.prototype.set_value = function (inputValue) {
    var translatedInputValue = this.$translateValue(inputValue);

    if (translatedInputValue != this.$value) {
        this.$value = translatedInputValue;
        this.updateControlUI();
        this.changedevent.invoke(this, this.get_dataContext());
    }
};

YesNoControl.prototype.$translateValue = function (inputValue) {
    if (inputValue == this.get_yesvalue()) return true;
    return false;
};

YesNoControl.prototype.onSetNo = function (e, dc, b) {
    this.set_value(this.get_novalue());
	this.activatedevent.invoke(this, this.get_novalue());
};

YesNoControl.prototype.onSetYes = function (e, dc, b) {
    this.set_value(this.get_yesvalue());
	this.activatedevent.invoke(this, this.get_yesvalue());
};

YesNoControl.prototype.updateControlUI = function () {
   if (!this.yesElement || !this.noElement) return; //return return devachke Kalino

    this.yesElement.removeClass(this.get_selectedCssClass());
    this.noElement.removeClass(this.get_selectedCssClass());

    if (this.$value) {
        this.yesElement.addClass(this.get_selectedCssClass());
    } else {
        this.noElement.addClass(this.get_selectedCssClass());
    }
};

/** 
 * This method is used only in the Switch template
 * In the template there is only one input(Checkbox)
 * that is why the method is used for setting both values
*/
YesNoControl.prototype.onSwitch = function (e,dc,b) {
    if (this.get_value() !== this.get_yesvalue()) {
        this.set_value(this.get_yesvalue());
	    this.activatedevent.invoke(this, this.get_yesvalue());
    } else {
        this.set_value(this.get_novalue());
	    this.activatedevent.invoke(this, this.get_novalue());
    }
 };