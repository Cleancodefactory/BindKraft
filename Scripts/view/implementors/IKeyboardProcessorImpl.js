(function() {

    var IKeyboardProcessor = Interface("IKeyboardProcessor");

    /**
     * Implements most of the keyboard processing infrastructure, requiring only to override processKeyData.
     * processKeyData(keyData) must return true if it uses the keyData for something or just wants to prevent 
     * it from reaching downstream consumers. Otherwise undefined or null should be returned (equivalent to 
     * not returning anything).
     */
    function IKeyboardProcessorImpl() {}
    IKeyboardProcessorImpl.InterfaceImpl(IKeyboardProcessor,"IKeyboardProcessorImpl");

    IKeyboardProcessorImpl.classInitialize = function(cls) {

        cls.prototype.onKeyInput = function(e, dc, bind) {
            if (this.processKeyInput(e) == true) {
                if (bind != null) {
                    // TODO: Prevent default when configured
                }
            };
        }
        cls.prototype.processKeyInput = function(e) { 
            var keyData = IKeyboardProcessor.packKeyDataFromEvent(e);
            if (keyData != null) {
                return this.onKeyObject(this, keyData, null);
            } else {
                this.LASTERROR("Received wrong KeyboardEvent");
            }
        }
        cls.prototype.onKeyObject = function(sender, keyData, bind) {
            if (!this.processKeyObject(keyData)) {
                return this.keydataevent.invoke(this, keyData); // fire to descendant consumers and Prevent further handlers if consumed.
            } else {
                return true; // Prevent further handlers
            }
        }
        cls.prototype.processKeyObject = function(keyData) { 
            throw "processKeyData not implemented in " + cls.classType + ". Implement by using the data and returning true or false if the data is not used."; 
        }

    }

})();