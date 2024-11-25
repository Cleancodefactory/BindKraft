function Messenger(isDefault){this.$registered={};this.$windows=new Array();this.isDefault=isDefault;this.name=null;this.queue=[];}Messenger.Inherit(BaseObject,"Messenger");Messenger.OnLoad=function(){Messenger.Default.OnLoad();};Messenger.OnUnload=function(){Messenger.Default.OnUnLoad();};Messenger.prototype.OnLoad=function(){this.window=window;this.opener=window.opener;this.$registerForGlobalEvents();this.$loadMessengers();this.registerWindow(this);System.Default().windowunloadevent.add(new Delegate(this,this.OnUnload));};Messenger.prototype.OnUnLoad=function(){this.unregisterWindow(this);};Messenger.prototype.$registerForGlobalEvents=function(){document.body.addEventListener("click",Delegate.createWrapper(this,this.$onBodyClick),true);document.body.addEventListener("keyup",Delegate.createWrapper(this,this.$onBodyKeyPress),true);};Messenger.prototype.$onBodyKeyPress=function(e){if(e.which==27)this.post(new PageEvent("closepopup"));$(window).trigger("closepopup");};Messenger.prototype.$onBodyClick=function(e){this.post(new PageEvent("closepopup"));$(window).trigger("closepopup");};Messenger.prototype.equals=function(obj){if(obj==null)return false;if(obj!==this)return false;return true;};Messenger.prototype.$registered=null;Messenger.prototype.$windows=null;Messenger.prototype.$loadMessengers=function(){try{if(this.opener!=null&&this.opener.Messenger!=null&&this.opener.Messenger.Default!=null){var ms=this.opener.Messenger.Default.$windows;for(var i=0;i<ms.length;i++){try{this.$windows.push(ms[i]);}catch(e){}}}}catch(e){}};Messenger.prototype.$registerWindow=function(newWin){if(newWin==null)return;this.$windows.addElement(newWin);};Messenger.prototype.registerWindow=function(newWin){if(newWin==null)return;try{if(this.$windows.findElement(newWin)>=0)return;}catch(e){}for(var i=0;i<this.$windows.length;i++){try{this.$windows[i].$registerWindow(newWin);}catch(e){}}try{this.$registerWindow(newWin);}catch(e){}};Messenger.prototype.$unregisterWindow=function(win){if(win==null)return;this.$windows.removeElement(win);};Messenger.prototype.unregisterWindow=function(win){if(win==null)return;try{if(this.$windows.findElement(win)<0)return;}catch(e){}for(var i=0;i<this.$windows.length;i++){try{this.$windows[i].$unregisterWindow(win);}catch(e){}}try{this.$unregisterWindow(win);}catch(e){}};Messenger.prototype.subscribe=function(eventType,handler,callOnce){var eventTypeName=BaseObject.is(eventType,"string")?eventType:eventType.classType;if(this.$registered[eventTypeName]==null){this.$registered[eventTypeName]=[];}if(this.$findHandler(eventTypeName,handler)<0){if(callOnce){if(handler.CMessenger_callOnce==null)handler.CMessenger_callOnce={};handler.CMessenger_callOnce[eventTypeName]=true;}this.$registered[eventTypeName].push(handler);}};Messenger.prototype.$findHandler=function(eventType,handler){var eventTypeName=BaseObject.is(eventType,"string")?eventType:eventType.classType;var i,arr;arr=this.$registered[eventTypeName];if(arr==null)return-1;for(i=0;i<arr.length;i++){if(BaseObject.equals(arr[i],handler))return i;}return-1;};Messenger.prototype.isSubscribed=function(eventType,handler){var eventTypeName=BaseObject.is(eventType,"string")?eventType:eventType.classType;var i=this.$findHandler(eventType,handler);return i<0?false:true;};Messenger.prototype.unsubscribe=function(eventType,handler){var eventTypeName=BaseObject.is(eventType,"string")?eventType:eventType.classType;var i=this.$findHandler(eventType,handler);if(i>=0){var arr=this.$registered[eventTypeName];if(i>=0&&arr!=null&&i<arr.length){arr.splice(i,1);}}};Messenger.prototype.unsubscribeAll=function(obj){for(var k in this.$registered){var subscribers=this.$registered[k];if(subscribers!=null){for(var i=subscribers.length-1;i>=0;i--){var subscriber=subscribers[i];if(BaseObject.is(subscriber,"Delegate")){if(subscriber.object===obj){subscribers.splice(i,1);}}else if(BaseObject.is(subscriber,"IMessageSink")){if(subscriber===obj){subscribers.splice(i,1);}}else{}}}}};Messenger.prototype.$publish=function(obj,broadcastToOthers){var eventTypeName=obj.classType();var arr=this.$registered[eventTypeName];var i;if(arr!=null){var o;if(obj.is("ITargetedMessage")){for(i=0;i<arr.length;i++){o=arr[i];if(obj.confirmTarget(o)){if(o!=null){if(BaseObject.is(o,"Delegate")){o.invoke(obj);}else if(BaseObject.is(o,"function")){o(obj);}else if(BaseObject.is(o,"IMessageSink")){o.HandleMessage(obj);}else{}if(o.CMessenger_callOnce!=null&&o.CMessenger_callOnce[eventTypeName]){o.CMessenger_callOnce[eventTypeName]=null;this.unsubscribe(eventTypeName,o);}}}}}else{for(i=0;i<arr.length;i++){o=arr[i];if(o!=null){if(BaseObject.is(o,"Delegate")){o.invoke(obj);}else if(BaseObject.is(o,"function")){o(obj);}else if(BaseObject.is(o,"IMessageSink")){o.HandleMessage(obj);}else{}if(o.CMessenger_callOnce!=null&&o.CMessenger_callOnce[eventTypeName]){o.CMessenger_callOnce[eventTypeName]=null;this.unsubscribe(eventTypeName,o);}}}}}if(broadcastToOthers){if(this.$windows.length>0){for(i=0;i<this.$windows.length;i++){try{if(!this.$windows[i].equals(this)){this.$windows[i].$publish(obj,false);}}catch(e){}}}}};Messenger.prototype.publish=function(obj,bBroadcast){return this.$publish(obj,bBroadcast);};Messenger.prototype.tick=function(){var timeout=Ticker.Default.timeout;var q=[];var el;for(var i=0;i<this.queue.length;i++){el=this.queue[i];if(el!=null){if(el.is("IDelayedMessage")){if(el.isTimeToSend(timeout)){this.$publish(el);}else{q.push(el);}}else{this.$publish(el);}}}this.queue=q;if(this.queue.length<=0)Ticker.Default.remove(this);};Messenger.prototype.$post=function(obj,broadcastToOthers){if(obj==null)return;this.queue.push(obj);Ticker.Default.add(this);Ticker.Default.start();if(broadcastToOthers){if(this.$windows.length>0){for(var i=0;i<this.$windows.length;i++){try{if(!this.$windows[i].equals(this)){this.$windows[i].$post(obj,false);}}catch(e){}}}}};Messenger.prototype.post=function(obj,bBroadcast){this.$post(obj,bBroadcast);};Messenger.Default=new Messenger(true);Messenger.Instance=function(){if(Messenger.Default==null){Messenger.Default=new Messenger(true);}return Messenger.Default;};document.addEventListener("load",Messenger.Default.OnLoad);