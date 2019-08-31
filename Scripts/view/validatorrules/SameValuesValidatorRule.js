////////////// SameValuesValidatorRule //////////////////////////////
function SameValuesValidatorRule(v) {
	ValidateValues.apply(this, arguments);
}

SameValuesValidatorRule.Inherit(ValidateValues, "SameValuesValidatorRule");
SameValuesValidatorRule.registerValidator("samevalues");
SameValuesValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = "Mismatching Values"; //Binding.resources.get("Validation.MismatchingValues");
	}

	return msg.sprintf();
};

SameValuesValidatorRule.prototype.validateValues = function (validator, values, bindings) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(values) && values.length > 1) {
		var curval = values[0];
		for (var i = 1; i < values.length; i++) {
			if (!values[i]) continue;
			if (!curval) {
				curval = values[i];
			}
			if (values[i] != curval) return this.validationResult(ValidationResultEnum.incorrect);
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////