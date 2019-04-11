

/*CLASS*/
function WindowInfoDisplay() {
    ViewBase.apply(this, arguments);
}
WindowInfoDisplay.Inherit(ViewBase, "WindowInfoDisplay");
WindowInfoDisplay.Implement(ITemplateRoot);
WindowInfoDisplay.Implement(IUIControl);
WindowInfoDisplay.Implement(IInfoDisplayPanel);
WindowInfoDisplay.prototype.onShowHidePanel = function (e, dc, binding, bparam) {
};
WindowInfoDisplay.prototype.CustomImgFormatter = {
    ToTarget: function (v) {
        switch (v) {
            case "error":
                return "img/notify/error.png";
                break;
            case "warning":
                return "img/notify/warning.png";
                break;
            case "info":
                return "img/notify/info.png";
                break;
            default:
                return "img/notify/help.png";
                break;

        }
    }
};
