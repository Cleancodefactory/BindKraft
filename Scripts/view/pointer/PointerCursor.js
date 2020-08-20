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
            if (typeof arg == "string") {
                this.$urls.push(arg);
            } else if (typeof arg == "number") {
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