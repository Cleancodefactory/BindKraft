


/*CLASS*/

function DataPairContext() {
    Base.apply(this, arguments);
    this.$dataPair = new DataPair(); // Will blow up if not properly initialized
    this.root.dataContext = this.$dataPair;
}

DataPairContext.Inherit(Base, "DataPairContext");
DataPairContext.prototype.init = function() {
    this.root.dataContext = this.$dataPair; // just in case
};
DataPairContext.prototype.set_data = function(v) {
    if (BaseObject.is(v, "DataPair")) {
        this.$dataPair = v;
    } else {
        this.$dataPair.set_value(v);
    }
    Base.prototype.set_data.call(this, this.$dataPair);
};
DataPairContext.prototype.set_object = function(v) {
    this.$dataPair.data = v;
};
DataPairContext.prototype.get_object = function() {
    return this.$dataPair.data;
};
DataPairContext.prototype.set_property = function(v) {
    this.$dataPair.prop = v;
};
DataPairContext.prototype.get_property = function() {
    return this.$dataPair.prop;
};