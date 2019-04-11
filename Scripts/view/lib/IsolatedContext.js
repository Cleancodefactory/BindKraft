



/*CLASS*/

function IsolatedContext() {
    Base.apply(this, "IsolatedContext");
    this.$localdata = { };
};
IsolatedContext.Inherit(Base, "IsolatedContext");
IsolatedContext.prototype.OnRebind = function() {
    this.updateTargets();
};
IsolatedContext.prototype.set_data = function(v) {
    // do nothing about the passed data context, but invoke
};
IsolatedContext.prototype.get_data = function() {
    return this.$localdata;
};