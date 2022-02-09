////////////// AsyncValidatorRule //////////////////////////////
function AsyncValidatorRule(v) {
	ValidateValue.apply(this, arguments);
	this.$validator = v;
	this.$order = 10000;
};

AsyncValidatorRule.Inherit(ValidateValues, "AsyncValidatorRule");
AsyncValidatorRule.registerValidator("async");
AsyncValidatorRule.prototype.$validator = null;
AsyncValidatorRule.prototype.get_delegate = function () { return null; };
AsyncValidatorRule.prototype.get_simpledelegate = function () { return null; };
AsyncValidatorRule.prototype.get_param1 = function () { return null; };
AsyncValidatorRule.prototype.get_param2 = function () { return null; };
AsyncValidatorRule.prototype.get_param3 = function () { return null; };
AsyncValidatorRule.ImplementProperty("nocheck", null);
AsyncValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg != null && msg.length > 0) msg = msg.sprintf(lastValue);
	return msg;
};
AsyncValidatorRule.prototype.validateValues = function (validator, values, bindings) {
	var result = ValidationResultEnum.correct;
	if (!Array.isArray(bindings)) return this.validationResult(result);
	bindings = Array.createCopyOf(bindings);
	if (Array.isArray(values)) values = Array.createCopyOf(values);

	var d = this.get_delegate();
	var sd = this.get_simpledelegate();

	if (d != null || sd != null) {
		var r;
		if (d != null) {
			r = d.invoke({ rule: this, validator: validator, values: values, bindings: bindings });
		} else {
			r = sd.invoke(this, validator, values, bindings );
		}
		if (r > result) result = r;
		if (r == ValidationResultEnum.pending) return r;
	}
	return this.validationResult(result);
};

AsyncValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	
	var d = this.get_delegate();
	var sd = this.get_simpledelegate();
	if ((sd != null || d != null) && !this.isValueEmpty(value)) {
		var r;
		if (d != null) {
			r = d.invoke({ rule: this, validator: validator, value: value, binding: binding });
		} else if (sd != null) {
			r = sd.invoke(this, validator, value, binding);
		}
		if (r > result) result = r;
		if (r == ValidationResultEnum.pending) return r;
		
	}
	return this.validationResult(result);
};

// the delegate should call this method if it is performing an async operation
AsyncValidatorRule.prototype.reportBack = function (result, message, forceIndicate) {
	if (message != null) this.$text = message;
	if (this.$validator != null) {
		this.indicate = forceIndicate;
		this.$validator.reportResult(this, result);
	}
};

/* Callback delegate prototype:
	function ( obj) returns ValidationResultEnum
	obj {
		rule: this rule
		validator: the validator container
		value: value to validate
		binding: the binding from which the value has come
	}
	Asynchronous delegates must call back reportBack on rule e.g.
	rule.reportBack(result [, changeMessage[, forceIndicate]]);
	the changeMessage will have no effect if any is specified in the markup (which takes precedence)
	the forceIndicate triggers any indication of the state of the validation supported by the container 
	even if the result is correct (by default correct values do not show part or all of the validation indication UI)
*/
var AsyncValidatorControl = AsyncValidatorRule
//////////////////////END/////////////////////////////