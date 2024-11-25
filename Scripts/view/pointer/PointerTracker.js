function PointerTracker(eventmode){BaseObject.apply(this,arguments);if(window.JBCoreConstants.TrackTouchEvents&&window.TouchEvent)this.$touchOn=true;this.set_eventmode(eventmode);this.$clearTrackData();}PointerTracker.Inherit(BaseObject,"PointerTracker");PointerTracker.prototype.$touchOn=false;PointerTracker.prototype.get_defaultMode=function(){var m=window.JBCoreConstants.TrackingDefaultMode;return m!=null?m:"mouse";};PointerTracker.prototype.get_eventmode=function(){if(this.$events==this.$eventNames.pointer)return"pointer";if(this.$events==this.$eventNames.mouse)return"mouse";return null;};PointerTracker.prototype.set_eventmode=function(v){this.$uninitTracker();if(v=="pointer"){this.$events=this.$eventNames.pointer;}else if(v=="mouse"){this.$events=this.$eventNames.mouse;}else{this.$events=this.$eventNames[this.get_defaultMode()];}this.$initTracker();};PointerTracker.prototype.$eventNames={mouse:{move:"mousemove",down:"mousedown",up:"mouseup"},pointer:{move:"pointermove",down:"pointerdown",up:"pointerup"}};PointerTracker.prototype.$events=PointerTracker.prototype.$eventNames.mouse;PointerTracker.keyStates={ctrlKey:false,altKey:false,metaKey:false,shiftKey:false};PointerTracker.prototype.$tracking=false;PointerTracker.prototype.$client=null;PointerTracker.prototype.$lastClientPoint=null;PointerTracker.prototype.$lastPagePoint=null;PointerTracker.prototype.$lastKeyState={};PointerTracker.prototype.$clearTrackData=function(){this.$lastClientPoint=null;this.$lastPagePoint=null;this.$lastKeyState={};this.$client=null;this.$tracking=false;this.$mainTouchId=null;}.Description("Clears all the dynamic tracking data");PointerTracker.prototype.$uninitTracker=function(){var body=window.document.body;body.removeEventListener(this.$events.move,this.$handleMouseMove,true);body.removeEventListener(this.$events.down,this.$handleMouseDown,true);body.removeEventListener(this.$events.up,this.$handleMouseUp,true);body.removeEventListener("keyup",this.$handleKeyUp,true);if(this.$touchOn){body.removeEventListener("touchstart",this.$handleTouchStart,{capture:true});body.removeEventListener("touchmove",this.$handleTouchMove,{capture:true});body.removeEventListener("touchend",this.$handleTouchEnd,{capture:true});body.removeEventListener("touchcancel",this.$handleTouchCancel,{capture:true});}};PointerTracker.prototype.$initTracker=function(){var body=window.document.body;body.addEventListener(this.$events.move,this.$handleMouseMove,true);body.addEventListener(this.$events.down,this.$handleMouseDown,true);body.addEventListener(this.$events.up,this.$handleMouseUp,true);body.addEventListener("keyup",this.$handleKeyUp,true);if(this.$touchOn){body.addEventListener("touchstart",this.$handleTouchStart,{capture:true,passive:false});body.addEventListener("touchmove",this.$handleTouchMove,{capture:true,passive:false});body.addEventListener("touchend",this.$handleTouchEnd,{capture:true,passive:false});body.addEventListener("touchcancel",this.$handleTouchCancel,{capture:true,passive:false});}};PointerTracker.prototype.isTracking=function(){return this.$client&&this.$tracking;};PointerTracker.prototype.isPreventing=function(){return this.$client&&this.$tracking&&!this.$client.get_allowdefault();};PointerTracker.prototype.$handleMouseMove=new InitializeMethodCallback("Handle mouse movements on the body","handleMouseMove");PointerTracker.prototype.$handleMouseDown=new InitializeMethodCallback("Handle mouse down on the body","handleMouseDown");PointerTracker.prototype.$handleMouseUp=new InitializeMethodCallback("Handle mouse up on the body","handleMouseUp");PointerTracker.prototype.$handleKeyUp=new InitializeMethodCallback("Handle key up on the body","handleKeyUp");PointerTracker.prototype.$handleTouchStart=new InitializeMethodCallback("Handle key up on the body","handleTouchStart");PointerTracker.prototype.$handleTouchMove=new InitializeMethodCallback("Handle key up on the body","handleTouchMove");PointerTracker.prototype.$handleTouchEnd=new InitializeMethodCallback("Handle key up on the body","handleTouchEnd");PointerTracker.prototype.$handleTouchCancel=new InitializeMethodCallback("Handle key up on the body","handleTouchCancel");PointerTracker.prototype.handleMouseMove=function(e){if(!this.isTracking())return;var changedstates=this.$reportMouseMessage(e);var msg=this.createTrackMessage("move",changedstates);this.adviseClient(msg);if(this.isPreventing())e.preventDefault();};PointerTracker.prototype.handleMouseDown=function(e){if(!this.isTracking())return;var changedstates=this.$reportMouseMessage(e);this.stopTracking();if(this.isPreventing())e.preventDefault();};PointerTracker.prototype.handleMouseUp=function(e){if(!this.isTracking())return;var changedstates=this.$reportMouseMessage(e);this.completeTracking();if(this.isPreventing())e.preventDefault();};PointerTracker.prototype.$mainTouchId=null;PointerTracker.prototype.$getMainTouch=function(e){if(e.touches&&e.touches.length>0){var touch;if(this.$mainTouchId==null){touch=e.touches[0];this.$mainTouchId=touch.identifier;}else{for(var i=0;i<e.touches.length;i++){if(e.touches[i].identifier==this.$mainTouchId){touch=e.touches[i];break;}}}return touch;}};PointerTracker.prototype.handleTouchStart=function(e){if(!this.isTracking())return;if(e.touches&&e.touches.length>1){this.stopTracking();if(this.isPreventing())e.preventDefault();}var touch=this.$getMainTouch(e);if(touch==null){this.stopTracking();return;}var changedstates=this.$reportTouchMessage(e,touch);var msg=this.createTrackMessage("move",changedstates);this.adviseClient(msg);if(this.isPreventing())e.preventDefault();};PointerTracker.prototype.handleTouchMove=function(e){if(!this.isTracking())return;var touch=this.$getMainTouch(e);if(touch==null){this.stopTracking();return;}var changedstates=this.$reportTouchMessage(e,touch);var msg=this.createTouchTrackMessage("move",changedstates);this.adviseClient(msg);if(this.isPreventing())e.preventDefault();};PointerTracker.prototype.handleTouchEnd=function(e){if(!this.isTracking())return;if(e.changedTouches!=null&&e.changedTouches.length>0){var i,touch=null;for(i=0;i<e.changedTouches.length;i++){if(e.changedTouches[i].identifier==this.$mainTouchId){touch=e.changedTouches[i];break;}}if(touch!=null){var changedstates=this.$reportTouchMessage(e,touch);var changedstates=this.$reportMouseMessage(e);this.completeTracking();if(this.isPreventing())e.preventDefault();}else{if(e.touches!=null&&e.touches.length>0){for(i=0;i<e.touches.length;i++){if(e.touches[i].identifier==this.$mainTouchId){touch=e.touches[i];break;}}}if(touch==null){this.stopTracking();return;}}}};PointerTracker.prototype.handleTouchCancel=function(e){if(!this.isTracking())return;this.stopTracking();};PointerTracker.prototype.handleKeyUp=function(e){if(!this.isTracking())return;var changedstates=this.$applyKeyStateFromEvent(e);var ch=typeof e.which=="number"?e.which:e.keyCode;if(ch==27){this.stopTracking();e.preventDefault();}else{var msg=this.createTrackMessage("key",changedstates);msg.set_key(ch);this.adviseClient(msg);}};PointerTracker.prototype.$applyKeyStateFromEvent=function(e){return this.$applyKeyState(this.$getKeyState(e));}.Description("Sets a new last key state and returns an object with the states that have changed.");PointerTracker.prototype.$applyKeyState=function(state){var i;if(state==null||this.$lastKeyState==null){var o=BaseObject.DeepClone(PointerTracker.keyStates);for(i in o){o[i]=true;}this.$lastKeyState=state?state:{};return o;}var events={};for(i in PointerTracker.keyStates){if(this.$lastKeyState[i]!=state[i]){events[i]=true;}this.$lastKeyState[i]=state[i];}return events;}.Description("Sets a new last key state and returns an object with the states that have changed.");PointerTracker.prototype.$getKeyState=function(e){return{ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey,shiftKey:e.shiftKey};};PointerTracker.prototype.$reportMouseMessage=function(e){if(e.clientX!=null&&e.clientY!=null){var GPoint=Class("GPoint");this.$lastClientPoint=new GPoint(e.clientX,e.clientY);this.$lastPagePoint=new GPoint(e.pageX,e.pageY);}return this.$applyKeyStateFromEvent(e);};PointerTracker.prototype.$reportTouchMessage=function(touchEvent,touch){var GPoint=Class("GPoint");if(touch.clientX!=null&&touch.clientY!=null){this.$lastClientPoint=new GPoint(touch.clientX,touch.clientY);this.$lastPagePoint=new GPoint(touch.pageX,touch.pageY);}if(this.$mainTouchId==null){this.$mainTouchId=touch.identifier;}return this.$applyKeyStateFromEvent(touchEvent);};PointerTracker.prototype.startTracking=function(client,initialPoint_or_MouseEvent){var GPoint=Class("GPoint");this.stopTracking(this.thisCall(function(){var changedstates=null,isTouch=false;if(BaseObject.is(client,"IPointerTracker")){this.$clearTrackData();this.$client=client;this.$tracking=true;if(BaseObject.is(initialPoint_or_MouseEvent,"IGPoint")||BaseObject.is(initialPoint_or_MouseEvent,"Point")){this.$lastClientPoint=new GPoint(initialPoint_or_MouseEvent);}else if(this.$touchOn&&initialPoint_or_MouseEvent instanceof TouchEvent){if(initialPoint_or_MouseEvent.touches.length==1){var touch=initialPoint_or_MouseEvent.touches[0];if(touch instanceof Touch){changedstates=this.$reportTouchMessage(initialPoint_or_MouseEvent,touch);isTouch=true;}}else{return;}}else if(initialPoint_or_MouseEvent!=null&&initialPoint_or_MouseEvent.target){changedstates=this.$reportMouseMessage(initialPoint_or_MouseEvent);}var msg=this.createTrackMessage("start",changedstates,isTouch);this.adviseClient(msg);}else{this.$clearTrackData();this.LASTERROR(_Errors.compose(),"The client must implement IPointerTracker");}}));}.Description("Starts tracking/capturing the mouse. Can be supplied with initial mouse event from which it will strip initial coordinates, but will ignore the type of the event").Param("client","Object supporting IPointerTracker which will be advised for the mouse movements while the tracking operation continues."+"Only one tracking operation is allowed at any given moment. Starting a new one will stop (cancel) the current one.").Param("initialPoint_or_MouseEvent","If mouse event is supplied clientX/Y are stripped from it as lastPoint, if point is supplied it will be used only if there is a container and it will be interpretted in container coordinates.");PointerTracker.prototype.stopTracking=function(callback){if(BaseObject.is(callback,"IPointerTracker")&&callback!=this.$client)return;if(this.isTracking()){var msg=this.createTrackMessage("cancel");this.adviseClient(msg);this.$clearTrackData();}if(BaseObject.isCallback(callback))BaseObject.callCallback(callback);};PointerTracker.prototype.completeTracking=function(callback){if(BaseObject.is(callback,"IPointerTracker")&&callback!=this.$client)return;if(this.isTracking()){var msg=this.createTrackMessage("complete");this.adviseClient(msg);this.$clearTrackData();}if(BaseObject.isCallback(callback))BaseObject.callCallback(callback);};PointerTracker.prototype.endTracking=function(callback){if(BaseObject.is(callback,"IPointerTracker")&&callback!=this.$client)return;if(this.isTracking()){var msg=this.createTrackMessage("end");this.adviseClient(msg);this.$clearTrackData();}if(BaseObject.isCallback(callback))BaseObject.callCallback(callback);};PointerTracker.prototype.createTrackMessage=function(what,changedstates,isTouch){var m=new PointerTrackerEvent(this,what,changedstates,isTouch);m.set_clientpos(this.$lastClientPoint);m.set_pagepos(this.$lastPagePoint);return m;};PointerTracker.prototype.createTouchTrackMessage=function(what,changedstates){return this.createTrackMessage(what,changedstates,true);};PointerTracker.prototype.adviseClient=function(msg){if(this.isTracking()&&msg!=null){this.$client.handleMouseTrack(this,msg);}};PointerTracker.Default=function(){if(PointerTracker.$default==null){PointerTracker.$default=new PointerTracker();}return PointerTracker.$default;};