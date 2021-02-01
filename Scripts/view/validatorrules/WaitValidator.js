////////////// WaitValidator //////////////////////////////
function WaitValidator(v) {
	ValidateValue.apply(this, arguments);
	this.$validator = v;
	this.$order = 10000;
};

WaitValidator.Inherit(ValidateValue, "WaitValidator");
WaitValidator.registerValidator("wait");
WaitValidator.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	return msg;
};
WaitValidator.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (BaseObject.is(value, "Operation")) {
		if (!value.isOperationComplete()) {
			value.then(function(op) {
				validator.reportResult(this, op.isOperationSuccessful()?ValidationResultEnum.correct:ValidationResultEnum.incorrect);
			});
			result = ValidationResultEnum.pending;
		}
		
	}
	return this.validationResult(result);
};
