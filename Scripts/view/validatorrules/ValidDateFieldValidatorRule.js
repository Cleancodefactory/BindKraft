////////////// ValidDateFieldValidatorRule //////////////////////////////
function ValidDateFieldValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
ValidDateFieldValidatorRule.Inherit(ValidateValue, "ValidDateFieldValidatorRule");
ValidDateFieldValidatorRule.registerValidator("validdate");
ValidDateFieldValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.ValidDate");
	}
	if (msg == null || msg.length == 0) {
		msg = 'Date is not valid. Required format "' + this.get_dateformat() + '".';
	}
	return msg;
};
ValidDateFieldValidatorRule.prototype.set_dateformat = function (v) {
	this.$dateformat = v;
};
ValidDateFieldValidatorRule.prototype.get_dateformat = function () {
	return this.$dateformat;
};
ValidDateFieldValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!this.isValueEmpty(value) && typeof value == "string") {
		var date = Globalize.parseDate(value, this.get_dateformat());
		if (IsNull(date)) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
var ValidDateFieldValidatorControl = ValidDateFieldValidatorRule; 
//////////////////////END/////////////////////////////