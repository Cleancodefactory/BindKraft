function CommandLine(cmdline,advancedmode){BaseObject.apply(this,arguments);if(typeof cmdline=="string"){var arr=CommandLine.parseExpression(cmdline,this.$programIndex,null,this.$meta);this.$commandLine=arr;this.$advancedmode=advancedmode===true;}else if(BaseObject.is(cmdline,"CommandLine")){this.$meta=cmdline.$meta;this.$commandLine=cmdline.$commandLine;this.$programIndex=cmdline.$programIndex;this.$position=cmdline.$position;this.$stack=cmdline.$stack;this.$advancedmode=true;if(typeof advancedmode=="number"){this.reset();this.set_position(advancedmode);}else if(typeof advancedmode=="string"){this.reset();this.set_position(this.label(advancedmode));}this.$advancedmode=cmdline.$advancedmode;}}CommandLine.Inherit(BaseObject,"CommandLine");CommandLine.prototype.clone=function(pos_or_label){return new CommandLine(this,pos_or_label);};CommandLine.prototype.$advancedmode=false;CommandLine.prototype.$meta=new InitializeArray("Parallel to $commandLine - metainfo for each element there.");CommandLine.prototype.$commandLine=new InitializeArray("The command line");CommandLine.prototype.get_commandline=function(){var cl=[];for(var i=0;i<this.$commandLine.length;i++){cl.push({pos:i,label:this.labelAt(i),token:this.$commandLine[i],meta:this.$meta[i],scopeborder:this.isScopeBorder(i)});}return cl;};CommandLine.prototype.labelAt=function(pos){for(var k in this.$programIndex){if(this.$programIndex[k]==pos)return k;}return null;};CommandLine.prototype.$programIndex=new InitializeObject("The command line's label index");CommandLine.prototype.get_commandIndex=function(){return BaseObject.DeepClone(this.$programIndex);};CommandLine.prototype.$scopes=new InitializeArray("");CommandLine.prototype.$position=0;CommandLine.prototype.get_position=function(){return this.$position;};CommandLine.prototype.set_position=function(v){if(!this.$advancedmode)throw"set_position is allowed in advanced mode only";if(v>=0&&v<this.$commandLine.length){this.$position=v;}};CommandLine.prototype.$stack=new InitializeArray("optional stack for advanced execution");CommandLine.prototype.pushpos=function(){if(!this.$advancedmode)throw"pushpos is allowed in advanced mode only";this.$stack.push(this.get_position());};CommandLine.prototype.poppos=function(){if(!this.$advancedmode)throw"poppos is allowed in advanced mode only";var p=this.$stack.pop();this.set_position(p);};CommandLine.prototype.reset=function(){if(!this.$advancedmode)throw"reset is allowed in advanced mode only";this.set_position(0);this.$stack=[];};CommandLine.prototype.call=function(pos){if(!this.$advancedmode)throw"call is allowed in advanced mode only";this.pushpos();this.set_position(pos);};CommandLine.prototype.ret=function(){if(!this.$advancedmode)throw"ret is allowed in advanced mode only";this.poppos();};CommandLine.prototype.label=function(label){var pos=this.$programIndex[label];if(typeof pos=="number"&&!isNaN(pos)){return pos;}return null;};CommandLine.prototype.jump=function(pos){if(!this.$advancedmode)throw"call is allowed in advanced mode only";this.set_position(pos);};CommandLine.prototype.totalTokens=function(){return this.$commandLine.length;};CommandLine.prototype.getScope=function(pos){var i=[pos!=null?pos:this.get_position()];if(i>=0&&i<this.totalTokens()){var m=this.$meta[i];if(m!=null)return m.scope;}return null;};CommandLine.prototype.areScopesEqual=function(s1,s2){if(s1==null&&s2==null)return true;if(s1==s2)return true;if(s1!=null&&s2==null||s1==null&&s2!=null)return false;if(s1.start==s2.start&&s1.end==s2.end)return true;return false;};CommandLine.prototype.isScopeBorder=function(pos){var p=pos||this.get_position();if(p<this.totalTokens()-1){return!this.areScopesEqual(this.getScope(p),this.getScope(p+1));}else{return true;}return false;};CommandLine.End={end:"CommandLine exhausted!"};CommandLine.prototype.next=function(){if(this.get_position()>=0&&this.get_position()<this.$commandLine.length){var r={token:this.$commandLine[this.get_position()],meta:this.$meta[this.get_position()]};this.$position++;return r;}else{return CommandLine.End;}};CommandLine.prototype.peekrel=function(n){var pos=this.get_position()+n;if(pos>=0&&pos<this.$commandLine.length){var r={token:this.$commandLine[pos],meta:this.$meta[pos]};return r;}else{return CommandLine.End;}};CommandLine.prototype.peekabs=function(n){var pos=n;if(pos>=0&&pos<this.$commandLine.length){var r={token:this.$commandLine[pos],meta:this.$meta[pos]};return r;}else{return CommandLine.End;}};CommandLine.reExpressionLevel1=/(?:(?:\s|;)*(?:(?:\{((?:\\\S|[^\}])*)\})|(?:\'((?:\'\'|\\\S|[^\'])*)\')|(?:\[([^\]]*)\])|([+-]?[0-9]+(?:\.[0-9]+)?(?=\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\s|,|;|$))|([^;\}\{\"\[\'\]\s]+)))/g;CommandLine.reExpressionLevel2=/(?:(?:^|\s|,|;)*(?:(?:\'((?:\\\S|[^\'])+)\')|([a-zA-Z_][a-zA-Z0-9_\-]*)):(?:([+-]?[0-9]+(?:\.[0-9]+)?(?=\}|\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\}|\s|,|;|$))|(?:\'((?:[^\']|\\\S|\'\')*)\')|([^\,;\}\{\"\[\'\]\s]+))(?:,|$|;|\s))/g;CommandLine.repString=/\\(\S)|\'(\')/g;CommandLine.unescapeFullString=function(s){if(typeof s=="string"){return s.replace(CommandLine.repString,"$1$2");}else{return s;}};CommandLine.parseExpressionObject=function(ostr){var o={};if(typeof ostr=="string"&&ostr.length>0){var r=CommandLine.reExpressionLevel2;r.lastIndex=0;var earr=null;while(earr=r.exec(ostr)){var name=null;var value=null;if(earr[1]!=null){name=this.unescapeFullString(earr[1]);}else if(earr[2]!=null){name=earr[2];}if(typeof name!="string"){continue;}if(earr[3]!=null){if(earr[3].indexOf(".")>=0){value=parseFloat(earr[3]);}else{value=parseInt(earr[3],10);}}else if(earr[4]!=null){value=this.unescapeFullString(earr[4]);}else if(earr[6]!=null){value=earr[6];}else if(earr[5]!=null){value=parseInt(earr[5],16);}o[name]=value;}}return o;};CommandLine.stdLabelCallback=function(labels,current,pos){if(typeof current=="string"&&current.indexOf(":")==0&&current.length>1){labels[current.slice(1)]=pos;return true;}return false;};CommandLine.parseExpression=function(exrstring,index,labelcallback,meta){var callback=function(){};if(typeof index=="object"&&index!=null){callback=labelcallback||CommandLine.stdLabelCallback;}var arr=[];var scope,scopes_stack=[];var newscope=false;if(typeof exrstring=="string"){var r=CommandLine.reExpressionLevel1;var _scope;r.lastIndex=0;var earr=null,pos=0;while(earr=r.exec(exrstring)){if(earr[6]!=null){if(BaseObject.callCallback(callback,index,earr[6],pos)){continue;}else if(earr[6]=="("){scope={start:pos,end:null};scopes_stack.push(scope);newscope=true;continue;}else if(earr[6]==")"){_scope=scopes_stack.pop();_scope.end=pos;continue;}}pos++;var topscope=scopes_stack.length>0?scopes_stack[scopes_stack.length-1]:null;if(earr[1]!=null){arr.push(this.parseExpressionObject(earr[1]));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"object"});}}else if(earr[2]!=null){arr.push(this.unescapeFullString(earr[2]));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"string"});}}else if(earr[3]!=null){throw"Array on comand line is not supported yet";if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"array"});}}else if(earr[4]!=null){if(earr[4].indexOf(".")>=0){arr.push(parseFloat(earr[4]));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"number",subtype:"double",notation:"dec"});}}else{arr.push(parseInt(earr[4],10));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"number",subtype:"integer",notation:"dec"});}}}else if(earr[6]!=null){arr.push(earr[6]);if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"string",subtype:"identifier"});}}else if(earr[5]!=null){arr.push(parseInt(earr[5],16));if(BaseObject.is(meta,"Array")){meta.push({scope:topscope,scopestart:newscope,type:"number",subtype:"integer",notation:"hex"});}}newscope=false;}}return arr;};CommandLine.isScopeStart=function(pos){if(typeof pos=="number"){}};