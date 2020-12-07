(function() {

    var BindingSP = Class("BindingSP");

    function BindingTargetSP(instance, args) {
        BindingSP.apply(this,arguments);
    }
    BindingTargetSP.Inherit(BindingSP, "BindingTargetSP");
    BindingTargetSP.prototype.get = function() { 
        return this.$binding.get_targetValue();
    }
    BindingTargetSP.prototype.set = function(v) { 
        return this.$binding.set_targetValue(v);
    }

})();