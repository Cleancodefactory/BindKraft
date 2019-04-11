function IAttachedWindowBehaviorsImpl() {}
IAttachedWindowBehaviorsImpl.InterfaceImpl(IAttachedWindowBehaviors);
IAttachedWindowBehaviorsImpl.RequiredTypes("BaseWindow");
IAttachedWindowBehaviorsImpl.classInitialize = function(cls) {
	cls.prototype.$attachedBehaviors = new InitializeArray("Registerd behaviors");
	cls.prototype.attachBehavior = function(/*IWindowBehavior*/ wb) { 
		var result = null;
		if (BaseObject.is(wb, "IWindowBehavior")) {
			this.$attachedBehaviors.push(wb);
			wb.init(this);
			result = wb;
		}
		return result;
	}
	cls.prototype.detachBehavior = function(/*IWindowBehavior*/ wb) { 
		var result = null;
		if (BaseObject.is(wb, "IWindowBehavior")) {
			this.$attachedBehaviors.Delete(function(idx, itm) {
				if (itm == wb) {
					wb.uninit(this);
					result = wb;
					return true;
				}
				return false;
			});
		}
		return result;
	}
	function $recurseBehaviors(arr, forward_or_backwards, callback, action) {
		var i, stopnow = false;
		function _ifdo(idx) {
			if (callback == null || BaseObject.callCallback(callback,beh)) {
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
		$recurseBehaviors(this.$attachedBehaviors, true, callback, function (arr, idx) {
			result = arr[idx];
			return true;
		});
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
	
}