////////////// NumberValidatorRule //////////////////////////////
function NumberValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
NumberValidatorRule.Inherit(ValidateValue, "NumberValidatorRule");
NumberValidatorRule.registerValidator("number");
NumberValidatorRule.expresion = /^(\+|-)?\d*$/;
NumberValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	/* if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Number");
	} */
	if (msg == null || msg.length == 0) {
		msg = "This field requires a numeric value !";
	}
	return msg.sprintf();
};
NumberValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!(NumberValidatorRule.expresion.test(value))) {
		result = ValidationResultEnum.incorrect;
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////