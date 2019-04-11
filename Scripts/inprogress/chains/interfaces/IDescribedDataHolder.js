function IDescribedDataHolder() { }
IDescribedDataHolder.Interface("IDescribedDataHolder", IDataHolder, IDescribedData);

/*IDescribedDataHolder.DeclarationBlock({
	//metadata
    label: "r any * A label which is specific for the data holder instance."
});*/

/* from ....../core/interfaces/
function IDataHolder() { }
IDataHolder.Interface("IDataHolder");
IDataHolder.prototype.get_data = function () { return null; }
IDataHolder.prototype.set_data = function (v) { }
IDataHolder.prototype.OnDataContextChanged = function () { } // Must be called on every set_data without checks if the data is the same or not (the check is difficult and controversial anyway).
*/

/*
IDescribedData.DeclarationBlock({
    datadescriptionmodel: "rw string * name of the description model (method, vocabulary) used. ",
    contenttype: { type: "rw string * the content type or (internal/memory or null) if it is just data in memory", init: null },
    aspect: "rw any * An aspect describing what the data is."
});
*/