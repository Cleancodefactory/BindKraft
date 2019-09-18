////////////// RangeNumbersValidatorRule /////////////////////////
function RangeNumbersValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
RangeNumbersValidatorRule.Inherit(ValidateValue, "RangeNumbersValidatorRule");
RangeNumbersValidatorRule.registerValidator("rangenumbers");
RangeNumbersValidatorRule.prototype.$minValue = null;
RangeNumbersValidatorRule.prototype.$maxValue = null;
RangeNumbersValidatorRule.prototype.get_minValue = function () {
	return this.$minValue;
};
RangeNumbersValidatorRule.prototype.set_minValue = function (v) {
	this.$minValue = v;
};
RangeNumbersValidatorRule.prototype.get_maxValue = function () {
	return this.$maxValue;
};
RangeNumbersValidatorRule.prototype.set_maxValue = function (v) {
	this.$maxValue = v;
};
RangeNumbersValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();

	if (msg == null || msg.length == 0) {
		if (this.get_minValue() != null && this.get_maxValue() != null) {
			msg = Binding.resources.get("Validation.Range");
			if (msg == null || msg.length == 0) {
				msg = msg = "The input value must be between %l and %l";
			}
			return msg.sprintf(this.get_minValue(), this.get_maxValue());
		} else if (this.get_minValue() != null) {
			msg = Binding.resources.get("Validation.Range_MinValueOnly");
			if (msg == null || msg.length == 0) {
				msg = "The input value must be greater or equal to %l";
			}
			return msg.sprintf(this.get_minValue());
		} else if (this.get_maxValue() != null) {
			msg = Binding.resources.get("Validation.Range_MaxValueOnly");
			if (msg == null || msg.length == 0) {
				msg = "The input value must be less or equal to %l";
			}
			return msg.sprintf(this.get_maxValue());
		}
	}

	return msg;
};
RangeNumbersValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length != 0) {
		var minValue = parseFloat(this.get_minValue());
		if (IsNull(minValue)) {
			minValue = Number.MIN_VALUE;
		}
		var maxValue = parseFloat(this.get_maxValue());
		if (IsNull(maxValue)) {
			maxValue = Number.MAX_VALUE;
		}
		var numericValue = parseFloat(value);
		if (numericValue < minValue || numericValue > maxValue) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
var RangeNumbersValidatorControl = RangeNumbersValidatorRule;
//////////////////////END/////////////////////////////