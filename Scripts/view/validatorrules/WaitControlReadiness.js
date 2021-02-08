////////////// WaitControlReadiness //////////////////////////////
function WaitControlReadiness(v) {
	ValidateValue.apply(this, arguments);
	this.$validator = v;
	this.$order = 10000;
};

WaitControlReadiness.Inherit(ValidateValue, "WaitControlReadiness");
WaitControlReadiness.registerValidator("waitready");
WaitControlReadiness.ImplementProperty("nocheck", null); // ?
WaitControlReadiness.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	return msg;
};
WaitControlReadiness.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	var target = binding.get_target();
	var ctl = null;
	if (BaseObject.is(target, "IUIControlReadiness")) {
		ctl = target;
	} else if (BaseObject.is(target.activeClass, "IUIControlReadiness")) {
		ctl = target.activeClass;
	}
	if (ctl != null) {
		var v = ctl.get_waitcontrolreadystate();
		if (BaseObject.is(v, "Operation")) {
			if (!v.isOperationComplete()) {
				v.then(function(op) {
					validator.reportResult(this, op.isOperationSuccessful()?ValidationResultEnum.correct:ValidationResultEnum.incorrect);
				});
				result = ValidationResultEnum.pending;
			}
		}
	}
	return this.validationResult(result);
};
