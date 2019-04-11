function DescribedDataHolder(data, aspect/*, label*/) {
    var args = arguments;
    BaseObject.apply(this, arguments);	
    if (args.length > 0) {
        this.freezeEvents(this, function () {
            this.set_data(data);
            if (args.length > 1) this.set_aspect(aspect);
			//if (args.length > 2) this.$label= label;
        });
    }
};

DescribedDataHolder.Inherit(BaseObject, "DescribedDataHolder");
DescribedDataHolder.Implement(IDescribedDataHolder).Implement(IFreezable);

DescribedDataHolder.prototype.$data = null;
DescribedDataHolder.prototype.get_data = function () { return this.$data; }
DescribedDataHolder.prototype.set_data = function (v) { this.$data = v; }

DescribedDataHolder.prototype.equals = function (oth) {
    if (BaseObject.is(oth, "DescribedDataHolder")) {
        if (this.get_aspect().equals(oth.get_aspect())) return true;//equal by aspect;
    }	
    return false;
};