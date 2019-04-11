
// BASE CLASSES FOR THE James.Bound FRAMEWORK
function DataHolder() {
    BaseObject.apply(this, arguments);
};
DataHolder.Inherit(BaseObject, "DataHolder");
DataHolder.Implement(IDataHolder);
DataHolder.prototype.$dataContext = null;
DataHolder.prototype.get_data = function () {
    return this.$dataContext;
};
DataHolder.prototype.set_data = function (newData) {
    this.$dataContext = newData;
    this.OnDataContextChanged();
};
DataHolder.prototype.OnDataContextChanged = function () {
    // Override in child classes to Implement data context change behaviour.
};
// This is obsolete! I am leaving the method commented out because the class is parent for innumerable other classes and the people may need to know.
//DataHolder.prototype.save = function () {
    //return this.$dataContext;
//};
DataHolder.prototype.equals = function (obj) {
    // It is important that all the classes inheriting this one are compared by reference.
    if (obj === this) return true;
    return false;
};