/**
	Alias: fixednumbers
	Supported parameters:
		$before 	{integer}		max digits before the .
		$after		{integer}		exact digits after the .
		$text		{string}		optional, error message
		$order		{integer}		order in which to exec rule
		$disabled	{boolean}		true - disabled, false - normally applied
		raw			{boolean}		defaults to true - pass the raw value, false - pass the formatted value
		fail		{boolean}		If incorrect report as critical (fail).
*/

function FixedNumberValidatorRule(v) {
	ValidateValue.apply(this, arguments);
};

FixedNumberValidatorRule.Inherit(ValidateValue, "FixedNumberValidatorRule");
FixedNumberValidatorRule.registerValidator("fixednumbers");

FixedNumberValidatorRule.prototype.$before = null;
FixedNumberValidatorRule.prototype.$after = null;

FixedNumberValidatorRule.prototype.get_before = function () {
	return this.$before;
};
FixedNumberValidatorRule.prototype.set_before = function (v) {
	this.$before = v;
};
FixedNumberValidatorRule.prototype.get_after = function () {
	return this.$after;
};
FixedNumberValidatorRule.prototype.set_after = function (v) {
	this.$after = v;
};

FixedNumberValidatorRule.prototype.get_message = function () {
	var msg = this.get_text();

	if (msg == null || msg.length == 0) {
		if (this.get_before() != null && this.get_after() != null) {
			msg = Binding.resources.get("Validation.FixedNumber");
			if (msg == null || msg.length == 0) {
				msg = "The input value must have most of %l numeric characters before the floating point and %l after";
			}
			return msg.sprintf(this.get_before(), this.get_after());
		} else {
			msg = Binding.resources.get("Validation.FixedNumber_LeftPartOnly");
			if (msg == null || msg.length == 0) {
				msg = "The input value must have most of %l numeric characters before the floating";
			}
			return msg.sprintf(this.get_before());
		}
	}
	return msg;
}

FixedNumberValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;

	var num = value.toString();
	if (!isNaN(Number(num))) {
		var numParts = num.split('.');
		var leftPart = numParts[0];
		var rightPart = numParts[1];

		if (this.get_before() != null) {
			if (leftPart == undefined || leftPart.length <= 0 || leftPart.length > this.get_before()) {
				result = ValidationResultEnum.incorrect;
			}

			if (this.get_after() != null) {
				if (rightPart != undefined) {
					if (rightPart.length <= 0 || rightPart.length != this.get_after()) {
						result = ValidationResultEnum.incorrect;
					}
				}
				else {
					result = ValidationResultEnum.incorrect;
				}
			}
		}
	} else {
		result = ValidationResultEnum.incorrect;
	}

	return this.validationResult(result);
}
var FixedNumberValidatorControl = FixedNumberValidatorRule;
//<<============================================/ END FixedNumberValidatorRule \============================================