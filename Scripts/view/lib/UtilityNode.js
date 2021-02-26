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
UtilityNode.Inherit(Base, "UtilityNode")
.Implement(ICustomParameterizationStdImpl, "enabled", "disabled", "zorder", "zorderMin", "radiopartners");
UtilityNode.ImplementProperty("enabled", new InitializeStringParameter("Initially enabled", ""));
UtilityNode.ImplementProperty("disabled", new InitializeStringParameter("Initially disabled", ""));
UtilityNode.ImplementProperty("zorder", new InitializeStringParameter("Perform zordering on these", null));
UtilityNode.ImplementProperty("zorderMin", new InitializeNumericParameter("Minimal z-order", 100));
UtilityNode.ImplementProperty("radiomode", new InitializeBooleanParameter("In that mode when item is enabled the others are disabled.", false), 
        null, function(oval, nval) {
            if (nval) {
                this.ExecBeforeFinalInit([], function() {
                    this.applyRadioMode();
                    this.enabledui_changed.invoke(this, null);
                });
            }
});
UtilityNode.ImplementProperty("radiopartners", new InitializeStringParameter("Radio mode partners - comma separated list of parent/child data-key addresses.", null))
UtilityNode.prototype.applyRadioMode = function(enabled) {
    var uiname;
    if (this.get_radiomode()) {
        for (uiname in this.$enableui) {
            if (this.$enableui.hasOwnProperty(uiname)) {
                if (this.$enableui[uiname]) {
                    this.$enableui[uiname] = false;
                }
            }
        }
        if (typeof enabled == "string" && this.$enableui.hasOwnProperty(enabled)) {
            this.$enableui[enabled] = true;
            this.$updateRadioPartners();
        } else {
            this.enabledui_changed.invoke(this, null);
        }
    }
}
UtilityNode.prototype.$updateRadioPartners = function() {
    var partners = this.get_radiopartners();
    if (typeof partners == "string") {
        var arr = this.getRelatedObjects(partners,["UtilityNode"]);
        if (arr && arr.length) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].applyRadioMode();
            }
        }
    }
}

UtilityNode.prototype.finalinit = function() {
    var i,arr, v = this.get_enabled();
    if (typeof v == "string") {
        arr = v.split(",");
        if (arr != null && arr.length > 0) {
            for (i = 0; i < arr.length; this.$enableui[arr[i++]] = true);
        }
    }
    v = this.get_disabled();
    if (typeof v == "string") {
        arr = v.split(",");
        if (arr != null && arr.length > 0) {
            for (i = 0; i < arr.length; this.$enableui[arr[i++]] = false);
        }
    }
}

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
            this.applyRadioMode(prop);
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
            this.applyRadioMode(prop);
        }
        this.enabledui_changed.invoke(this, prop);
    } else {
        this.LASTERROR(_Errors.compose(),"Cannot determine the name of the property to enable.")
    }
}
UtilityNode.prototype.toggleAll = function(e_sender, dc, bind) {
    var state = null;
    var x = null;
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k) && k != "") {
            if (state === null) state = this.$enableui[k];
            if (state) {
                this.$enableui[k] = false;
            } else {
                this.$enableui[k] = true;
                x = k;
            }
        }
    }
    if (x != null) this.applyRadioMode(x);
    this.enabledui_changed.invoke(this, null);
}
UtilityNode.prototype.get_someenabled = function() {
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k) && k != "") {
            if (this.$enableui[k]) {
                return true;
            }
        }
    }
    return false;
}
UtilityNode.prototype.get_allenabled = function() {
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k) && k != "") {
            if (!this.$enableui[k]) {
                return false;
            }
        }
    }
    return true;
}
UtilityNode.prototype.enableAll = function(e_sender, dc, bind) {
    var x = null;
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k) && k != "") {
                if (x == null) x = k;
                this.$enableui[k] = true;
        }
    }
    if (x != null) this.applyRadioMode(x);
    this.enabledui_changed.invoke(this, null);
}
UtilityNode.prototype.disableAll = function(e_sender, dc, bind) {
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k) && k != "") {
                this.$enableui[k] = false;
        }
    }
    this.enabledui_changed.invoke(this, null);
}
/**
 * 
 */
UtilityNode.prototype.smartEnableDisableAll = function(e_sender, dc, bind) {
    var some = this.get_someenabled();
    var x = null;
    for (var k in this.$enableui) {
        if (this.$enableui.hasOwnProperty(k) && k != "") {
            if (some) {
                this.$enableui[k] = false;
            } else {
                if (x == null) x = k;
                this.$enableui[k] = true;
            }
        }
    }
    if (x != null) this.applyRadioMode(x);
    this.enabledui_changed.invoke(this, null);
}


// Zorderging
UtilityNode.prototype.$getOrderlings = function() {
    if (typeof this.get_zorder() == "string") {
        var els = this.getRelatedElements(this.get_zorder());
        // To simplify jq removal
        var arr = []
        for (var i = 0; i < els.length; i++) {
            arr.push(els.get(i));
        }
        return arr;
    }
    return [];
}
UtilityNode.prototype.onMoveTop = function(e_s, dc, bind) {
    if (BaseObject.is(bind,"Binding")) {
        var el = bind.get_target();
        var ords = this.$getOrderlings();
        if (ords != null && ords.length > 0) {
            for (var i = 0; i < ords.length; i++) {
                if (ords[i] != el) {
                    ords[i].style.zIndex = i + this.get_zorderMin();
                }
            }
            el.style.zIndex = i + this.get_zorderMin();
        }

    }
}

})();