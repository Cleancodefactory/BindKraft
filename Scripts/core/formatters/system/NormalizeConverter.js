(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");

/**
 * Converts empty values to null in the both direction
 * By default treats the value as string or uses its toString form to determine if it is empty.
 * Parameters number or bool can be passed to do this for numbers or booleans.
 */
function NormalizeConverter() {
	SystemFormatterBase.apply(this,arguments);
}
NormalizeConverter.Inherit(SystemFormatterBase,"NormalizeConverter");
NormalizeConverter.Implement(IArgumentListParserStdImpl,"spaced");

NormalizeConverter.prototype.Read = function(val, bind, params) {
    if (typeof val != "number") return val;
    if (isNaN(val)) return null;
    for (var i = 0;i < params != null && i < params.length;i++) {
        if (typeof params[i] != "number") return val;
    }
    if (params != null && params.length > 0) {
        if (params.length == 2) {
            var o = params[0], t = params[1];
            return t + val - o;
        } else if (params.length == 4) {
            var omin = params[0], omax = params[1], tmin = params[2], tmax = params[3];
            var x = ((val - omin) / (omax - omin)) * (tmax - tmin) + tmin;
            return isNaN(x)?null:x;
        } else {
            return val;
        }
    } else {
        return val;
    }
}
NormalizeConverter.prototype.Write = function(val, bind, params) {
    
    return val;
}

})();