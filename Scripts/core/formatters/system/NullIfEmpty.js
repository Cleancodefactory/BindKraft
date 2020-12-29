(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");

/**
 * Converts empty values to null in the both direction
 * By default treats the value as string or uses its toString form to determine if it is empty.
 * Parameters number or bool can be passed to do this for numbers or booleans.
 */
function NullIfEmpty() {
	SystemFormatterBase.apply(this,arguments);
}
NullIfEmpty.Inherit(SystemFormatterBase,"NullIfEmpty");
NullIfEmpty.Implement(IArgumentListParserStdImpl,"trim");
NullIfEmpty.prototype.$valtype = function(params) {
    if (params == null || /^\s*$/.test(params)) return "string";
    if (/^(int|number|float|double)$/.test(params)) return "number";
    if (/^(bool|boolean)$/.test(params)) return "bool";
    return "string";
}

NullIfEmpty.prototype.Read = function(val, bind, params) {
    var type = this.$valtype(params);
    switch (type) {
        case "number":
            if (val == 0 || isNaN(val)) return null;
            return val;
        case "bool":
            if (!val) return null;
            return val;
        default:
            if (val != null && (val + "").length == 0) return null;
            if (typeof val == "string" && val.length == 0) return null;
            return val;
    }
}
NullIfEmpty.prototype.Write = function(val, bind, params) {
    var type = this.$valtype(params);
    switch (type) {
        case "number":
            if (val == 0 || isNaN(val)) return null;
            return val;
        case "bool":
            if (!val) return null;
            return val;
        default:
            if (val != null && (val + "").length == 0) return null;
            if (typeof val == "string" && val.length == 0) return null;
            return val;
    }
}

})();