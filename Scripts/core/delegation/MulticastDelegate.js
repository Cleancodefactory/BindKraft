

/*CLASS*/
function MulticastDelegate(obj, func) {
    Delegate.apply(this, arguments);
    this.object = obj;
    this.funcs = [];
    if (func != null) this.funcs.push(func);
};
MulticastDelegate.Inherit(Delegate, "MulticastDelegate");
MulticastDelegate.Implement(IInvoke);
MulticastDelegate.prototype.obliterate = function(bFull) {
    if (this.funcs != null) {
        BaseObject.obliterate(this.funcs);
        delete this.funcs;
    }
    Delegate.prototype.obliterate.call(this, bFull);
};

MulticastDelegate.prototype.add = function (func) {
    this.funcs.addElement(func);
    return this;
}.Description("Adds a function to the array with functions")
 .Param("func","Function to be added")
 .Returns("...")
 .Remarks("Could be chained");

MulticastDelegate.prototype.remove = function (func) {
    this.funcs.removeElement(func);
    return this;
}.Description("Removes a function from the array with functions")
 .Param("func","Function to be removed")
 .Returns("...")
 .Remarks("Could be chained");

MulticastDelegate.prototype.invoke = function () {
    if (this.funcs.length) {
        for (var i = 0; i < this.funcs.length; i++) {
            this.funcs[i].apply(this.object, arguments);
        }
    }
    return null;
}.Description("Invokes every function from the array of functions")
 .Returns("...");

MulticastDelegate.prototype.invokeOn = function (thisObj) {
    var args = arguments.slice(1);
    if (this.funcs.length) {
        for (var i = 0; i < this.funcs.length; i++) {
            this.funcs[i].apply(this.object, args);
        }
    }
    return null;
}.Description("...")
 .Param("thisObj","...")
 .Returns("null");

MulticastDelegate.prototype.equals = function (obj) {
    if (obj == this) return true;
    return false;
};