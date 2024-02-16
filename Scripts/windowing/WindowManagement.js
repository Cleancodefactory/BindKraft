


/*CLASS*/ // Singleton
// This class serves global purposes for windowing, but is limited to system use. Any services offered by this class should be exposed through a global workspace singleton.
function WindowManagement() {
    BaseObject.apply(this, arguments);
}
WindowManagement.Inherit(BaseObject, "WindowManagement");
WindowManagement.prototype.activateevent = new InitializeEvent('Notifies subscribers for window activation');

WindowManagement.$default = null;
WindowManagement.Default = function () {
    if (WindowManagement.$default == null) {
        WindowManagement.$default = new WindowManagement();
    }
    return WindowManagement.$default;
};
WindowManagement.prototype.$activewindow = null;
WindowManagement.prototype.set_activewindow = function (w) {
    var oldW = null;
    if (BaseObject.is(w, "BaseWindow") && this.$activewindow != w) {
		if (this.$activewindow != null) {
            WindowingMessage.fireOn(this.$activewindow, WindowEventEnum.DeactivateWindow, { activating: w});  
            oldW = this.$activewindow;
        } 
    
        this.$activewindow = w;
        WindowingMessage.fireOn(w, WindowEventEnum.ActivateWindow, {deactivated:oldW});
        this.activateevent.invoke(this, w);
    }
    
};
WindowManagement.prototype.get_activewindow = function (w) {
    return this.$activewindow;
};
WindowManagement.prototype.$focuswindow = null;
WindowManagement.prototype.set_focuswindow = function (w) {

};
WindowManagement.prototype.get_focuswindow = function () {
};