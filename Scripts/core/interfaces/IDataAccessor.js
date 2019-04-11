


/*
    This Interface enables certain classes to provide proxied access to data they manage. The structure of the dataIdentification is entirely up to the 
    implementation and no assumptions should be made about it! It is recommended to use dotted notation el1.el2.el3 in a string as data identification, but this
    is not mandatory.
    The implementers usually need to perform additional operations on data access such as firing events, checking cache and so on.
*/
/*INTERFACE*/
function IDataAccessor() { }
IDataAccessor.Interface("IDataAccessor");
IDataAccessor.prototype.get = function (dataIdentification, defValue) { return defValue; };
IDataAccessor.prototype.set = function (dataIdentification, val) { return val; };