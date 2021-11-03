(function () {
    function SymbolSetValidatorRule(v) {
        ValidateValue.apply(this, arguments);
    }
    SymbolSetValidatorRule.Inherit(ValidateValue, "SymbolSetValidatorRule");
    SymbolSetValidatorRule.registerValidator("symbolset");
    SymbolSetValidatorRule.ImplementProperty("symbols", new InitializeStringParameter("allowed symbols", null));
    SymbolSetValidatorRule.ImplementProperty("caseinsensitive", new InitializeStringParameter("Case doesn't matter", false));
    
    SymbolSetValidatorRule.prototype.get_message = function () {
        var msg = this.get_text();
        
        if (msg == null || msg.length == 0) {
            msg = "There is a symbol which is not allowed";
        }
        return msg;
    };
    SymbolSetValidatorRule.prototype.validateValue = function (validator, value, binding) {
        var result = ValidationResultEnum.correct;
        var symbolset = this.get_symbolset();
        if (symbolset == null) return result;

        if (typeof value == "string" && value.length > 0) {
            var ch = null;
            if (this.get_caseinsensitive()) {
                for (var i = 0; i < value.length; i++) {
                    ch = value.charAt(i);
                    if (symbolset.indexOf(ch.toUpperCase()) < 0) {
                        result = ValidationResultEnum.incorrect;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < value.length; i++) {
                    ch = value.charAt(i);
                    
                    if (symbolset.indexOf(ch) < 0) {
                        result = ValidationResultEnum.incorrect;
                        break;
                    }
                }
            }
        }
        return this.validationResult(result);
    };
    var UrlValidatorControl = SymbolSetValidatorRule;
})();
