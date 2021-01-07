(function() {

    var BindingSP = Class("BindingSP");

    function BindingSourceSP(instance, args) {
        BindingSP.apply(this,arguments);
    }
    BindingSourceSP.Inherit(BindingSP, "BindingSourceSP");
    BindingSourceSP.prototype.get = function() { 
        return this.$binding().get_targetValue();
    }
    BindingSourceSP.prototype.set = function(v) { 
        return this.$binding().set_targetValue(v);
    }

})();