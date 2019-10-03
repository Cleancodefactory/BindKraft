////////////// StateCodeValidatorRule //////////////////////////////
function StateCodeValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
StateCodeValidatorRule.Inherit(ValidateValue, "StateCodeValidatorRule");
StateCodeValidatorRule.registerValidator("statecode");
StateCodeValidatorRule.expresion = /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/;
StateCodeValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.StateCode");
	}
	if (msg == null || msg.length == 0) {
		msg = "Invalid code";
	}
	return msg.sprintf();
};
StateCodeValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!this.isValueEmpty(value) && typeof value == "string") {
		if (!(value.match(StateCodeValidatorRule.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
var StateCodeValidatorControl = StateCodeValidatorRule;
//////////////////////END/////////////////////////////