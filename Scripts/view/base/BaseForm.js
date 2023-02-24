(function(){
    function BaseForm() {
        Base.apply(this, arguments);
    }
    BaseForm.Inherit(Base,"BaseForm")
        .Implement(IValidationContainer);
})();