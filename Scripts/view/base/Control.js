(function() {
    /**
     * Controls can inherit from this class and have IUIControl isolation already available.
     * Also the Control class can be used in views to isolate their insides from external validation.
     * No templates support is available at this level, if needed it should be added through ITemplateSourceImpl
     * in the inheriting classes.
     */
    function Control() {
        Base.apply(this, arguments);
    }
    Control.Inherit(Base, "Control")
    .Implement(IUIControl);
})();