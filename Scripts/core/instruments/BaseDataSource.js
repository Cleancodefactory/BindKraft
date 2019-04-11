// UNDER CONSTRUCTION




// BEGIN BASE CLASSES FOR INSTRUMENTS
function DataSourceBase() {
    BaseObject.apply(this, arguments);
}
DataSourceBase.Inherit(BaseObject, "DataSourceBase");
DataSourceBase.Implement(IDataSourceImpl);


// END BASE CLASSES FOR INSTRUMENTS