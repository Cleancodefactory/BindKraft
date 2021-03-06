////////////// RangeDatesValidatorRule //////////////////////////////
function RangeDatesValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
RangeDatesValidatorRule.Inherit(ValidateValue, "RangeDatesValidatorRule");
RangeDatesValidatorRule.registerValidator("rangedates");
RangeDatesValidatorRule.prototype.$minValue = null;
RangeDatesValidatorRule.prototype.$maxValue = null;
RangeDatesValidatorRule.prototype.raw = false;
RangeDatesValidatorRule.prototype.get_minValue = function () {
	return this.$minValue;
};
RangeDatesValidatorRule.prototype.set_minValue = function (v) {
	this.$minValue = v;
};
RangeDatesValidatorRule.prototype.get_maxValue = function () {
	return this.$maxValue;
};
RangeDatesValidatorRule.prototype.set_maxValue = function (v) {
	this.$maxValue = v;
};
RangeDatesValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	/* if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("jsValidation.RangeDate");
	} */
	if (msg == null || msg.length == 0) {
		msg = "Input value must be between %l and %l";
	}
	return msg.sprintf(this.get_minValue(), this.get_maxValue());
};
RangeDatesValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length != 0) {
		var formatterObject = Function.classes[binding.$formatter];
		var dateValue = value; //formatterObject.FromTarget(formatterObject.ToTarget(value));
		var minValue = this.get_minValue();
		minValue = !IsNull(minValue) ? new Date(minValue) : new Date(1800, 0, 1);
		var maxValue = this.get_maxValue();
		maxValue = !IsNull(maxValue) ? new Date(maxValue) : new Date(9999, 11, 31);
		if (dateValue < minValue || dateValue > maxValue) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
var RangeDatesValidatorControl = RangeDatesValidatorRule;
//////////////////////END/////////////////////////////