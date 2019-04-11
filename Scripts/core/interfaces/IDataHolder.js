


function IDataHolder() { }
IDataHolder.Interface("IDataHolder");
IDataHolder.prototype.get_data = function () { return null; }
IDataHolder.prototype.set_data = function (v) { }
IDataHolder.prototype.OnDataContextChanged = function () { } // Must be called on every set_data without checks if the data is the same or not (the check is difficult and controversial anyway).
