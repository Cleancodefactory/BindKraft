function ControllableAsyncResult(scheduler,obj_or_delegate,func){var disp=null;if(BaseObject.is(obj_or_delegate,"Delegate")){disp=new Dispatchable(obj_or_delegate);}else if(obj_or_delegate!=null){if(typeof func!="function"&&typeof func!="string")throw"Invalid argument, expected function or string (name of a method)";disp=new Dispatchable(new Delegate(obj_or_delegate,func));}AsyncResult.call(this,scheduler,disp);}ControllableAsyncResult.Inherit(AsyncResult,"ControllableAsyncResult");ControllableAsyncResult.prototype.$condition=null;ControllableAsyncResult.prototype.trace=function(onOff){this.traceOn=onOff;return this;};ControllableAsyncResult.prototype.key=function(keyname){this.set_key(keyname);return this;};ControllableAsyncResult.prototype.condition=function(cond){this.$condition=cond;return this;};ControllableAsyncResult.prototype.chain=function(chain){this.$chainOn=chain;return this;};ControllableAsyncResult.prototype.chainIf=function(keys){var ar=CallContext.currentAsyncResult(keys);if(ar!=null){this.$chainOn=ar;}return this;};ControllableAsyncResult.prototype.maxAge=function(v){this.$maxAge=v;return this;};ControllableAsyncResult.prototype.after=function(v){this.$after=v;return this;};ControllableAsyncResult.prototype.options=function(v){this.scheduleOptions=v;return this;};ControllableAsyncResult.prototype.continuous=function(v){if(v){this.scheduleOptions&=0xFFFF^ProcessScheduleOptionsEnum.ExplicitMask;this.scheduleOptions|=ProcessScheduleOptionsEnum.Continue;}else{this.scheduleOptions&=0xFFFF^ProcessScheduleOptionsEnum.ExplicitMask;}return this;};ControllableAsyncResult.prototype.lowpriority=function(v){if(v){this.scheduleOptions&=0xFFFF^ProcessScheduleOptionsEnum.ExplicitMask;this.scheduleOptions|=ProcessScheduleOptionsEnum.Later;}else{this.scheduleOptions&=0xFFFF^ProcessScheduleOptionsEnum.ExplicitMask;}return this;};ControllableAsyncResult.prototype.execute=function(){var task=this.get_task();if(BaseObject.is(task,"IDispatchable")){if(arguments.length>0){if(task.supportsArguments()){task.applyArguments(arguments);}else{throw"The dispatchable does not support arguments";}}if(this.$scheduler!=null){this.$scheduler.schedule(this,this.$chainOn,this.$condition,this.$maxAge,this.$after);}else{throw"Scheduler is not set";}}else{throw"Cannot execute. The dispatchable is not available.";}return this;};ControllableAsyncResult.prototype.apply=function(args){var task=this.get_task();if(BaseObject.is(task,"IDispatchable")){if(args!=null){if(task.supportsArguments()){task.applyArguments(args);}else{throw"The dispatchable does not support arguments";}}if(this.$scheduler!=null){this.$scheduler.schedule(this,this.$chainOn,this.$condition,this.$maxAge,this.$after);}else{throw"Scheduler is not set";}}else{throw"Cannot execute. The dispatchable is not available.";}return this;};