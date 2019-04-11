
/*CLASS*/
function ValidateValues(validator) {
    ValidateValue.apply(this, arguments);
    // For now we don't see a reason to remember the validator
}
ValidateValues.Inherit(ValidateValue, "ValidateValues");
ValidateValues.prototype.validateValues = function (validator, values, bindings) {
    return ValidationResultEnum.correct;
};
