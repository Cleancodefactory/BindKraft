////////////// DelegateValidatorRule //////////////////////////////
function DelegateValidatorRule(v) {
	ValidateValue.apply(this, arguments);
	this.$validator = v;
	this.$order = 10000;
};

DelegateValidatorRule.Inherit(ValidateValues, "DelegateValidatorRule");
DelegateValidatorRule.registerValidator("sync");
DelegateValidatorRule.prototype.$validator = null;
DelegateValidatorRule.prototype.get_delegate = function () { return null; };
DelegateValidatorRule.prototype.get_simpledelegate = function () { return null; };
DelegateValidatorRule.prototype.get_param1 = function () { return null; };
DelegateValidatorRule.prototype.get_param2 = function () { return null; };
DelegateValidatorRule.prototype.get_param3 = function () { return null; };
DelegateValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg != null && msg.length > 0) msg = msg.sprintf(lastValue || "");
	return msg;
};

DelegateValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	
	var d = this.get_delegate();
	var sd = this.get_simpledelegate();
	if ((sd != null || d != null) && !this.isValueEmpty(value)) {
		if (d != null) {
			result = d.invoke({ rule: this, validator: validator, value: value, binding: binding });
		} else if (sd != null) {
			result = sd.invoke(this, validator, value, binding);
		}
		
	}
	return this.validationResult(result);
};
DelegateValidatorRule.prototype.validateValues = function (validator, values, bindings) {
	var result = ValidationResultEnum.correct;
	if (!Array.isArray(bindings)) return this.validationResult(result);
	bindings = Array.createCopyOf(bindings);
	if (Array.isArray(values)) values = Array.createCopyOf(values);
	var d = this.get_delegate();
	var sd = this.get_simpledelegate();
	if (d != null || sd != null) {
		if (d != null) {
			result = d.invoke({ rule: this, validator: validator, values: values, bindings: bindings });
		} else {
			result = sd.invoke(this, validator, values, bindings );
		}
	}
	return this.validationResult(result);
};
var DelegateValidatorControl = DelegateValidatorRule;