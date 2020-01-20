////////////// PhonenumberValidatorRule //////////////////////////////
function PhonenumberValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
PhonenumberValidatorRule.Inherit(ValidateValue, "PhonenumberValidatorRule");
PhonenumberValidatorRule.registerValidator("phonenumber");
PhonenumberValidatorRule.expresion = /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/;
PhonenumberValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	/* if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.PhoneNumber");
	} */
	if (msg == null || msg.length == 0) {
		msg = "Phone number is incorrect";
	}
	return msg.sprintf();
};
PhonenumberValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!this.isValueEmpty(value) && typeof value == "string") {
		if (!(value.match(PhonenumberValidatorRule.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
var PhonenumberValidatorControl = PhonenumberValidatorRule;
//////////////////////END/////////////////////////////