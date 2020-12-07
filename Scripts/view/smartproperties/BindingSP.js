(function() {

    var SmartPropertyBase = Class("SmartPropertyBase")
        Base = Class("Base");

    function BindingSP(instance, args) {
        SmartPropertyBase.apply(this, arguments);
        if (!instance.is(Base)) throw "Binding smart properties can be used only with classes derived from Base";
        this.instance = instance;
        if (args == null || args.length < 1 || typeof arg[0] != "string") throw "Binding smart properties require 1 argument - the name of the binding";
        this.name = args[0];
    }
    BindingSP.Inherit(SmartPropertyBase, "BindingSP");
    BindingSP.prototype.$binding = function() {
        return this.instance.findBindingByName(this.name);
    }

})();