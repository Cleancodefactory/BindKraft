(function() {

    var IAjaxRequestPackingExtension = Interface("IAjaxRequestPackingExtension"),
        IAjaxExtensions = Interface("IAjaxExtensions"),
        IAjaxCoreKraft = Interface("IAjaxCoreKraft");

    function BKInit_AjaxPackerConfig(packer) {
        BaseObject.apply(this, arguments);
        if (!BaseObject.is(packer, "IAjaxRequestPacker")) throw "packer is not an instance of IAjaxRequestPacker";
        this.packer = packer;
    }
    BKInit_AjaxPackerConfig.Inherit(BaseObject, "BKInit_AjaxPackerConfig");

    BKInit_AjaxPackerConfig.prototype.extendWith = function(packingExtension) { 
        if (BaseObject.is(packingExtension,IAjaxRequestPackingExtension)) {
            if (this.packer.is(IAjaxExtensions)) {
                // Add always get_data, fallback - everything
                this.packer.addExtension(packingExtension);
            } else {
                throw "This packer is not extendable. Packer's class: " + this.packer.classType();
            }
        }
        return this;
    }
    BKInit_AjaxPackerConfig.prototype.coreKraftFlags = function(addflags, setflags) {
        if (this.packer.is(IAjaxExtensions) && this.packer.is(IAjaxCoreKraft)) {
            // Add always get_data, fallback - everything
            var ext = new AjaxRequestPackingCoreKraftFlagsExtension(addflags || 0x0020,setflags || 0xFFFF);
            this.packer.addExtension(ext);
        } else {
            throw "This packer is not extendable or not a CoreKraft supporting one. Packer's class: " + this.packer.classType();
        }
        return this;
    }
})();