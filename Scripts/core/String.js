String.Ellipsis=function(str,maxlen){if(maxlen==null||maxlen==0)return str;var s=str+"";if(s.length>maxlen){return s.slice(0,maxlen)+"...";}else{return s;}};String.prototype.Trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"");}.Description("Removes any white space characters from the beginning and the end of a string").Returns("string");if(!String.prototype.trim){String.prototype.trim=String.prototype.Trim;}String.prototype.formatLength=function(n,al,lchar,rchar){var str="";var i,j;if(this.length<n){switch(al){case 0:for(i=0;i<n-this.length;i++)str+=lchar;str+=this;break;case 2:j=Math.floor(n/2);for(i=0;i<j;i++)str+=lchar;str+=this;for(i=0;i<j;i++)str+=rchar;if(n%2)str+=rchar;break;default:str+=this;for(i=0;i<n-this.length;i++)str+=rchar;}}else{if(al==1){str=this.slice(this.length-n);}else{str=this.slice(0,n);}}return str;};String.prototype.formatArray=function(arrArgs){var fmt=this;var re=/%\d*[fn]*[lrc]{1}/gi;var reNum=/\d+/gi;var fmtParts=fmt.split(re);var fmtArgs=fmt.match(re);var nP=0,nA=0,nAFirst=0;var str="";var fmtArgWidth;var width;var strTemp;var argTmp;var xlchar,xrchar;if(fmtParts==null)fmtParts=new Array();if(fmtArgs==null)fmtArgs=new Array();while(nP<fmtArgs.length||nA<fmtParts.length){if(nA<nP+nAFirst){if(nA<fmtArgs.length){if(nA<arrArgs.length){fmtArgWidth=fmtArgs[nA].match(reNum);if(fmtArgWidth!=null)width=new Number(fmtArgWidth[0]);else width=0;xlchar=" ";xrchar=" ";switch(fmtArgs[nA].charAt(fmtArgs[nA].length-2)){case"f":if(fmtArgs[nA].charAt(1)=="0")xlchar="0";argTmp=parseFloat(arrArgs[nA]);break;case"n":if(fmtArgs[nA].charAt(1)=="0")xlchar="0";argTmp=parseInt(arrArgs[nA],10);break;default:if(fmtArgs[nA].charAt(1)=="0")xlchar="0";argTmp=arrArgs[nA];}strTemp=new String(argTmp);if(width==0){width=strTemp.length;}switch(fmtArgs[nA].charAt(fmtArgs[nA].length-1)){case"r":str+=strTemp.formatLength(width,0,xlchar,xrchar);break;case"c":str+=strTemp.formatLength(width,2,xlchar,xrchar);break;default:str+=strTemp.formatLength(width,1,xlchar,xrchar);}}}nA++;}else{if(nP<fmtParts.length){str+=fmtParts[nP];}nP++;}}return str;};String.prototype.sprintf=function(){return this.formatArray(arguments);};function sprintf(str){var i;var arr=new Array();for(i=1;i<arguments.length;i++){arr[arr.length]=arguments[i];}return str.formatArray(arr);};String.prototype.format=function(){var formatted=this;for(var i=0;i<arguments.length;i++){var regexp=new RegExp('\\{'+i+'\\}','gi');formatted=formatted.replace(regexp,arguments[i]);}return formatted;};String.prototype.inSet=function(obj,bSearchKeys){var i;if(BaseObject.is(obj,"Array")){if(obj.findElement(this)>=0)return true;}else if(BaseObject.is(obj,"string")){if(obj.indexOf(this)>=0)return true;}else if(typeof obj=="object"){if(!bSearchKeys){for(i in obj){if(obj[i]==this)return true;}}else{for(i in obj){if(i==this)return true;}}}return false;};String.reSplitQuotedString=/\'.*?\'(?=(\s|\,|$))/gi;String.prototype.splitQuotedList=function(){if(this.length==0)return[];var result=this.match(String.reSplitQuotedString);if(result!=null){for(var i=0;i<result.length;i++){result[i]=result[i].slice(1,-1).replace("''","'");}}return result;};(function(){function _toregex(re){if(re instanceof RegExp){if(re.global)return re;var f="g";if(re.ignoreCase)f+="i";if(re.multiline)f+="m";return new RegExp(re.source,f);}if(typeof re=="string")return new RegExp(re,"g");return null;};String.reGroups=function(str,_re,name1,name2){var re=_toregex(_re);var result={hasmatches:0};if(re==null||str==null)return result;if(str!=null){var _str=str||"";if(re!=null){var names=["match"];if(BaseObject.is(name1,"Array")){names=Array.createCopyOf(name1);}else if(arguments.length>2){names=Array.createCopyOf(arguments,2);}names.Each(function(idx,item){result[item]=[];});re.lastIndex=0;var arr;var lastIndex=-1;while(arr=re.exec(_str)){if(re.lastIndex==lastIndex){return result;}lastIndex=re.lastIndex;result.hasmatches++;if(arr.length>1){for(var i=0;i<names.length;i++){if(result[names[i]]==null){result[names[i]]=[];}result[names[i]].push(arr[i+1]);}}else{if(result[names[0]]==null){result[names[0]]=[];}result[names[0]].push(arr[0]);}}}}return result;};String.reGroups2=function(str,_re,name1,name2){var re=_toregex(_re);var result=[];result.hasmatches=0;if(re==null||str==null)return result;if(str!=null){var _str=str||"";if(re!=null){var names=["match"];if(BaseObject.is(name1,"Array")){names=Array.createCopyOf(name1);}else if(arguments.length>2){names=Array.createCopyOf(arguments,2);}re.lastIndex=0;var arr;var o;var lastIndex=-1;while(arr=re.exec(_str)){if(re.lastIndex==lastIndex){return result;}lastIndex=re.lastIndex;result.hasmatches++;o={};if(arr.length>1){for(var i=0;i<names.length;i++){if(o[names[i]]==null){o[names[i]]=arr[i+1];}}}else{o[names[0]]=arr[0];}result.push(o);}}}return result;};String.parseSplit=function(str,_re,callback,callbackParam){var re=_toregex(_re);var result=[];result.hasmatches=0;if(re==null||str==null)return result;if(!re.global){BaseObject.LASTERROR("Split RegExp must be global","String.parseSplit");return result;}var arr;var _str=str+"";re.lastIndex=0;var lastIndex=-1;var o;while(arr=re.exec(_str)){result.hasmatches++;if(lastIndex<0)lastIndex=0;o={part:_str.slice(lastIndex,arr.index),separator:arr};if(BaseObject.isCallback(callback)){o.separator=BaseObject.callCallback(callback,o);}else{o.separator=arr[0];}result.push(o);lastIndex=re.lastIndex;}if(lastIndex<_str.length){o={part:_str.slice(lastIndex),separator:null};if(BaseObject.isCallback(callback)){o.separator=BaseObject.callCallback(callback,o);}result.push(o);}return result;};})();