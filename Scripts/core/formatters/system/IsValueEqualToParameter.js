(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");

/**
 * Converts empty values to null in the both direction
 * By default treats the value as string or uses its toString form to determine if it is empty.
 * Parameters number or bool can be passed to do this for numbers or booleans.
 */
function IsValueEqualToParameter() {
	SystemFormatterBase.apply(this,arguments);
}
IsValueEqualToParameter.Inherit(SystemFormatterBase,"IsValueEqualToParameter");
IsValueEqualToParameter.Implement(IArgumentListParserStdImpl,"trim");

IsValueEqualToParameter.prototype.Read = function(val, bind, params) {
    if (bind != null) {
        var bp = bind.bindingParameter;
        if (params != null && !/^\s*$/.test(params)) {
            bp = bind.getRef(params);
        }
        if ((val == null || val == "") 
             && 
             (bp == null || bp == "")) {
                 return true;
             }
        return (val == bp);
    } else {
        return false;
    }
}
IsValueEqualToParameter.prototype.Write = IsValueEqualToParameter.prototype.Read;


})();