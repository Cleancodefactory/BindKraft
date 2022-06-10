/*CLASS*/

function AppBaseEx() {
	AppBase.apply(this, arguments);
}
AppBaseEx.Inherit(AppBase,"AppBaseEx");
/**
 * Override!  You have to implement if you inherit from AppBaseEx instead of AppBase - this one is easier to implement by just returning an Operation.
 * The benefit is especially obvious when the class is further inherited and all the child methods just return operations
 *
 * 
 * @param {*} args	The parameters passed to the application
 * @returns {Operation} to signal when the initialization is complete
 */
AppBaseEx.prototype.initialize = function(/* *[] */ args) { throw "Not implemented";}
AppBaseEx.prototype.appinitialize = function(callback, args) {
	var op = this.initialize.apply(this, Array.createCopyOf(arguments, 1));
	var me = this;
	op.then(function(o) {
		if (o.isOperationSuccessful()) {
			BaseObject.callCallback(callback, true);
		} else {
			BaseObject.callCallback(callback, false);
		}
	});
}
/**
 *  Override only if needed.
 */
AppBaseEx.prototype.run = function(/* callset */ args) { /* no mandatory content */ }
 
 /**
 * Override! 
 * @returns {Operation} to signal when the shutdown is complete.
 */
AppBaseEx.prototype.shutdown = function() { throw "Not implemented";}

AppBaseEx.prototype.appshutdown = function(callback) {
	var op = this.shutdown.apply(this);
	var me = this;
	op.then(function(o) {
		if (o.isOperationSuccessful()) {
			BaseObject.callCallback(callback, true);
		} else {
			BaseObject.callCallback(callback, false);
		}
	});
}

AppBaseEx.prototype.windowDisplaced = function(w) {
	throw "windowDisplaced is not implemented by " + this.fullClassType();
}