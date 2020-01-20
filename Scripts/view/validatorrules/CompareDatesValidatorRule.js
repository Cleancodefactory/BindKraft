////////////// CompareDatesValidatorRule /////////////////////////
function CompareDatesValidatorRule(v) {
	ValidateValue.apply(this, arguments);
	this.raw = 0;
}
CompareDatesValidatorRule.Inherit(ValidateValue, "CompareDatesValidatorRule");
CompareDatesValidatorRule.registerValidator("comparedates");
CompareDatesValidatorRule.prototype.$valueToCompare = null;
CompareDatesValidatorRule.prototype.$isSmaller = null;
CompareDatesValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (IsNull(msg) || msg.length == 0) {
		if (!IsNull(this.$isSmaller)) {
			if (this.$isSmaller > 0) {
				msg = 'Input date must be before %l';
			} else {
				msg = 'Input date must be after %l';
			}
		}
	}
	return msg.sprintf(this.get_valueToCompare());
};
CompareDatesValidatorRule.prototype.get_valueToCompare = function () {
	return this.$valueToCompare;
};
CompareDatesValidatorRule.prototype.set_valueToCompare = function (v) {
	this.$valueToCompare = v;
};

CompareDatesValidatorRule.prototype.get_isSmaller = function () {
	return this.$isSmaller;
};
CompareDatesValidatorRule.prototype.set_isSmaller = function (v) {
	this.$isSmaller = v;
};

CompareDatesValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length > 0) {
		if (!IsNull(this.$isSmaller)) {
			var value4ComparisonDate = this.get_valueToCompare();
			if (realTypeOf(value4ComparisonDate) == 'date') {
				if (this.$isSmaller > 0) {
					if (value >= value4ComparisonDate) {
						result = ValidationResultEnum.incorrect;
					}
				} else {
					if (value < value4ComparisonDate) {
						result = ValidationResultEnum.incorrect;
					}
				}
			}
		}
	}
	return this.validationResult(result);
};
var CompareDatesValidatorControl = CompareDatesValidatorRule;
//////////////////////END/////////////////////////////