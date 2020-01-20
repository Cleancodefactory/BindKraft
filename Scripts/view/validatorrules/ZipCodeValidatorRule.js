////////////// ZipCodeValidatorRule //////////////////////////////
function ZipCodeValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
ZipCodeValidatorRule.Inherit(ValidateValue, "ZipCodeValidatorRule");
ZipCodeValidatorRule.registerValidator("zipcode");
//5 digit US ZIP code + 4 standard
ZipCodeValidatorRule.expresion = /^\d{5}$|^\d{5}-\d{4}$/i;
ZipCodeValidatorRule.addExpresion = '';
ZipCodeValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	/* if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.ZipCode");
	} */
	if (msg == null || msg.length == 0) {
		msg = "ZipCode: %l is incorrect";
	}
	return msg.sprintf(lastValue);
};
ZipCodeValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!this.isValueEmpty(value) && typeof value == "string") {
		if (!(value.match(ZipCodeValidatorRule.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
		//if (!ZipCodeValidatorRule.expresion.test(value)) { result = ValidationResultEnum.incorrect; }
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////