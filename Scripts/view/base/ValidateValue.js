function ValidateValue(validator){BaseObject.apply(this,arguments);}ValidateValue.Inherit(BaseObject,"ValidateValue");ValidateValue.prototype.raw=true;ValidateValue.prototype.fail=new InitializeBooleanParameter('Parameter. If non-zero the validationResult will return failure instead of incorrect.',false);ValidateValue.prototype.$text=null;ValidateValue.prototype.get_text=function(){return this.$text!=null?this.$text:null;};ValidateValue.prototype.set_text=function(v){this.$text=v;};ValidateValue.prototype.get_message=function(){return this.get_text();};ValidateValue.prototype.validateValue=function(validator,value,binding){return ValidationResultEnum.correct;};ValidateValue.prototype.validationResult=function(result){if(this.fail&&result>ValidationResultEnum.correct)return ValidationResultEnum.fail;return result;};ValidateValue.prototype.indicate=false;ValidateValue.prototype.$order=0;ValidateValue.prototype.get_order=function(){return this.$order;};ValidateValue.prototype.set_order=function(v){this.$order=v;};ValidateValue.prototype.$disabled=false;ValidateValue.prototype.get_disabled=function(){return this.$disabled;};ValidateValue.prototype.set_disabled=function(v){this.$disabled=v;};ValidateValue.prototype.isValueEmpty=function(v,bWhiteSpace){if(v==null)return true;if(typeof v=="string"){if(v.length==0)return true;if(bWhiteSpace&&/^\s+$/.test(v))return true;}return false;};