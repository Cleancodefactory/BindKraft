


/*CLASS*/
function ConnectorHelperPaging() {
    ConnectorHelperBase.apply(this,arguments);
}
ConnectorHelperPaging.Inherit(ConnectorHelperBase,"ConnectorHelperPaging");
ConnectorHelperPaging.Implement(IConnectorPagingHelper);
ConnectorHelperPaging.prototype.get_limitParameterName = function() {
    return this.configuration.limit;
}
ConnectorHelperPaging.prototype.get_offsetParameterName = function() {
    return this.configuration.offset;
}
ConnectorHelperPaging.prototype.set_limit = function(v) {
    this.connector.set_parameters(this.get_limitParameterName(),v); 
}
ConnectorHelperPaging.prototype.get_limit = function() { 
    return this.connector.get_parameters(this.get_limitParameterName());
}
ConnectorHelperPaging.prototype.set_offset = function(v) { 
    this.connector.set_parameters(this.get_offsetParameterName(), v);
}
ConnectorHelperPaging.prototype.get_offset = function() { 
    return this.connector.get_parameters(this.get_offsetParameterName());
}