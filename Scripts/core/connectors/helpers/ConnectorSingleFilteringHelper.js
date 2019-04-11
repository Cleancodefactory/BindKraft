


/*CLASS*/
function ConnectorHelperSingleFiltering() {
    ConnectorHelperBase.apply(this,arguments);
}
ConnectorHelperSingleFiltering.Inherit(ConnectorHelperBase,"ConnectorHelperSingleFiltering");
ConnectorHelperPaging.Implement(IConnectorSingleFilteringHelper);
ConnectorHelperSingleFiltering.prototype.get_filterParameterName = function() {
    return this.configuration.filter;
}
ConnectorHelperSingleFiltering.prototype.get_filtervalue = function() {
    return this.connector.get_parameters(this.get_filterParameterName());
}
ConnectorHelperSingleFiltering.prototype.set_filtervalue = function(v) {
    this.connector.set_parameters(this.get_filterParameterName(),v);
}