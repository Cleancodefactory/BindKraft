(function() {

    function PassiveValidatorRule() {
        ValidateValue.apply(this,arguments);
    }
    PassiveValidatorRule.Inherit(ValidateValue, "PassiveValidatorRule");
    PassiveValidatorRule.registerValidator("passive");
    PassiveValidatorRule.prototype.get_message = function () {
        var msg = this.get_text();
        if (msg == null || msg.length == 0) {
            msg = "Incorrect value";
        }
        return msg;
    };
    PassiveValidatorRule.ImplementProperty("passiveResult", new InitializeNumericParameter("The constant result", ValidationResultEnum.correct))
    PassiveValidatorRule.prototype.validateValue = function (validator, value, binding) {
        return this.validationResult(this.get_passiveResult());
    };


})();