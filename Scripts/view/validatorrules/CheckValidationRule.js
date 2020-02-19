////////////// CheckValidationRule //////////////////////////////
function CheckValidationRule(v) {
	this.$validator = v;
	ValidateValue.apply(this, arguments);
}
CheckValidationRule.Inherit(ValidateValue, "CheckValidationRule");
CheckValidationRule.registerValidator("validation");
CheckValidationRule.prototype.$validator = null;
CheckValidationRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = "Sub-form has invalid entries";
	}
	return msg;
};
CheckValidationRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!BaseObject.is(value, "Operation")) {
		value = Operation.From(value);
	}
	value.then(this.thisCall(function(op) {
		if (op.isOperationSuccessful()) {
			validator.reportResult(this, op.getOperationResult());
		} else {
			validator.reportResult(this, ValidationResultEnum.incorrect);
		}
	}));
	if (value.isOperationComplete()) {
		if (value.isOperationSuccessful()) {
			return value.getOperationResult();
		} else {
			return ValidationResultEnum.incorrect;
		}
	} else {
		return this.validationResult(ValidationResultEnum.pending);
	}
};
var RequiredFieldValidatorControl = CheckValidationRule;
//////////////////////END/////////////////////////////
