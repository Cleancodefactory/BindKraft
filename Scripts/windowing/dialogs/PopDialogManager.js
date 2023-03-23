// DEPRECATED - will be removed in couple of years from now (03.2023)

function PopDialogManager() {
    BaseObject.apply(this, arguments);
	this.$popups = {};
}

PopDialogManager.Inherit(BaseObject, "PopDialogManager");

PopDialogManager.ImplementProperty("popupsPolicy", new InitializeMethodDelegate("Handles the popupsPolicy callback", "$defaultPolicy"));
//PopDialogManager.prototype.$popups = {};

PopDialogManager.prototype.registerPopUp = function(key, popup) {
    if (BaseObject.is(this.$popups[key], "PopDialog")) {
        throw "A popup with this key already exists " + key;
    }
    this.$popups[key] = popup;
    
    return this;
}
.Description("Registers a signle popup in the Popup Manager.")
.Param("key(String)", "Unique key for the popup. If the key is registered an exception is thrown.")
.Param("popup(PopDialog)", "The popup dialog instance.")
.Returns("this", "For chaining");

PopDialogManager.prototype.registerMultiplePopUps = function(popups, windowParent) {
    for (var key in popups) {
        if (this.$popups[key] !== undefined) {
            throw "A popup with this key already exists " + key;
        }
        if (BaseObject.is(popups[key], "PopDialog")) {
            if (popups[key].get_hostwindow() === null || windowParent !== undefined) {
                popups[key].set_application(windowParent);
            }

            this.$popups[key] = popups[key];
        }    
    }

    return this;
}
.Description("Registers multiple popups in the Popup Manager. Sets windowParent as popups parent in none is set for the popup.")
.Param("popups(Object)", "Object with the popups to register as key value pairs.")
.Param("windowParent(BaseWindow)", "Some window Instance")
.Returns("this", "For chaining");

PopDialogManager.prototype.openPopUp = function(key, data, placement) {
    var popup = this.$popups[key],
        isOpenPopUpAllowed;

    if (!BaseObject.is(popup, "PopDialog")) {
        throw "No such popup with key " + key;
    }

    isOpenPopUpAllowed =  this.$applyPolicy(key);
    if (isOpenPopUpAllowed === false) {
        var fakeOperation = new ChunkedOperation();
        fakeOperation.CompleteOperation(false, IOperation.errorname("singleinstance"));
        return fakeOperation;
    }

    return popup.openDialog(data, placement);
}
.Description("Opens a popup by key.")
.Param("key(String)", "The key for the popup.")
.Param("data(Object)", "Data for the given popup. The data will be passed to a InitWorkData function on the popups veiw.")
.Param("placement(Object)", "Configuration for the popups position. It's optional. If given it will override the default position coniguration.")
.Returns("ChunkedOperation");

PopDialogManager.prototype.closePopUp = function(key) {
    var popup = this.$popups[key];
    if (!BaseObject.is(popup, "PopDialog")) {
        throw "No such popup with key " + key;
    }

    popup.closeDialog();
}
.Description("Close if opened a popup by given key.")
.Param("key(String)", "The key for the popup for closing.")

PopDialogManager.prototype.isPopUpOpened = function(key) {
    var popup = this.$popups[key];
    if (!BaseObject.is(popup, "PopDialog")) {
        throw "No such popup with key " + key;
    }

    return popup.isOpened();
}
.Description("Check if popup is opened")
.Param("key(String)", "The key for the popup to check.")

PopDialogManager.prototype.getPopUp = function(key) {
    var popup = this.$popups[key];
    if (!BaseObject.is(popup, "PopDialog")) {
        throw "No such popup with key " + key;
    }

    return popup.get_dialogwindow();
}
.Description("Returns the window for a popup by given popup key.")
.Param("key(String)", "The key for the searched popup.")
.Returns("BaseWindow");

PopDialogManager.prototype.$defaultPolicy = function() {
    for (var key in this.$popups) {
        this.$popups[key].closeDialog();
    }

    return true;
}
.Description("Default opening popup policy. It can be overriden by setting another policy through set_popupsPolicy().")
.Returns("true/false", "Informs the Popup Manager to open a new popup or not. If false the opening of a new Popup will be stoped.");

PopDialogManager.prototype.$applyPolicy = function(openingPopUpKey) {
    if (!BaseObject.isCallback(this.get_popupsPolicy())) {
        throw "Invalid Popup Policy callback";
    }
    
    return BaseObject.callCallback(this.get_popupsPolicy(), this, openingPopUpKey);
}