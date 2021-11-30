(function() {

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

        var c = cookie.slice(iid.length);
        /^\s(\d+)(?:\s(?:))/

        var result = {

        }
        //////////
    }

})();