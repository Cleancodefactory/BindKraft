(function() {

    function IValidateValue() {}
    IValidateValue.Interface("IValidateValue");

    IValidateValue.prototype.get_ruleName = function() { throw "not implemented.";}
    IValidateValue.prototype.set_ruleName = function(v) { throw "not implemented.";}

    IValidateValue.prototype.get_raw = function() { throw "not implemented.";}
    IValidateValue.prototype.set_raw = function(v) { throw "not implemented.";}
    IValidateValue.prototype.get_fail = function() { throw "not implemented.";}
    IValidateValue.prototype.set_fail = function(v) { throw "not implemented.";}

    ValidateValue.prototype.get_text = function() { throw "not implemented.";}
       
    ValidateValue.prototype.set_text = function(v) { throw "not implemented.";}

    ValidateValue.prototype.get_message = function() { throw "not implemented.";}
        
    ValidateValue.prototype.validateValue = function(validator, value, binding) { throw "not implemented.";}

    ValidateValue.prototype.validationResult = function (result) { throw "not implemented."; }
        
})();