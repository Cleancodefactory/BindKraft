

/*CLASS*/
function WindowInfoDisplay() {
    ViewBase.apply(this, arguments);
}
WindowInfoDisplay.Inherit(ViewBase, "WindowInfoDisplay");
WindowInfoDisplay.Implement(ITemplateRoot);
WindowInfoDisplay.Implement(IUIControl);
WindowInfoDisplay.Implement(IInfoDisplayPanelImpl);
WindowInfoDisplay.prototype.onShowHidePanel = function (e, dc, binding, bparam) {
};
WindowInfoDisplay.prototype.TypeColor = {
    ToTarget: function (v) {
        switch (v) {
            case "error":
                return "#D0C0C0";
                break;
            case "warning":
                return "#D0D0C0";
                break;
            case "info":
                return "#C0C0D0";
                break;
            default:
                return "#C0C0C0";
                break;

        }
    }
};
