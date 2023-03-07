(function() {
    /**
     * Use instead of Base to create part validated separately or use as a base class of controls (only very specific ones - usually you will start from Control or even Base)
     */
    function BaseForm() {
        Base.apply(this, arguments);
    }
    BaseForm.Inherit(Base,"BaseForm")
        .Implement(IValidationContainer);
})();