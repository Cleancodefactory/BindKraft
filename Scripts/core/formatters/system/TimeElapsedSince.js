(function(){var SystemFormatterBase=Class("SystemFormatterBase");var IArgumentListParserStdImpl=InterfaceImplementer("IArgumentListParserStdImpl");function TimeElapsedSince(){SystemFormatterBase.apply(this,arguments);}TimeElapsedSince.Inherit(SystemFormatterBase,"TimeElapsedSince");TimeElapsedSince.Implement(IArgumentListParserStdImpl,"trim");TimeElapsedSince.prototype.Read=function(val,bind,params){if(val instanceof Date){var now=Date.now();var msec=now-val.getTime();var sec=msec/1000;var s="";if(sec<60){return Math.floor(sec)+" seconds";}else if(sec<60*60){return Math.floor(sec/60)+" minutes";}else if(sec<24*60*60){s+=Math.floor(sec/3600)+" hours";s+=" and "+Math.floor(sec/60)+" minutes";return s;}else{return Math.floor(sec/(24*3600))+" days";}}return"--";};TimeElapsedSince.prototype.Write=function(val,bind,params){return val;};})();