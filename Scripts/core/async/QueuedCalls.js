if(typeof Promise!="undefined"&&Promise.toString().indexOf("[native code]")!=-1){(function(){function QueuedCalls(callback,timeout){BaseObject.apply(this,arguments);if(BaseObject.isCallback(callback)){this.$callback=callback;}if(typeof timeout=="number"&&timeout>0){this.$timeout=timeout;}}QueuedCalls.Inherit(BaseObject,"QueuedCalls");QueuedCalls.prototype.$callback=null;QueuedCalls.prototype.$queuedCalls=new InitializeArray("Queued calls.");QueuedCalls.prototype.$timeout=null;QueuedCalls.prototype.$timeoutId=null;QueuedCalls.prototype.$currentCall=null;QueuedCalls.prototype.$executeQueuedCall=function(req){var result=null;if(this.$timeout!=null){this.$timeoutId=setTimeout(()=>{this.$timeoutId=null;req.rejector("The call timed out.");},this.$timeout);}try{result=BaseObject.applyCallback(this.$callback,req.params);}catch(ex){if(this.$timeoutId!=null){clearTimeout(this.$timeoutId);this.$timeoutId=null;}this.$currentCall=null;req.promise.finally(this.$onTryQueue.getWrapper());req.rejector(ex);return;}if(result instanceof Promise){this.$currentCall=result;this.$currentCall.then(req.resolver).catch(req.rejector).finally(this.$onTryQueue.getWrapper());}else if(BaseObject.is(result,"Operation")){this.$currentCall=new Promise((resolve,reject)=>{result.onsuccess(r=>resolve(r)).onfailure(err=>reject(err));}).then(req.resolver).catch(req.rejector).finally(this.$onTryQueue.getWrapper());}else{req.promise.finally(this.$onTryQueue.getWrapper());req.resolver(result);return;}};QueuedCalls.prototype.$onTryQueue=new InitializeMethodDelegate("Delegate calling the $tryQueue",function(){if(this.$timeoutId!=null){clearTimeout(this.$timeoutId);this.$timeoutId=null;}this.$currentCall=null;this.$tryQueue();});QueuedCalls.prototype.$tryQueue=function(){if(this.$currentCall==null){if(this.$timeoutId!=null){clearTimeout(this.$timeoutId);this.$timeoutId=null;}var req=this.$queuedCalls.shift();if(req!=null){this.$executeQueuedCall(req);}else{}}else if(this.$currentCall instanceof Promise){}};QueuedCalls.prototype.invoke=function(){var args=Array.createCopyOf(arguments);var req={params:args};req.promise=new Promise(function(s,f){req.resolver=s;req.rejector=f;});this.$queuedCalls.push(req);this.$tryQueue();return req.promise;};})();}