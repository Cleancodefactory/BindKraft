(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");


function BooleanConverter() {
	SystemFormatterBase.apply(this,arguments);
}
BooleanConverter.Inherit(SystemFormatterBase,"BooleanConverter");
BooleanConverter.Implement(IArgumentListParserStdImpl,"trim");

BooleanConverter.prototype.Read = function(val, bind, params) {
    var b = val ? true : false;
	
	if (params == "invert" || params == "inv" || params == "!") {
		b = !b;
	}
	return b;
}
BooleanConverter.prototype.Write = function(val, bind, params) {
    var b = val ? true : false;
    if (typeof params == "string" && (params.toLowerCase() == "invert" || params.toLowerCase() == "inv" || params == "!")) {
		b = !b;
    }
    return b;

}

})();