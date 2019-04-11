
// +Version: 1.5

/*INTERFACE*/
function IConnectorPagingHelper() {}
IConnectorPagingHelper.Interface("IConnectorPagingHelper");
IConnectorPagingHelper.prototype.get_limitParameterName = function() {}
IConnectorPagingHelper.prototype.get_offsetParameterName = function() {}
IConnectorPagingHelper.prototype.set_limit = function(v) { throw "not implemented"; }
IConnectorPagingHelper.prototype.get_limit = function() { throw "not implemented"; }
IConnectorPagingHelper.prototype.set_offset = function(v) { throw "not implemented"; }
IConnectorPagingHelper.prototype.get_offset = function() { throw "not implemented"; }
