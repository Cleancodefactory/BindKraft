(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");


function IntegerConverter() {
	SystemFormatterBase.apply(this,arguments);
}
IntegerConverter.Inherit(SystemFormatterBase,"IntegerConverter");
IntegerConverter.Implement(IArgumentListParserStdImpl,"trim");
IntegerConverter.prototype.Read = function(val, bind, params) {
    if (val == null) return 0;
    var dsys = 10;
    if (typeof params == "string") {
        var x = parseInt(params,10);
        if (!isNaN(x) && x != 0) dsys = x;
    }
    var c = 0;
    c = parseInt(val, dsys);
    if (!isNaN(c)) return c;
	return 0;
}
IntegerConverter.prototype.Write = function(val, bind, params) {
    return val;
}

})();