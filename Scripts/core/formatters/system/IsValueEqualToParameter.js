(function(){var SystemFormatterBase=Class("SystemFormatterBase");var IArgumentListParserStdImpl=InterfaceImplementer("IArgumentListParserStdImpl");function IsValueEqualToParameter(){SystemFormatterBase.apply(this,arguments);}IsValueEqualToParameter.Inherit(SystemFormatterBase,"IsValueEqualToParameter");IsValueEqualToParameter.Implement(IArgumentListParserStdImpl,"trim");IsValueEqualToParameter.prototype.Read=function(val,bind,params){if(bind!=null){if((val==null||val=="")&&(bind.bindingParameter==null||bind.bindingParameter=="")){return true;}return val==bind.bindingParameter;}else{return false;}};IsValueEqualToParameter.prototype.Write=function(val,bind,params){if(bind!=null){if((val==null||val=="")&&(bind.bindingParameter==null||bind.bindingParameter=="")){return true;}return val==bind.bindingParameter;}else{return false;}};})();