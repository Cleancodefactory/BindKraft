/*
	Usage:
		MyClass.prototype.mydelegate = new InitializeMethodDelegate("A delegato for handling some events","MyDlegateImplmentation");
		MyClass.prototype.MyDlegateImplmentation = function() { .... implementation ...... }
*/
/*CLASS*/
/**
 * Creates a delegate to a function called by the delegate as instance member.
 * @param {string} [desc]  Description of the delegate.
 * @param {fuction} defval The function that will act as method but will be called through the delegate.
 * 
 * @description If you want to call the method delegate from code, for example from another method it will have delegate syntax:
 * MyClass.prototype.mymethoddelegate = new InitializeMethodDelegate("...", function(a,b) { ... some code ... });
 * // In another method
 *  var result = this.mymethoddelegate.invoke(val_for_a,val_for_b);
 * 
 * Primary purpose of using method delegates is to pass them to EventDispatcher-s. The delegate created like this remains the same for
 * the entire life of the instance and can be easily used to subscribe and unsubscribe for events and any other feature that takes delegate.
 * For native cases, where function has to be passed see InitializeMethodCallback.
 */
function InitializeMethodDelegate(desc, defval) {
    Initialize.apply(this, arguments);
    this.type = "MethodDelegate";
	this.active = true;
};
InitializeMethodDelegate.Inherit(Initialize, "InitializeMethodDelegate");
InitializeMethodDelegate.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    if (def != null) return new Delegate(obj, def);
    return null;
};
InitializeMethodDelegate.prototype.defValueDescription = function () {
    return {
        value: "",
        type: ((this.defaultValue != null) ? "(method)" : "")
    };
};