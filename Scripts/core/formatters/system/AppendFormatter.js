(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");

/**
 * Converts empty values to null in the both direction
 * By default treats the value as string or uses its toString form to determine if it is empty.
 * Parameters number or bool can be passed to do this for numbers or booleans.
 */
function AppendFormatter() {
	SystemFormatterBase.apply(this,arguments);
}
AppendFormatter.Inherit(SystemFormatterBase,"AppendFormatter");
AppendFormatter.Implement(IArgumentListParserStdImpl,"trim");

AppendFormatter.prototype.Read = function(val, bind, params) {
    if (val != null || (typeof val == "string" && val.length > 0)) {
        return val + params;
    } else {
        return val;
    }
}
AppendFormatter.prototype.Write = function(val, bind, params) {
    if (typeof val == "string" && (val.lastIndexOf(params) == val.length-params.length)) {
        return val.slice(0,val.length-params.length);
    }
    return val;
}

})();