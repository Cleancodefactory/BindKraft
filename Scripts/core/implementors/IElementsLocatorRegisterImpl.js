(function(){
    var IElementsLocatorRegister = Interface("IElementsLocatorRegister");

    function IElementsLocatorRegisterImpl() {}
    IElementsLocatorRegisterImpl.InterfaceImpl(IElementsLocatorRegister, "IElementsLocatorRegisterImpl");
    IElementsLocatorRegisterImpl.classInitialize = function(cls) {
        if (cls.prototype.$__locatableElements == null) {
            cls.prototype.$__locatableElements = new InitializeArray("Contains the registered locatable elements.");
        }
        cls.prototype.locateElements = function(iface, condition) {
            var result = [];
            if (BaseObject.is(this.$__locatableElements, "Array")) {
                for (var i = this.$__locatableElements.length - 1; i >= 0; i--) {
                    var element = this.$__locatableElements[i];
                    if (element == null || element.__obliterated) {
                        this.$__locatableElements.splice(i,1);
                        continue;
                    }
                    if (BaseObject.is(element, iface)) {
                        if (BaseObject.isCallback(condition)) {
                            if (!BaseObject.callCallback(condition, element)) {
                                continue;
                            }
                        } 
                        result.push(element);
                    }
                }
                return result;
            }
            return [];
        }
        cls.prototype.registerLocatableElement = function(element) { 
            if (this.$__locatableElements) {
                if (this.$__locatableElements.indexOf(element) < 0) {
                    this.$__locatableElements.push(element);
                }
            } else {
                throw "Cannot register locatable element, the internal array was not found";
            }
        }
        cls.prototype.unregisterLocatableElement = function(element) { 
            if (this.$__locatableElements) {
                var n = this.$__locatableElements.indexOf(element);
                if (n >= 0) {
                    this.$__locatableElements.splice(n,1);
                }
            } else {
                throw "Cannot unregister locatable element, the internal array was not found";
            }
        }
    }
})();