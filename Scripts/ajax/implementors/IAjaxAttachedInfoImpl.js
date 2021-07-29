(function() {

    var IAjaxAttachedInfo = Interface("IAjaxAttachedInfo");

    function IAjaxAttachedInfoImpl() {}
    IAjaxAttachedInfoImpl.InterfaceImpl(IAjaxAttachedInfo);
    IAjaxAttachedInfoImpl.classInitialize = function(cls) {
        function _info(inst, clear) {
            if (inst.$__AjaxAttachedInfoData == null || clear) {
                inst.$__AjaxAttachedInfoData = {};
            }
            return inst.$__AjaxAttachedInfoData;
        }
        function _attacher(attacher) {
            if (typeof attacher == "string") {
                key = attacher;
            } else if (BaseObject.is(attacher, "BaseObject")) {
                key = attacher.classType();
            } else if (typeof attacher == "function") {
                key = Class.getTypeName(attacher);
                if (key == null) this.LASTERROR("The attacher seems to be a type, but it does not exist.");
            }
            return key;
        }

        cls.prototype.attachInfo = function(attacher, attach_info) { 
            var info = _info(this);
            var key = _attacher(attacher);
            if (key != null) {
                info[key] = attach_info;
                return true;
            }
            return false;
        };
    
        cls.prototype.getAttachedInfo = function(attacher) {
            var info = _info(this);
            var key = _attacher(attacher);
            if (key != null) {
                return info[key];
            }
            return null;
        };

    
        cls.prototype.clearAttachedInfo = function(attacher) {
            if (arguments.length > 0) {
                var key;
                for (var i = 0;i < arguments.length; i++) {
                    key = _attacher(attacher);
                    if (key != null) {
                        var info = _info(this)
                        if (info[key] != null) delete info[key];
                    }
                }
             } else {
                _info(this, true);
            }
        }
    }

})();