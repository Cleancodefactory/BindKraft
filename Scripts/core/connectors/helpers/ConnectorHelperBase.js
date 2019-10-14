


/*CLASS*/
function ConnectorHelperBase(connector, config) {
    BaseObject.apply(this,arguments);
    this.connector = connector;
    this.configuration = config;
};
ConnectorHelperBase.Inherit(BaseObject,"ConnectorHelperBase");