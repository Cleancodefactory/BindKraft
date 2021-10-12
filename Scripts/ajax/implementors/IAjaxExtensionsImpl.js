(function() {

    var IAjaxExtensions = Interface("IAjaxExtensions");

    function IAjaxExtensionsImpl() {}
    IAjaxExtensionsImpl.InterfaceImpl(IAjaxExtensions, "IAjaxExtensionsImpl");
    IAjaxExtensionsImpl.classInitialize = function(cls, args /* allowed types */) {
        var allowed = Array.createCopyOf(arguments,1);
        function _checkType(v) { 
            if (allowed.length == 0) return true;
            if (allowed.Any(function(idx,type) { 
                if (BaseObject.is(v, type)) return true;
                return null;
            })) {
                return true;
            }
            return false;
        }
        if (cls.prototype.$__ajaxExtensions == null) cls.prototype.$__ajaxExtensions = new InitializeArray("Internal register of the extensions");

        cls.prototype.addExtension = function(extension) { 
            if (_checkType(extension)) {
                this.$__ajaxExtensions.push(extension);
            }
        }
    
        cls.prototype.removeExtension = function(extension) { 
            var idx = this.$__ajaxExtensions.indexOf(extension);
            if (idx >= 0) {
                this.$__ajaxExtensions.splice(idx,1);
            }
        }
    
        cls.prototype.clearExtensions = function() { 
            this.$__ajaxExtensions.splice(0);
        }


        cls.prototype.iterateExtensions = function(callback) { 
            var result = null;
            if (BaseObject.isCallback(callback)) {
                this.$__ajaxExtensions.Each(function(idx,extension) { 
                    if (result != null) return; // If one has failed - no more are executed.
                    var r = BaseObject.callCallback(callback, extension);
                    if (typeof r == "string") {
                        result = r;
                    }
                });
            }
            return result;
        }

    }

})();