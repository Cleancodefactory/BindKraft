////////////// LengthValidatorRule //////////////////////////////
function LengthValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
LengthValidatorRule.Inherit(ValidateValue, "LengthValidatorRule");
LengthValidatorRule.registerValidator("length");
LengthValidatorRule.prototype.$minChar = null;
LengthValidatorRule.prototype.$maxChar = null;
LengthValidatorRule.prototype.$allowEmptySpaces = true;
LengthValidatorRule.prototype.set_minChar = function (v) {
	this.$minChar = v;
};
LengthValidatorRule.prototype.set_maxChar = function (v) {
	this.$maxChar = v;
};
LengthValidatorRule.prototype.set_allowEmptySpaces = function (v) {
	this.$allowEmptySpaces = 
		(v === 1 || v === "1" || v === "true" || v === true) ? true: false;
};
LengthValidatorRule.prototype.get_minChar = function () {
	return this.$minChar;
};
LengthValidatorRule.prototype.get_maxChar = function () {
	return this.$maxChar;
};
LengthValidatorRule.prototype.get_allowEmptySpaces = function () {
	return this.$allowEmptySpaces;
};
LengthValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Length");
	}
	if (msg == null || msg.length == 0) {
		msg = this.get_allowEmptySpaces() ? 
		"Input value must be between %l and %l" : 
		"Input value must be between %l and %l. Only empty spaces are not allowed!";
	}
	return msg.sprintf(this.get_minChar(), this.get_maxChar());
};
LengthValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (typeof value != "string" || value.length == 0) return this.validationResult(result);
	
	var min = this.get_minChar();
	var max = this.get_maxChar();
	
	if (!this.get_allowEmptySpaces())
		value = value.trim();
	
	if (!IsNull(value) && (!IsNull(min)) && (!IsNull(max))) {
		if ((value.length < min) || (max < value.length)) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
LengthValidatorControl = LengthValidatorRule;
//////////////////////END/////////////////////////////