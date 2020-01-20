////////////// RangeDatesValidatorRuleEx //////////////////////////////
function RangeDatesValidatorRuleEx(v) {
	ValidateValue.apply(this, arguments);
}
RangeDatesValidatorRuleEx.Inherit(ValidateValue, "RangeDatesValidatorRuleEx");
RangeDatesValidatorRuleEx.registerValidator("rangedatesex");
RangeDatesValidatorRuleEx.prototype.$minValue = null;
RangeDatesValidatorRuleEx.prototype.$maxValue = null;
RangeDatesValidatorRuleEx.prototype.get_minValue = function () {
	return this.$minValue;
};
RangeDatesValidatorRuleEx.prototype.set_minValue = function (v) {
	this.$minValue = v;
};
RangeDatesValidatorRuleEx.prototype.get_maxValue = function () {
	return this.$maxValue;
};
RangeDatesValidatorRuleEx.prototype.set_maxValue = function (v) {
	this.$maxValue = v;
};
RangeDatesValidatorRuleEx.prototype.get_message = function (lastValue) {
	if (this.$isValid) return "Data is OK";
	var msg = this.get_text();
	/* if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("jsValidation.RangeDate");
	} */
	if (msg == null || msg.length == 0) {
		msg = "Input value must be between %l and %l";
	}
	return msg.sprintf(this.get_minValue(), this.get_maxValue());
};
RangeDatesValidatorRuleEx.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!this.isValueEmpty(value) && value.toString().trim().length != 0) {
		var minValue = DateShort.FromTarget(DateShort.ToTarget(this.get_minValue()));
		var maxValue = DateShort.FromTarget(DateShort.ToTarget(this.get_maxValue()));
		if (IsNull(minValue)) {
			minValue = new Date(1800, 0, 1);
		}
		if (IsNull(maxValue)) {
			maxValue = new Date(9999, 11, 31);
		}
		var dateValue = DateShort.FromTarget(value);
		if (dateValue < minValue || dateValue > maxValue || IsNull(dateValue)) {
			result = ValidationResultEnum.incorrect;
		}
	}
	else {
		result = ValidationResultEnum.incorrect;
	};
	return this.validationResult(result);
};
var RangeDatesValidatorControlEx = RangeDatesValidatorRuleEx;
//////////////////////END/////////////////////////////