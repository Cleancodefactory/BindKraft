


/* The usage of this Interface is unusual - the method is applied to the static class definition instead of an instance of the object */
/*INTERFACE*/
function ISupportsURLHash() { }
ISupportsURLHash.Interface("ISupportsURLHash");
ISupportsURLHash.prototype.hashKeyOfUrl = function () {
    return null;
}