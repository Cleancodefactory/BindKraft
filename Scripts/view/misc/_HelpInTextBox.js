


/*CLASS*/
function HelpInTextBoxControl() {
    Base.apply(this, arguments);
   
}
HelpInTextBoxControl.Inherit(Base, "HelpInTextBoxControl");
HelpInTextBoxControl.Implement(IUIControl);
HelpInTextBoxControl.prototype.focusoutvent = new InitializeEvent("Fired on focus out");
HelpInTextBoxControl.ImplementProperty("defaulttext", new InitializeStringParameter("The Text that is going to be visible.", "Add Comment"));
HelpInTextBoxControl.ImplementProperty("textval", new InitializeStringParameter("The TexT.", ""));
HelpInTextBoxControl.prototype.$init = function () {
    var el = $(this.root);
    var tml = $(".j_help_in_text_box_control");
    el.empty();
    el.append(tml.children().clone());
    Base.prototype.$init.apply(this, arguments);
};

HelpInTextBoxControl.prototype.OnClick = function (e, dc, target) {
    var hinttext = this.childObject("hinttext");
    $(hinttext).hide();
    var textbox = this.childObject("textbox");
    $(textbox).focus();
}

HelpInTextBoxControl.prototype.OnBlur = function () {
    var textbox = this.childObject("textbox");
    if (textbox.value == "") {
        var hinttext = this.childObject("hinttext");
        $(hinttext).show();
    }
    this.focusoutvent.invoke(this, textbox.value);
}