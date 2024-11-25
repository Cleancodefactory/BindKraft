function CLEngine(){BaseObject.apply(this,arguments);}CLEngine.Inherit(BaseObject,"CLEngine");CLEngine.End={end:"CommandLine exhausted!"};CLEngine.repString=/\\(n)|\\(r)|\\(t)|\\(\')|\\(\S)/g;CLEngine.unescapeFullString=function(s){if(typeof s=="string"){return s.replace(CLEngine.repString,function(match,g1){switch(g1){case"n":return"\n";case"r":return"\r";case"'":return"'";default:return g1;}});}else{return s;}};CLEngine.parseNumber=function(s){if(s.indexOf(".")>=0){return parseFloat(s);}else{return parseInt(s,10);}};CLEngine.parseHexNumber=function(s){return parseInt(s,16);};CLEngine.prototype.$commandLine=new InitializeArray("The pre-parsed command line");CLEngine.prototype.$labelIndex=new InitializeObject("The command line's label index");CLEngine.reTokens=[{type:"space",re:/(\s+)/gm,skip:true},{type:"string",re:/\'((?:\\'|[^'])*)\'/gm,proc:CLEngine.unescapeFullString,priority:10,rtype:"literal"},{type:"number",re:/([+\-]?[0-9]+(?:\.[0-9]+)?)/g,proc:CLEngine.parseNumber,priority:10,rtype:"literal"},{type:"hex",re:/(?:0x([0-9a-fA-F]+))/g,proc:CLEngine.parseHexNumber,priority:10,rtype:"literal"},{type:"brnopen",re:/(\()/g,priority:5},{type:"brsopen",re:/(\[)/g},{type:"brcopen",re:/(\{)/g},{type:"brnclose",re:/(\))/g,priority:5},{type:"brsclose",re:/(\])/g,priority:10},{type:"brcclose",re:/(\})/g,priority:10},{type:"ident",re:/([a-zA-Z\_\$][a-zA-Z0-9\_\$]*?)/g,priority:15},{type:"endop",re:/(;)/g,priority:100},{type:"commaop",re:/(\,)/g,priority:90},{type:"dualop",re:/(or|and|xor)/g,priority:60},{type:"dualop",re:/(\=\>|\>\=|\<\=|\=\=)/g,priority:50},{type:"dualop",re:/(\<|\>)/g,priority:50},{type:"dualop",re:/(\*|\/)/g,priority:20},{type:"dualop",re:/(\+|\-)/g,priority:30},{type:"assign",re:/(\=)(?!\=)/g,priority:80}];CLEngine.prototype.$eatToken=function(strLine,mode,pos,tknLine){var match,v;for(var i=0;i<CLEngine.reTokens.length;i++){var retkn=CLEngine.reTokens[i];retkn.re.lastIndex=pos;match=retkn.re.exec(strLine);if(match!=null&&match.index==pos){v=match[1];if(typeof retkn.proc=="function"){v=retkn.proc(v);}if(retkn.skip!==true){tknLine.push({type:retkn.type,value:v,pos:pos,priority:retkn.priority,rtype:retkn.rtype});}return match[0].length;}}return-1;};CLEngine.prototype.tokenizeLine=function(strLine){var tknLine=[];var pos=0;var str=strLine;var mode={stack:[]};do{var n=this.$eatToken(str,mode,pos,tknLine);if(n>0){pos+=n;if(pos>=str.length)break;continue;}else{return"cannot tokenize at "+pos+" ("+str.slice(pos,20)+")";}}while(true);return tknLine;};CLEngine.prototype.processLine=function(arr){var _next;var _vstack=[];var _opstack=[];var _item;var result=[];for(var i=0;i<arr.length;i++){_next=null;if(i<arr.length-1)_next=arr[i+1];var item=arr[i];if(item.rype=="literal"){_vstack.push(item);}else{}}};CLEngine.reExpressionLevel1=/(?:(?:\s|;)*(?:(?:\{((?:\\\S|[^\}])*)\})|(?:\'((?:\'\'|\\\S|[^\'])*)\')|(?:\[([^\]]*)\])|([+-]?[0-9]+(?:\.[0-9]+)?(?=\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\s|,|;|$))|([^;\}\{\"\[\'\]\s]+)))/g;CLEngine.reExpressionLevel2=/(?:(?:^|\s|,|;)*(?:(?:\'((?:\\\S|[^\'])+)\')|([a-zA-Z_][a-zA-Z0-9_\-]*)):(?:([+-]?[0-9]+(?:\.[0-9]+)?(?=\}|\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\}|\s|,|;|$))|(?:\'((?:[^\']|\\\S|\'\')*)\')|([^\,;\}\{\"\[\'\]\s]+))(?:,|$|;|\s))/g;CLEngine.stdLabelCallback=function(labels,current,pos){if(typeof current=="string"&&current.indexOf(":")==0&&current.length>1){labels[current.slice(1)]=pos;return true;}return false;};CLEngine.parseExpression=function(exrstring,index,labelcallback,meta){var callback=function(){};if(typeof index=="object"&&index!=null){callback=labelcallback||CLEngine.stdLabelCallback;}var arr=[];var scope,scopes_stack=[];var newscope=false;if(typeof exrstring=="string"){var r=CommandLine.reExpressionLevel1;var _scope;r.lastIndex=0;var earr=null,pos=0;while(earr=r.exec(exrstring)){if(earr[6]!=null){if(BaseObject.callCallback(callback,index,earr[6],pos)){continue;}else if(earr[6]=="("){arr.push({scope:1});continue;}else if(earr[6]==")"){_scope=scopes_stack.pop();_scope.end=pos;continue;}}pos++;var topscope=scopes_stack.length>0?scopes_stack[scopes_stack.length-1]:null;if(earr[1]!=null){arr.push(this.parseExpressionObject(earr[1]));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"object"});}}else if(earr[2]!=null){arr.push(this.unescapeFullString(earr[2]));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"string"});}}else if(earr[3]!=null){throw"Array on comand line is not supported yet";if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"array"});}}else if(earr[4]!=null){if(earr[4].indexOf(".")>=0){arr.push(parseFloat(earr[4]));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"number",subtype:"double",notation:"dec"});}}else{arr.push(parseInt(earr[4],10));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"number",subtype:"integer",notation:"dec"});}}}else if(earr[6]!=null){arr.push(earr[6]);if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"string",subtype:"identifier"});}}else if(earr[5]!=null){arr.push(parseInt(earr[5],16));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"number",subtype:"integer",notation:"hex"});}}newscope=false;}}return arr;};