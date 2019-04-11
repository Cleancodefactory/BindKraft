



/*INTERFACE*/
// Tunnel for data state manipulation over underlying data whenever the data is accessed through a proxy object (such as DataPair)
function IDataStateManager() { }
IDataStateManager.Interface("IDataStateManager");
IDataStateManager.prototype.get_DataItemState = function () { return null; };
IDataStateManager.prototype.set_DataItemState = function (v) { };

