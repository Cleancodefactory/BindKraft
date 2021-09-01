// WARNING!!! This rule is not included in the dep file and is not recommended, because it will have misleading effect.

////////////// CheckReadinessRule //////////////////////////////
function CheckReadinessRule(v) {
	this.$validator = v;
	ValidateValue.apply(this, arguments);
}
CheckReadinessRule.Inherit(ValidateValue, "CheckReadinessRule");
CheckReadinessRule.registerValidator("readiness");
CheckReadinessRule.prototype.$validator = null;
CheckReadinessRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = "Sub-form has invalid entries";
	}
	return msg;
};
CheckReadinessRule.prototype.validateValue = function (validator, _value, binding) {
	var result = ValidationResultEnum.correct;
	if (binding == null) {
		this.LASTERROR("Check readiness can be used with binding only");
		return result;
	}
	var targetDom = binding.get_target();
	if (targetDom == null) {
		this.LASTERROR("Check readiness can't find the target element");
		return result;
	}
	var ac = targetDom.activeClass;
	if (!BaseObject.is(ac, "IUIControlReadiness")) {
		// TODO: Do we really need any logging here? It is actually correct behavior and can be intentional;
		return result;
	}

	value = ac.get_waitcontrolreadystate();

	if (!BaseObject.is(value, "Operation")) {
		value = Operation.From(result);
	}
	value.then(this.thisCall(function(op) {
		if (op.isOperationSuccessful()) {
			validator.reportResult(this, op.getOperationResult());
		} else {
			validator.reportResult(this, ValidationResultEnum.incorrect);
		}
	}));
	if (value.isOperationComplete()) {
		if (value.isOperationSuccessful()) {
			return value.getOperationResult();
		} else {
			return ValidationResultEnum.incorrect;
		}
	} else {
		return this.validationResult(ValidationResultEnum.pending);
	}
};
//////////////////////END/////////////////////////////
