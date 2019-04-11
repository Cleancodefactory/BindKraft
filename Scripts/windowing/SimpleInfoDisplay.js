


/*CLASS*/
function SimpleInfoDisplay() {
    Base.apply(this, arguments);
}
SimpleInfoDisplay.Inherit(Base, "SimpleInfoDisplay");
SimpleInfoDisplay.Implement(IUIControl);
SimpleInfoDisplay.Implement(IInfoDisplayPanel);
SimpleInfoDisplay.prototype.onShowHidePanel = function (e, dc, binding, bparam) {
};
SimpleInfoDisplay.prototype.CustomImgFormatter = {
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