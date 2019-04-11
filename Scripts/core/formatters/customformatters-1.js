// This file is supposed to contain set 1 of reusable custom formatters (see CustomFormatterBase - available from version 2.8.0)

/*
	{   format=myfmt(a b c d) path=someobj   }
*/

function ConcatStringFieldsFormatter() {
	CustomFormatterBase.apply(this, arguments);
}
ConcatStringFieldsFormatter.Inherit(CustomFormatterBase,"ConcatStringFieldsFormatter");
// ConcatStringFieldsFormatter.Implement(IArgumentListParserStdImpl, "none");
ConcatStringFieldsFormatter.prototype.Read = function(host, val, bind, arg) {
	var outdelimiter = " "; // Will be 
	if (BaseObject.is(arg, "string")) {
		var arr = arg.split(/\s+/);
		var result = "";
		for (var i = 0; i < arr.length; i++) {
			result += ((result.length > 0)?" ":"") + ((BaseObject.getProperty(val,arr[i]) != null)?BaseObject.getProperty(val,arr[i]):"");
		}
		return result;
	}
	return val;
}