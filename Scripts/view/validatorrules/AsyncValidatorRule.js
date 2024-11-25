function AsyncValidatorRule(v){ValidateValue.apply(this,arguments);this.$validator=v;this.$order=10000;};AsyncValidatorRule.Inherit(ValidateValue,"AsyncValidatorRule");AsyncValidatorRule.registerValidator("async");AsyncValidatorRule.prototype.$validator=null;AsyncValidatorRule.prototype.get_delegate=function(){return null;};AsyncValidatorRule.prototype.get_param1=function(){return null;};AsyncValidatorRule.prototype.get_param2=function(){return null;};AsyncValidatorRule.prototype.get_param3=function(){return null;};AsyncValidatorRule.ImplementProperty("nocheck",null);AsyncValidatorRule.prototype.get_message=function(lastValue){var msg=this.get_text();if(msg!=null&&msg.length>0)msg=msg.sprintf(lastValue);return msg;};AsyncValidatorRule.prototype.validateValue=function(validator,value,binding){var result=ValidationResultEnum.correct;var d=this.get_delegate();if(this.get_nocheck()||d!=null&&!IsNull(value)){var r=d.invoke({rule:this,validator:validator,value:value,binding:binding});if(r>result)result=r;if(r==ValidationResultEnum.pending)return r;}return this.validationResult(result);};AsyncValidatorRule.prototype.reportBack=function(result,message,forceIndicate){if(message!=null)this.$text=message;if(this.$validator!=null){this.indicate=forceIndicate;this.$validator.reportResult(this,result);}};var AsyncValidatorControl=AsyncValidatorRule;