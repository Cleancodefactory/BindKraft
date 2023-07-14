(function(){
    function IDisablableThroughImpl() {}
    IDisablableThroughImpl.InterfaceImpl(IDisablable,"IDisablableThroughImpl");
    IDisablableThroughImpl.RequiredTypes("Base");
    IDisablableThroughImpl.ForbiddenTypes("BaseWindow");
    IDisablableThroughImpl.classInitialize = function(cls,childprops){
        cls.prototype.$disabled = false;
        ICustomParameterizationStdImpl.addParameters(cls, "disabled");
        var names = Array.createCopyOf(arguments,1);
        function _calleach(_this,action) {
            var c;
            for (var i=0; i<names.length; i++) {
                if (typeof names[i] != 'string') continue;
                c = BaseObject.getProperty(_this,names[i]);
                if (BaseObject.is(c, "IDisablable")) {
                    action.call(_this, c);
                }
            }
        }
        cls.prototype.set_disabled = function(v) {
            this.$disabled = v;
            _calleach(this, function(ctl) {
                ctl.set_disabled(v);
            });
        }
        cls.prototype.get_disabled = function() {
            return this.disabled;
        }
    }
})();