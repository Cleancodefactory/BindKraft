////////////// RequiredFieldValidatorRule //////////////////////////////
function RequiredFieldValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
RequiredFieldValidatorRule.Inherit(ValidateValue, "RequiredFieldValidatorRule");
RequiredFieldValidatorRule.registerValidator("required");
RequiredFieldValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	/* if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Required");
	} */
	if (msg == null || msg.length == 0) {
		msg = "Field is required";
	}
	return msg;
};
RequiredFieldValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (IsNull(value) || value.toString().trim().length == 0) {
		result = ValidationResultEnum.incorrect;
	}
	return this.validationResult(result);
};
var RequiredFieldValidatorControl = RequiredFieldValidatorRule;
//////////////////////END/////////////////////////////
