////////////// NumberValidatorRule //////////////////////////////
function NumberValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
NumberValidatorRule.Inherit(ValidateValue, "NumberValidatorRule")
	.ImplementProperty("float", new InitializeBooleanParameter("Specifies what kind of number: true means float, false means integer and is the default value", false));
NumberValidatorRule.registerValidator("number");
NumberValidatorRule.expresionInt = /^(\+|-)?\d+$/;
NumberValidatorRule.expresionFloat = /^(\+|-)?\d+(\.(\d+))?$/;

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
	if (this.get_float()) {
		if (!(NumberValidatorRule.expresionFloat.test(value))) {
			result = ValidationResultEnum.incorrect;
		}
	} else {
		if (!(NumberValidatorRule.expresionInt.test(value))) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////