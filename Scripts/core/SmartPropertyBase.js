(function() {
    function SmartPropertyBase(instance, args) {
        BaseObject.apply(this, arguments);
        if (this.classType() == "SmartPropertyBase") throw "SmartPropertyBase cannot be instantiated, only inheriting classes can";
    }
    SmartPropertyBase.Inherit(BaseObject, "SmartPropertyBase");

    SmartPropertyBase.prototype.get = function() {
        throw "not implemented";
    }
    SmartPropertyBase.prototype.set = function() {
        throw "not implemented";
    }
})();