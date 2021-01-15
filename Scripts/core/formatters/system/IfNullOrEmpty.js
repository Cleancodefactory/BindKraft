(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");

/**
 * Returns its parameter if the value is null or an empty string.
 * Does it only on Read (ToTarget). In the other direction it returns the value without changes.
 */
function IfNullOrEmpty() {
	SystemFormatterBase.apply(this,arguments);
}
IfNullOrEmpty.Inherit(SystemFormatterBase,"IfNullOrEmpty");
IfNullOrEmpty.Implement(IArgumentListParserStdImpl,"trim");
IfNullOrEmpty.prototype.$valtype = function(params) {
    if (params == null || /^\s*$/.test(params)) return "string";
    if (/^(int|number|float|double)$/.test(params)) return "number";
    if (/^(bool|boolean)$/.test(params)) return "bool";
    return "string";
}

IfNullOrEmpty.prototype.Read = function(val, bind, params) {
    if (val == null || (typeof val == "string" && val.length == 0)) {
        return params;
    } else {
        return val;
    }
}
IfNullOrEmpty.prototype.Write = function(val, bind, params) {
    return val;
}

})();