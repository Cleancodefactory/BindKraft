(function() {

    var IAjaxAttachedInfo = Interface("IAjaxAttachedInfo");

    function IAjaxAttachedInfoImpl() {}
    IAjaxAttachedInfoImpl.InterfaceImpl(IAjaxAttachedInfo, "IAjaxAttachedInfoImpl");
    IAjaxAttachedInfoImpl.classInitialize = function(cls) {
        function _info(inst, clear) {
            if (inst.$__AjaxAttachedInfoData == null || clear) {
                inst.$__AjaxAttachedInfoData = {};
            }
            return inst.$__AjaxAttachedInfoData;
        }
        function _attacher(attacher) {
            var key = null;
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
        function _instance(instance) {
            if (BaseObject.is(instance, "BaseObject")) {
                return instance.$__instanceId;
            }
            return null;
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

        cls.prototype.mixInfo = function(attacher, attach_info) { 
            var info = _info(this);
            var key = _attacher(attacher);
            if (key != null) {
                var existing = info[key];
                if (existing == null) {
                    info[key] = attach_info;
                } else {
                    if (attach_info != null && typeof attach_info == "object") {
                        info[key] = BaseObject.CombineObjects(existing, attach_info);
                    }
                }
                return true;
            }
            return false;
        };
        cls.prototype.mixAttachedInfo = cls.prototype.mixInfo; // Alias
    
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

        cls.prototype.attachInstanceInfo = function(instance, attach_info) { 
            var info = _info(this);
            var key = _instance(instance);
            if (key != null) {
                if (info.$__instances == null) info.$__instances = {};
                info.$__instances[key] = attach_info;
                return true;
            }
            return false;
        }
        cls.prototype.mixInstanceInfo = function(instance, attach_info) { 
            var info = _info(this);
            var key = _instance(instance);
            if (key != null) {
                if (info.$__instances == null) info.$__instances = {};
                var existing = info.$__instances[key];
                if (existing == null) {
                    info.$__instances[key] = attach_info;
                } else {
                    if (attach_info != null && typeof attach_info == "object") {
                        info.$__instances[key] = BaseObject.CombineObjects(existing, attach_info);
                    }
                }
                return true;
            }
            return false;
        }
        cls.prototype.getInstanceInfo = function(instance) { 
            var info = _info(this);
            var key = _instance(instance);
            if (key != null) {
                if (info.$__instances == null) return null;
                return info.$__instances[key];
            }
            return null;
        }
    }

})();