(function() {
    /**
     * Use instead of Base to create part validated separately
     */
    function BaseForm() {
        Base.apply(this, arguments);
    }
    BaseForm.Inherit(Base,"BaseForm")
        .Implement(IValidationContainer);
})();