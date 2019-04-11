// Panel class
// Most windows should Inherit from this class which will potentially evolve to something that supports 
//  smart docking/undocking and other UI related basic features. Only windows with container independent bheavior should go deeper and Inherit from 
//  BaseWindow directly
// SPECIFICS: The default template for this class is an empty div with no system elements at all!
/*CLASS*/
function PanelWindow() {
    BaseWindow.apply(this, arguments);
}
PanelWindow.Inherit(BaseWindow, "PanelWindow");
PanelWindow.Defaults({
	templateName: new StringConnector("<div class=\"f_windowframe\" data-key=\"_window\" style=\"background-color:#FFFFFF;\" data-wintype=\"Panel based\"></div>")
});
PanelWindow.prototype.OnDOMAttached = function () {
    BaseWindow.prototype.OnDOMAttached.apply(this, arguments);
	if (this.$clientSlotElement == null ) this.$clientSlotElement = $(this.root);
};