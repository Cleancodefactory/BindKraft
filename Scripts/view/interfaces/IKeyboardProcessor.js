(function() {


    /**
     * New 2022 keyboard handling interface. It overcedes the old ones IKeyboardHandler, IKeyboardLogicalSource, IKeyboardEventHandler.
     * The old interfaces will be gradually obsoleted and replaced with this one.
     * 
     */
    function IKeyboardProcessor() {}
    IKeyboardProcessor.Interface("IKeyboardProcessor");

    IKeyboardProcessor.prototype.keydataevent = new InitializeEvent("Fired to emit keyboard event data event(sender, data:KeyData)")

    IKeyboardProcessor.prototype.onKeyInput = function(e, dc, bind) { throw "not implemented"; }
    IKeyboardProcessor.prototype.processKeyInput = function(e) { throw "not implemented"; }
    IKeyboardProcessor.prototype.onKeyObject = function(sender, keyData, bind) { throw "not implemented"; }
    IKeyboardProcessor.prototype.processKeyObject = function(keyData) { throw "not implemented"; }

    // KeyboardEvent to KeyData converter
    IKeyboardProcessor.packKeyDataFromEvent = function(ke,customData) {
        if (ke == null) return null;
        if (ke.__isKeyData) return ke;
        if (ke.originalEvent != null) ke = ke.originalEvent;
        var r = { __isKeyData: true};
        
        // New keyboard standards - still repacking to not depend completely on them
        // Translation between the new and old is not implemented, because all usages of old events will be eliminated.
        if (typeof ke.code == "string") {
            r.code = ke.code;
        }
        if (typeof ke.key == "string") {
            r.key = ke.key;
        }
        r.which = 
        r.ctrlKey = ke.ctrlKey;
        r.shiftKey = ke.shiftKey;
        r.altKey = ke.altKey;
        r.metaKey = ke.metaKey;
        if (customData != null) {
            r.custom = customData;
        }
        return r;
   };
})();