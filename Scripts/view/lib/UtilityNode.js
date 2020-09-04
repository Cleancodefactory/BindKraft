(function() {

    // Imports
    var Base = Class("Base"), 
        InitializeStringParameter = Class("InitializeStringParameter"),
        InitializeNumericParameter = Class("InitializeNumericParameter"),
        InitializeEvent = Class("InitializeEvent");
    
/**
 * This class provides variety of simple helpful features. It does not have any direct impact on the UI and
 * can be attached to an element that will never need a data-class or put on a hidden element.
 */
function UtilityNode() {
    Base.apply(this,arguments);
}
UtilityNode.Inherit(Base, "UtilityNode");

//#region Enable UI - show hide elements by binding their visibility/display to a property with arbitrary name

UtilityNode.prototype.$enableui = new InitializeObject("An object with properties managed through the enable UI methods.")
UtilityNode.prototype.get_enableui = function() {
    return this.$enableui;
}
UtilityNode.prototype.enabledui_changed = new InitializeEvent("Event fired when any of the enabled UI properties change");
/**
 * Designed to be called from binding or directly
 * When called
 * 
 * **directly**
 * enableUI(uiname)
 * @param uiname {string} The name of the property to set to true on the $enableui object.
 * 
 * **on binding**
 * enableUI(sender_event, dc, binding)
 * Usage:
 * ... data-on-click="{bind source=... path=enableUI parameter='myui'}"
 * and on the other side
 * data-bind-display[block]="{read source=... path=$enableui.myui readdata=$enableui_changed}"
 * 
 */
UtilityNode.prototype.enableUI = function(e_sender, dc, bind) {
    var prop = null;
    if (typeof e_sender == "string") {
        prop = e_sender;
    } else if (BaseObject.is(bind, "Binding")) {
        prop = bind.bindingParameter;
    }
    if (typeof prop == "string" && prop.length > 0) {
        if (!this.$enableui[prop]) {
            this.$enableui[prop] = true;
            this.enabledui_changed.invoke(this, prop);
        }
    } else {
        this.LASTERROR(_Errors.compose(),"Cannot determine the name of the property to enable.")
    }
}
UtilityNode.prototype.disableUI = function(e_sender, dc, bind) {
    var prop = null;
    if (typeof e_sender == "string") {
        prop = e_sender;
    } else if (BaseObject.is(bind, "Binding")) {
        prop = bind.bindingParameter;
    }
    if (typeof prop == "string" && prop.length > 0) {
        if (this.$enableui[prop]) {
            this.$enableui[prop] = false;
            this.enabledui_changed.invoke(this, prop);
        }
    } else {
        this.LASTERROR(_Errors.compose(),"Cannot determine the name of the property to enable.")
    }
}
UtilityNode.prototype.toggleUI = function(e_sender, dc, bind) {
    var prop = null;
    if (typeof e_sender == "string") {
        prop = e_sender;
    } else if (BaseObject.is(bind, "Binding")) {
        prop = bind.bindingParameter;
    }
    if (typeof prop == "string" && prop.length > 0) {
        if (this.$enableui[prop]) {
            this.$enableui[prop] = false;
        } else {
            this.$enableui[prop] = true;
        }
        this.enabledui_changed.invoke(this, prop);
    } else {
        this.LASTERROR(_Errors.compose(),"Cannot determine the name of the property to enable.")
    }
}
UtilityNode.prototype.toggleAll = function(e_sender, dc, bind) {
    var state = null;
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k)) {
            if (state === null) state = this.$enableui[k];
            if (state) {
                this.$enableui[k] = false;
            } else {
                this.$enableui[k] = true;
            }
        }
    }
    this.enabledui_changed.invoke(this, null);
}



})();