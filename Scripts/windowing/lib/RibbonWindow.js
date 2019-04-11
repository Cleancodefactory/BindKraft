
// Ribbon Window class
function RibbonWindow() {
    BaseWindow.apply(this, arguments);
}
RibbonWindow.Inherit(BaseWindow, "RibbonWindow");
/*
RibbonWindow.prototype.$get_windowHtmlTemplate = function () {
    if (this.$customSystemTemplate != null) {
        return this.$customSystemTemplate;
    } else {
        //Change to return a specific template for the ribbon
        return "<div class=\"f_windowframe\" data-key=\"_window\" style=\"position: absolute;width:200px;height:200px;background-color:#FFFFFF;\"></div>";
    }
};
*/
RibbonWindow.prototype.get_clientcontainer = function (param) {
    return this.root;
};