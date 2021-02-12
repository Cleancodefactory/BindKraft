


/*CLASS*/

/**
 * Creates a function wrapped through an internally created delegate which calls the actual function as an instance member.
 * @param {string} [desc]  Description of the delegate.
 * @param {fuction} defval The function that will act as method but will be called through the delegate.
 * @param {Array} [boundArgs] Optional bound arguments passed after the explicitly supplied ones. (this argument is considered for deprecation.)
 * 
 * @description This kind of method can be called from anywhere without the need to supply "this"
 * MyClass.prototype.mymethodcallback = new InitializeMethodCallback("...", function(a,b) { ... some code ... });
 * // In another method
 *  var method = this.mymethodcallback
 *  var result = method(val_for_a,val_for_b);
 * 
 * The method will have proper this pointing to the current instance of the class. Without this initializer the above example code
 * will cause the method to be executed without a this and if it is needed it will fail.
 * 
 * Primary purpose of method callbacks is to pass them to API-s that take functions as event handlers or callbacks. The callback created 
 * like this remains the same for the entire life of the instance and can be easily used to subscribe and unsubscribe for events and any other
 * feature that takes function. For subscriptions limited to BindKraft only events see InitializeMethodDelegate. While callbacks will also work,
 * the InitializeMethodDelegate is a little bit lighter solution. It may be tempting to use the native Javascript's bind method of the Function 
 * object, but it is not convenient enough, because it will require you to call it in the constructor and store the result in a member variable which
 * is automatically done by this initializer in a more convenient way.
 */
function InitializeMethodCallback(desc, defval, boundArgs) {
    Initialize.apply(this, arguments);
    this.type = "MethodCallback";
	this.active = true;
	this.boundArgs = boundArgs;
};
InitializeMethodCallback.Inherit(Initialize, "InitializeMethodCallback");
InitializeMethodCallback.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    if (this.defaultValue != null) return ((this.boundArgs != null)?Delegate.createWrapper(obj, def, this.boundArgs):Delegate.createWrapper(obj, def));
    return null;
};
InitializeMethodCallback.prototype.defValueDescription = function () {
    return {
        value: "",
        type: ((this.defaultValue != null) ? "(method)" : "")
    };
};