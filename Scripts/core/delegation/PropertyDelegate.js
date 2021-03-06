

/**
 * A Class that provides a construct that can be used as a property with a value calculated/fetched
 * when not available or refreshed if too old.
 * 
 * @param obj	{BaseObject}	The object on which the property should be created
 * @param path	{string}		The name of the field in which the fetched value is held.
 * @param calcCallBack {callback} The callback that calculates/fetches the value. callback proto function(obj) where obj is the object from the obj parameter
 * @param autoRefresh {integer} Optional. If a positive number is supplied specifies when the value becomes dirty (in milliseconds).
 */
/*CLASS*/
function PropertyDelegate(obj, path, calcCallBack, autoRefresh) {
    BaseObject.apply(this, arguments);
    this.$obj = obj;
    this.$path = path;
	this.$calc = calcCallBack; // Callback to calculate the property if it is null
	
	this.set_autoRefresh(autoRefresh);
}
PropertyDelegate.Inherit(BaseObject, "PropertyDelegate");
PropertyDelegate.Implement(ITargeted);

// Static creators
PropertyDelegate.CreateAttached = function(obj, path, calcCallBack, autoRefresh) {
	return new PropertyDelegate(obj, path, calcCallBack, autoRefresh);
}
PropertyDelegate.Create = function(calcCallBack, autoRefresh) {
	return new PropertyDelegate(null, null, calcCallBack, autoRefresh);
}

// ITargeted - not always have a target
PropertyDelegate.prototype.get_target = function() {
    return this.$obj;
};
// End ITargeted implementation
PropertyDelegate.prototype.$available = false;
PropertyDelegate.prototype.$fetching = null;
PropertyDelegate.prototype.propertyavailable = new InitializeEvent("Fired when the value has been fetched with event(success, value)");
PropertyDelegate.prototype.obliterate = function(bFull) {
    if (bFull && this.$obj != null && this.$path != null) {
        BaseObject.obliterate(this.$obj, this.$path);
	}
	if (this.$value) delete this.$value;
    if (this.$obj != null) delete this.$obj;
    if (this.$path != null) delete this.$path;
    if (this.$calc != null) {
        // BaseObject.obliterate(this.$calc); // This should not be done - we do not know if the callback is used in multiple places or not.
        delete this.$calc;
    }
};
PropertyDelegate.prototype.$saveValue = function(v) {
	if (typeof this.$path == "string" && this.$obj != null) {
		BaseObject.setProperty(this.$obj, this.$path, v);
	} else {
		this.$value = v;
	}
}
PropertyDelegate.prototype.$readValue = function() {
	if (typeof this.$path == "string" && this.$obj != null) {
		return BaseObject.getProperty(this.$obj, this.$path);
	} else {
		return this.$value;
	}
}
PropertyDelegate.prototype.$autoRefresh = 0;
PropertyDelegate.prototype.set_autoRefresh = function(v) {
	if (v == null) {
		this.$autoRefresh = 0;
	} else if (typeof v == "number" && v > 0) {
		this.$autoRefresh = Math.floor(v);
	} else {
		this.LASTERROR("Inappropriate type assigned", "set_autoRefresh");
	}
}
PropertyDelegate.prototype.get_autoRefresh = function() {
	return this.$autoRefresh;
}
PropertyDelegate.prototype.get_isdirty = function() {
	if (this.$available) {
		if (this.$autoRefresh > 0 && typeof this.$lastset == "number") {
			if (Date.now() - this.$lastset > this.$autoRefresh) {
				return true;
			}
		}
		return false;
	} else {
		return true;
	}
}
PropertyDelegate.prototype.get = function () {
    if (this.$calc != null) {
		if (!this.get_isdirty()) {
			return this.$readValue();
        } else {
			if (this.$fetching == null) {
				var r = BaseObject.callCallback(this.$calc, this.$obj);
				if (BaseObject.is(r, "Operation")) {
					r.whencomplete();
				}
				this.set(r);
				return r;
			} else {
				if (BaseObject.is(this.$fetching, "Operation")) return this.$fetching;
				return Operation.Failed("Already fetching, waiting the process to finish");
			}
		}
    } else {
        return this.$readValue();
    }
};
/**
 * Always returns a value. When available returns the calculated value, otherwise null.
 * When async calculation is involved usage together with .get_isdirty() is usually needed.
 */
PropertyDelegate.prototype.getValue = function() {
	var v = this.get();
	if (v == null || BaseObject.is(v, "Operation")) return null;
	return v;
}
/**
 * Always returns Operation. If the value is available packs it in completed Operation for uniformity.
 */
PropertyDelegate.prototype.getOperation = function() {
	var v = this.get();
	if (BaseObject.is(v, "Operation")) return v;
	return Operation.From(v);
}
PropertyDelegate.prototype.set = function (v) {
	var me = this;
	if (BaseObject.is(v, "Operation")) {
		this.$fetching = v;
		v.whencomplete().tell(function(v) {
			if (v.isOperationComplete() && v.isOperationSuccessful()) {
				me.$saveValue(v.getOperationResult());
				me.$available = true;
				me.$lastset = Date.now();
				me.propertyavailable.invoke(true, v.getOperationResult());
				me.$fetching = null;
			} else {
				// Failure - we have to do something here
				me.$available = false;
				me.propertyavailable.invoke(false, v.getOperationErrorInfo());
				me.$fetching = null;
			}
		});
	} else {
		this.$saveValue(v);
		this.$fetching = null;
		this.$available = true;
		this.$lastset = Date.now();
		this.propertyavailable.invoke(true, v);
	}
};
PropertyDelegate.prototype.clear = function () {
    this.$saveValue(null);
	this.$available = false;
	this.$fetching = null;
	this.$lastset = null;
};
PropertyDelegate.prototype.setCalcCallback = function (ccb) {
    this.$calc = ccb;
    this.clear();
};