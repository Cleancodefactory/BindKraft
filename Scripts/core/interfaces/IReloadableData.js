


/* This Interface should be implemented by classes that cache pieces of data or otherwise support reloading of their state or part of it.
    The parameter of the function should identify the data piece or the entire state (if it is null and if this is applicable).
    To avoid confusions between pieces of data and the object itslef the return value of the method is defined as boolean and not 
    as a reference to the data itself (this may look more convenient, but dealing with both pieces of data or the object itself may lead to obscure mistakes).
*/
/*INTERFACE*/
function IReloadableData() { }
IReloadableData.Interface("IReloadableData");
IReloadableData.prototype.ensureLoaded = function (dataIdentification) { return true; };
