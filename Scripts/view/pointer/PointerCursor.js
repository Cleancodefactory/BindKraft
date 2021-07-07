(function() {
    function PointerCursor(kind, args) {
        BaseObject.apply(this, arguments);
        if (typeof kind != "string") {
            this.$kind = "auto";
        } else {
            this.$kind = kind;
        }
        var x = []
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (typeof arg == "string") { // Collecting as any number of fall back url
                this.$urls.push(arg);
            } else if (typeof arg == "number") { // only 2 make sense as anchor point of the cursor (currently used for all the images)
                x.push(Math.floor(arg));
            }
        }
        if (x.length > 1) {
            this.anchor = new GPoint(x);
        } else {
            this.anchor = null;
        }
    }
    PointerCursor.Inherit(BaseObject, "PointerCursor");

    PointerCursor.prototype.$kind = null;
    PointerCursor.prototype.$anchor = null;
    PointerCursor.prototype.$urls = new InitializeArray("Array of url.");

    PointerCursor.prototype.getStyle = function() {
        var s = "";
        if (this.$urls.length > 0) {
            for (var i = 0; i < this.$urls.length; i++) {
                if (s.length > 0) s+= ",";
                s += "url(" + this.$urls[i] + ")"
                if (this.$anchor != null) {
                    s += " " + this.$anchor.x + " " + this.$anchor.y;
                }
            }
        }
        if (s.length > 0) s+= ", ";
        s += this.$kind;
        return s;
    }

    PointerCursor.prototype.$defaultElement = null;
    /**
     * Use only for short lived cursor instances created for specific purpose. Apply/unapply will apply 
     * the cursor to this element ic called without arguments. This is convenient when the cursor has to be changed temporarily.
     */
    PointerCursor.prototype.defaultElement = function(els) {
        var el = null;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof HTMLElement) {
                el = arguments[i];
                break;
            }
        }
        if (el == null) {
            this.$defaultElement = null;
        } else if (el instanceof HTMLElement) {
            this.$defaultElement = el;    
        }
        return this;
    }
    /**
     * Applies this cursor to the specified element or body (if el == null)
     * Remembers the old cursor setting (only from style) for potential unapply later - a little convenience.
     */
    PointerCursor.prototype.applyTo = function(el) {
        var x = null;
        if (el instanceof HTMLElement) {
            x = el;
        } else if (el == null) {
            x = this.$defaultElement || document.body;
        }
        if (x != null) {
            var old = x.style.cursor;
            x.style.cursor = this.getStyle();
            if (typeof old == "string" && old.length == null) old = null;
            this.$rememberedCursor = old;
        }
    }
    PointerCursor.prototype.$rememberedCursor = null;
    PointerCursor.prototype.unapplyTo = function(el) {
        var x = null;
        if (el instanceof HTMLElement) {
            x = el;
        } else if (el == null) {
            x = this.$defaultElement || document.body;
        }
        if (x != null) {
            x.style.cursor = this.$rememberedCursor?this.$rememberedCursor:null;
            this.$rememberedCursor = null;
        }
    }

    PointerCursor.Move = function () {
        return new PointerCursor("grab");
    }
    PointerCursor.ResizeH = function () {
        return new PointerCursor("ew-resize");
    }
    PointerCursor.ResizeV = function () {
        return new PointerCursor("ns-resize");
    }
    PointerCursor.ResizeNESW = function () {
        return new PointerCursor("nesw-resize");
    }
    PointerCursor.ResizeNWSE = function () {
        return new PointerCursor("nwse-resize");
    }
    
})();