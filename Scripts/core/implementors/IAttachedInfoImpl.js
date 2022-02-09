(function() {

    var IAttachedInfo = Interface("IAttachedInfo");

    function IAttachedInfoImpl() {}
    IAttachedInfoImpl.InterfaceImpl(IAttachedInfo, "IAttachedInfoImpl");
    IAttachedInfoImpl.classInitialize = function(cls) {
        function _info(inst, empty) {
            if (inst.$__BKAttachedInfoData == null || empty) {
                inst.$__BKAttachedInfoData = {};
            }
            return inst.$__BKAttachedInfoData;
        }
        function _attacher(attacher) {
            var key = null;
            if (BaseObject.is(attacher, "BaseObject")) {
                key = attacher.classType();
            } else {
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
        cls.prototype.setAttachedInfo = function(attacher, attach_info) { 
            var info = _info(this);
            var key = _attacher(attacher);
            if (key != null) {
                info[key] = attach_info;
                return true;
            }
            return false;
        };

        cls.prototype.mixAttachedInfo = function(attacher, attach_info) { 
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
    
        cls.prototype.getAttachedInfo = function(attacher) {
            var info = _info(this);
            var key = _attacher(attacher);
            if (key != null) {
                return info[key]?info[key]:null;
            }
            return null;
        };

    
        cls.prototype.clearAttachedInfo = function(attacher) {
            if (arguments.length > 0) {
                var key;
                for (var i = 0;i < arguments.length; i++) {
                    key = _attacher(arguments[i]);
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
                return info.$__instances[key]?info.$__instances[key]:null;
            }
            return null;
        }
        cls.prototype.clearInstanceInfo = function(instance) { 
            var info;
            if (arguments.length > 0) {
                var key;
                info = _info(this);
                if (info.$__instances == null) return;
                for (var i = 0;i < arguments.length; i++) {
                    key = _instance(arguments[i]);
                    if (key != null) {
                        if (info.$__instances[key] != null) delete info.$__instances[key];
                    }
                }
             } else {
                info =_info(this);
                if (info.$__instances != null) {
                    info.$__instances = null;
                };
            }
        }
        cls.prototype.clearAllAttachedInfos = function() { this.clearAttachedInfo();}
        cls.prototype.clearAllInstanceInfos = function() { this.clearInstanceInfo();}

    }

})();