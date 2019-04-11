

/* Base classes for validator rules */
/*CLASS*/
function ValidateValue(validator) {
    BaseObject.apply(this, arguments);
    // For now we don't see a reason to remember the validator
}
ValidateValue.Inherit(BaseObject, "ValidateValue");
ValidateValue.prototype.raw = true; // Parameter. If != 0 the raw value is passed to the validator, if false or 0 the formatted value
ValidateValue.prototype.fail = new InitializeBooleanParameter('Parameter. If non-zero the validationResult will return failure instead of incorrect.', false);
ValidateValue.prototype.$text = null;
ValidateValue.prototype.get_text = function () {
    return (this.$text != null) ? this.$text : null;
};
ValidateValue.prototype.set_text = function (v) {
    this.$text = v;
};
ValidateValue.prototype.get_message = function () {
    return this.get_text();
};
ValidateValue.prototype.validateValue = function (validator, value, binding) {
    return ValidationResultEnum.correct;
};
ValidateValue.prototype.validationResult = function (result) {
    if (this.fail && result > ValidationResultEnum.correct) return ValidationResultEnum.fail;
    return result;
};
ValidateValue.prototype.indicate = false; // Forces the indication (message/hint) to be shown. The rule can raise this flag to cause the Validator to show something even in case of correct result
ValidateValue.prototype.$order = 0; // Order of execution in the list of all rules in this Validator
ValidateValue.prototype.get_order = function () { return this.$order; };
ValidateValue.prototype.set_order = function (v) { this.$order = v; };
ValidateValue.prototype.$disabled = false;
ValidateValue.prototype.get_disabled = function () { return this.$disabled; };
ValidateValue.prototype.set_disabled = function (v) { this.$disabled = v; };