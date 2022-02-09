
(function() {

    var WindowLiveSettings = Class("WindowLiveSettings");

    /**
     * Implementation that is somewhat useful for simple cases, but is supposed to serve mainly as a reference implementation of live settings.
     * You do not need to inherit this class in order to create your own - inherit the base class WindowLiveSettings instead.
     */
    function WindowLiveMinimalSettings() {
        WindowLiveSettings.apply(this, arguments);
    }
    WindowLiveMinimalSettings.Inherit(WindowLiveSettings, "WindowLiveMinimalSettings")
        .ImplementActiveProperty("closebutton", new InitializeBooleanParameter("Defines if the close button should be seen.", true))
        .ImplementActiveProperty("maxbutton", new InitializeBooleanParameter("Defines if the maximize button should be seen.", true))
        .ImplementActiveProperty("minbutton", new InitializeBooleanParameter("Defines if the minimize button should be seen.", true))
        .ImplementActiveProperty("caption", new InitializeBooleanParameter("Defines if the caption should be seen.", true));

    WindowLiveMinimalSettings.prototype.cloneObject = function() {
        var clone = WindowLiveSettings.prototype.cloneObject.apply(this, arguments);
        // It is better to use private fields in order to avoid firing events without the need to freeze them explicitly.
        clone.$closebutton = this.$closebutton;
        clone.$maxbutton = this.$maxbutton;
        clone.$minbutton = this.$minbutton;
        clone.$caption = this.$caption;
        return clone;
    }

})();