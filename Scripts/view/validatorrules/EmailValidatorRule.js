////////////// EmailValidatorRule //////////////////////////////
function EmailValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
EmailValidatorRule.Inherit(ValidateValue, "EmailValidatorRule");
EmailValidatorRule.registerValidator("email");
EmailValidatorRule.expresion = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z][a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
EmailValidatorRule.addExpresion = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
EmailValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Email");
	}
	if (msg == null || msg.length == 0) {
		msg = "Email: %l is incorrect";
	}
	return msg.sprintf(lastValue);
}.Description("Message from the validator");
EmailValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	// 
	if (!IsNull(value)) {
		if (!(value.match(EmailValidatorRule.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
		//        if (!EmailValidatorRule.addExpresion.test(value)) {
		//            result = ValidationResultEnum.incorrect;
		//        }
	}
	return this.validationResult(result);
}.Description(
	"Validates the input" +
	"\n@param validator - " +
	"\n@param value - " +
	"\n@param binding - " +
	"\n@return @enum ValidationResultEnum value"
);
var EmailValidatorControl = EmailValidatorRule;
//////////////////////END/////////////////////////////