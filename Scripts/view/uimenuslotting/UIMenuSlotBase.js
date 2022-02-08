(function() {

    /**
     * Abstract class providing the inheritors with basic tools for implementing features
     */
    function UIMenuSlotBase() {
        Base.apply(this, arguments);
    }
    UIMenuSlotBase.Inherit(Base, "UIMenuSlotBase");

    UIMenuSlotBase.prototype.$cookie = 0;
    /**
     * The generator uses the arguments (if supplied) and includes them in the generated cookie for further decoding.
     * 
     * @param {string} area Optional area in which the menu will be slotted. Helps the host to find it.
     * @param {integer} depth Optional depth level of the menu item for which the cookie is generated.
     */
    UIMenuSlotBase.prototype.genCookie = function(area,depth) {
        var s = this.$__instanceId;
        s += " " + (this.$cookie++);
        if (typeof area == "string" && !/\s|(^#)/.test(area)) {
            s += " " + area;
        } else {
            s += " " + area;
        }
        if (typeof depth == "number") {
            s += " #" + depth;
        }
        return s;
    }

    UIMenuSlotBase.prototype.decodeCookie = function(cookie) {
        if (typeof cookie != "string" || cookie.length < 3) {
            this.LASTERROR("Invalid cookie", "decodeCookie");
            return null;
        }
        var iid = this.$__instanceId;
        if (cookie.indexOf(iid) != 0) {
            this.LASTERROR("The cookie is not issued by this instance.", "decodeCookie");
            return null;
        }

        
        var r = String.reGroups2(cookie,/(?:^(\S+))|(?:\s*(?:(?:#(\d+(?:\.\d*)?))|([a-zA-Z0-9_\-]+)))/g,"id","depth","area").Combine();
        if (r != null) { return BaseObject.CastObjectValues(r,{depth:"int",area:"string",id:"string"}); }
        return r;
    }

    // TODO: The interesting question here is: Is this called after the processor is set? It should be so, it seems.
    //  This will mean we do not need the processorType much (may be at all) and we can check the selected component class against the processor specified by the item creator.
    UIMenuSlotBase.prototype.getOpinion = function(slotInterface,menuItem,fallBack) {
        var interfaceDef = Class.getInterfaceName(slotInterface);
        var suggestedClass = null;
        var proc = null;
        if (BaseObject.is(menuItem.get_processor(),"IUIMenuProcessorOpinion")) {
            proc = menuItem.get_processor();
            suggestedClass = menuItem.get_processor().suggestUIComponentClass(slotInterface, menuItem);
        }
        if (suggestedClass == null && BaseObject.is(menuItem.get_owner(),"IUIMenuProcessorOpinion")) { 
            suggestedClass = menuItem.get_owner().suggestUIComponentClass(slotInterface, menuItem);
        }
        if (suggestedClass == null) { 
            suggestedClass = menuItem.get_hostComponentClass();
        }
        var result = suggestedClass || fallBack;
        if (!this.checkProcessorComponentCompatibility((proc?proc.classDefinition():null),result)) return null;
        return result;
    }
    UIMenuSlotBase.prototype.checkProcessorComponentCompatibility = function(processorType,componentClass) {
        return true;
        if (processorType == null) return true; // TODO This looks a little bit controversial
        var cls = Class.getClassDef(componentClass);
        if (cls == null || cls.compatibleTypesList == null) return false;
        var proc = Class.getInterfaceName(processorType);
        if (proc == null) return false;
        return (cls.compatibleTypesList.indexOf(proc) >= 0);
    }

    //#region 

    UIMenuSlotBase.prototype.toggleVisibility = function() {
        if (this.root.style.visibility != "visible") {
            this.root.style.visibility = "visible";
        } else {
            this.root.style.visibility = "hidden";
        }
    }

    //#endregion

})();