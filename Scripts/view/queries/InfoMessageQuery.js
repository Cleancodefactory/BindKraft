function InfoMessageQuery(msg_obj,numCode,msgType,priority){if(typeof msg_obj=="object"){for(var i in msg_obj){this[i]=msg_obj[i];}}else{this.message=msg_obj;for(var n=1;n<arguments.length;n++){var arg=arguments[n];if(n<2&&typeof arg=="number"){this.code=arg;}else if(n<=2&&typeof arg=="string"){this.messageType=arg;}else if(n<=3&&n>1&&typeof arg=="number"){this.priority=arg;}}}BaseObject.apply(this,arguments);}InfoMessageQuery.Inherit(BaseObject,"InfoMessageQuery");InfoMessageQuery.prototype.alert=function(){alert("Message: "+(this.message!=null)?this.message:""+"\nCode: "+(this.code!=null)?this.code:""+"\nType: "+(this.messageType!=null)?this.messageType:""+"\nPriority: "+(this.priority!=null)?this.priority:"");};InfoMessageQuery.emit=function(objectOn,msg_obj,numCode,msgType,priority){var obj=objectOn;var args=Array.createCopyOf(arguments,1);var msg=new InfoMessageQuery(msg_obj,numCode,msgType,priority);if(BaseObject.is(obj,"IStructuralQueryEmiter")){if(obj.throwStructuralQuery(msg))return;}var wkspc=WorkspaceWindow.DefaultDoNotCreate();if(BaseObject.is(wkspc,"IStructuralQueryEmiter")){if(wkspc.throwStructuralQuery(msg))return;}};