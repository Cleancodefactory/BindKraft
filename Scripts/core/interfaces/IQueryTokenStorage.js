function IQueryTokenStorage() {}
IQueryTokenStorage.Interface("IQueryTokenStorage",  "IManagedInterface");

IQueryTokenStorage.prototype.getToken = function(/*string*/ key) {throw "not impl."} // returns string
IQueryTokenStorage.prototype.queryServiceUrl = function(/*string*/ service_name) {throw "not impl."} // returns string
