function IDataHolderImpl() { }
IDataHolderImpl.InterfaceImpl(IDataHolder);
IDataHolderImpl.classInitialize = function (cls, privatePropertyName) {
    var _propname = ((privatePropertyName == null)?"$dataContext":privatePropertyName);
    cls.prototype.get_data = function() { 
        return this[_propname]; 
    };
    cls.prototype.set_data = function(v) {
        this[_propname] = v;
        this.OnDataContextChanged();
    };
};