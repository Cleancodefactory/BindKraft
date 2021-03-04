function IAttachedWindowBehaviorsImpl() {}
IAttachedWindowBehaviorsImpl.InterfaceImpl(IAttachedWindowBehaviors, "IAttachedWindowBehaviorsImpl");
IAttachedWindowBehaviorsImpl.RequiredTypes("BaseWindow");
IAttachedWindowBehaviorsImpl.classInitialize = function(cls) {
	cls.prototype.$attachedBehaviors = new InitializeArray("Registerd behaviors");
	cls.prototype.$attachedNamedBehaviors = new InitializeObject("Registerd behaviors with name");
	cls.prototype.attachBehavior = function(/*IWindowBehavior*/ wb, /*optional, string*/ name) { 
		var result = null;
		if (BaseObject.is(wb, "IWindowBehavior")) {
			var ucb = wb.get_uniquecallback();
			if (BaseObject.isCallback(ucb) && this.attachedBehavior(ucb) != null) return null;
			this.$attachedBehaviors.push(wb);
			if (typeof name === "string" && name.length > 0) {
				if (BaseObject.is(this.$attachedNamedBehaviors[name], "BaseObject")) {
					throw "Attempt to attach a named behavior with a name that is already used. The existing behavior under the name " + name + " is of type " + this.$attachedNamedBehaviors[name].classType();
				}
				this.$attachedNamedBehaviors[name] = wb;
			}
			wb.init(this);
			result = wb;
		}
		return result;
	}
	cls.prototype.detachBehavior = function(/*IWindowBehavior*/ wb) { 
		var result = null;
		var me = this;
		if (BaseObject.is(wb, "IWindowBehavior")) {
			this.$attachedBehaviors.Delete(function(idx, itm) {
				if (itm == wb) {
					wb.uninit(this);
					for (var k in me.$attachedNamedBehaviors) {
						if (me.$attachedNamedBehaviors[k] == wb) {
							me.$attachedNamedBehaviors[k] = null;
						}
					}
					result = wb;
					return true;
				}
				return false;
			});
		}
		return result;
	}
	function $recurseBehaviors(_arr, forward_or_backwards, callback, action) {
		var i, stopnow = false;
		var arr = Array.createCopyOf(_arr);
		function _ifdo(idx) {
			if (callback == null || BaseObject.callCallback(callback,arr[i])) {
				stopnow = action(arr, idx);
			}
		}
		if (forward_or_backwards) {
			for (i = 0; i < arr.length; i++) {
				_ifdo(i);
				if (stopnow === true) break;
			}
		} else {
			for (i = arr.length - 1; i >= 0; i--) {
				_ifdo(i);
				if (stopnow === true) break;
			}
		}
	}
	cls.prototype.attachedBehaviors = function(callback) {
		var result = [];
		$recurseBehaviors(this.$attachedBehaviors, true, callback, function (arr, idx) {
			result.push(arr[idx]);
		});
		return result;
	}
	cls.prototype.attachedBehavior = function(callback) {
		var result = null;
		if (typeof callback == "string") {
			if (BaseObject.is(this.$attachedNamedBehaviors[callback],"IWindowBehavior")) {
				return this.$attachedNamedBehaviors[callback];
			}
		} else if (BaseObject.isCallback(callback)) {
			$recurseBehaviors(this.$attachedBehaviors, true, callback, function (arr, idx) {
				result = arr[idx];
				return true;
			});
		} else {
			return null; // Nothing to do.
		}
		
		return result;
	}
	cls.prototype.detachAllBehaviors = function(callback) { 
		var result = [];
		$recurseBehaviors(this.$attachedBehaviors, true, callback, function (arr, idx) {
			var b = this.detachBehavior(arr[idx]);
			if (b) result.push(b);
		});
		return result;
	}
	cls.prototype.adviseAttachedBehaviors = function(msg) { 
		if (this.isWindowMaterial()) {
			var methodname = "on_" + msg.type;
			this.$attachedBehaviors.Each(function (idx, beh) {
				if (!beh.isPaused() && typeof beh[methodname] == "function") {
					beh[methodname](msg);
				}
			});
		}
	}
	cls.prototype.adviseForStructuralQueryProcessing = function(query, processingInstruction) {
		if (this.isWindowMaterial()) {
			var r = this.$attachedBehaviors.FirstOrDefault(function (idx, beh) {
				if (beh.is("IStructuralQueryProcessor")) {
					if (beh.processStructuralQuery(query, processingInstruction)) {
						return true;
					}
					return null;
				}
			});
			return r?true:false;
		}
	}
	
}