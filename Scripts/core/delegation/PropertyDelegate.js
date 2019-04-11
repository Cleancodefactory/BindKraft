


/*CLASS*/
function PropertyDelegate(obj, path, calcCallBack) {
    BaseObject.apply(this, arguments);
    this.$obj = obj;
    this.$path = path;
    this.$calc = calcCallBack; // Callback to calculate the property if it is null
}
PropertyDelegate.Inherit(BaseObject, "PropertyDelegate");
PropertyDelegate.Implement(ITargeted);
PropertyDelegate.prototype.get_target = function() {
    return this.$obj;
};
PropertyDelegate.prototype.$available = false;
PropertyDelegate.prototype.$fetching = false;
PropertyDelegate.prototype.propertyavailable = new InitializeEvent("Fired when the value has been fetched with event(success, value)");
PropertyDelegate.prototype.obliterate = function(bFull) {
    if (bFull) {
        BaseObject.obliterate(this.$obj, this.$path);
    }
    if (this.$obj != null) delete this.$obj;
    if (this.$path != null) delete this.$path;
    if (this.$calc != null) {
        BaseObject.obliterate(this.$calc); // Nonfull
        delete this.$calc;
    }
};
PropertyDelegate.prototype.get = function () {
    if (this.$calc != null) {
		if (this.$available) {
			return BaseObject.getProperty(this.$obj, this.$path);
        } else {
			if (!this.$fetching) {
				var r = BaseObject.callCallback(this.$calc);
				if (BaseObject.is(r, "Operation")) {
					r.whencomplete();
				}
				this.set(r);
				return r;
			} else {
				var op = new Operation();
				op.CompleteOperation(false,"Already fetching, waiting the process to finish");
			}
		}
    } else {
        return BaseObject.getProperty(this.$obj, this.$path);
    }
};
PropertyDelegate.prototype.set = function (v) {
	var me = this;
	if (BaseObject.is(v, "Operation")) {
		this.$fetching = true;
		v.whencomplete().tell(function(v) {
			if (v.isOperationComplete() && v.isOperationSuccessful()) {
				BaseObject.setProperty(this.$obj, this.$path, v.getOperationResult());
				me.$available = true;
				me.propertyavailable.invoke(true, v.getOperationResult());
				me.$fetching = false;
			} else {
				// Failure - we have to do something here
				me.$available = true;
				me.propertyavailable.invoke(false, v.getOperationErrorInfo());
				me.$fetching = false;
			}
		});
	} else {
		BaseObject.setProperty(this.$obj, this.$path, v);
		this.$available = true;
		this.propertyavailable.invoke(true, v);
	}
};
PropertyDelegate.prototype.clear = function () {
    BaseObject.setProperty(this.$obj, this.$path, null);
	this.$available = false;
	this.$fetching = false;
};
PropertyDelegate.prototype.setCalcCallback = function (ccb) {
    this.$calc = ccb;
    this.clear();
};