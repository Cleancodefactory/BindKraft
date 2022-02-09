(function() { 

    var ICloneObject = Interface("ICloneObject"),
        BaseObject = Class("BaseObject");

    function WindowLiveSettings() {
        BaseObject.apply(this, arguments);
    }
    WindowLiveSettings.Inherit(BaseObject, "WindowLiveSettings")
        .Implement(ICloneObject);

    //#region ICloneObject
    /**
     * Has to be overridden and must first call parent then use the returned clone to transfer any data then return the clone.
     * @returns {WindowLiveSettings} the new instance
     */
    WindowLiveSettings.prototype.cloneObject = function() { 
        var mytype = this.classDefinition();
        var clone = new mytype();
        // TODO: Something to copy on base level? Probably not.
        return clone;
    }
    //#endregion ICloneObject

    //#region Events
    WindowLiveSettings.prototype.settingschanged = new InitializeEvent("General event inheriting classes may decide to use when changes happen. Proto: settingschanged(this, null )");
    //#endregion

})();