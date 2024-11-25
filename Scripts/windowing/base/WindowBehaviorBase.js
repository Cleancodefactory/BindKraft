function WindowBehaviorBase(nomultiuse){BaseObject.apply(this,arguments);this.$nomultiuse=nomultiuse?true:false;}WindowBehaviorBase.Inherit(BaseObject,"WindowBehaviorBase");WindowBehaviorBase.Implement(IWindowBehavior);WindowBehaviorBase.prototype.$nomultiuse=false;WindowBehaviorBase.prototype.$window=null;WindowBehaviorBase.prototype.init=function(wnd){if(this.$window!=null&&this.$nomultiuse){throw"The window behavior "+this.classType()+" is already attached to a window and it does not allow the same instance to be attached to many windows - see nomultiuse WindowBehaviorBase constructor argument.";}this.$window=wnd;this.oninit(wnd);};WindowBehaviorBase.prototype.oninit=function(wnd){};WindowBehaviorBase.prototype.uninit=function(wnd){this.$window=null;this.onuninit(wnd);};WindowBehaviorBase.prototype.onuninit=function(wnd){};WindowBehaviorBase.prototype.$paused=false;WindowBehaviorBase.prototype.pause=function(){this.$paused=true;};WindowBehaviorBase.prototype.resume=function(){this.$paused=false;};WindowBehaviorBase.prototype.isPaused=function(){return this.$paused;};WindowBehaviorBase.prototype.$uniqueCallback=function(other){if(BaseObject.is(other,this.classType()))return true;return false;};WindowBehaviorBase.prototype.get_uniquecallback=function(){return new Delegate(this,this.$uniqueCallback);};