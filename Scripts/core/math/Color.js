

function Color(clr) {
	BaseObject.apply(this,arguments);
    if (clr != null && BaseObject.is(clr, "Color")) {
        this.r = clr.r;
        this.g = clr.g;
        this.b = clr.b;
    } else {
        if (!Color.parseColorString(this, clr)) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
        }
    }
};
Color.Inherit(BaseObject, "Color");
Color.Implement(IObjectifiable);
Color.prototype.objectifyInstance = function() {
	var o = {
		$__className: "Color",
		color: this.toString("HEX")
	}
	return o;
}
Color.prototype.individualizeInstance = function(v) {
	if (v != null && typeof v == "object" && this.is("Color")) {
		if (!Color.parseColorString(this, v.color)) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
        }
	}
}
Color.reRgb = /rgb\(\s*(d+)\s*\,\s*(d+)\s*\,\s*(d+)\s*\)/i;
Color.reHex3 = /^\#([0-9abcdefABCDEF])([0-9abcdefABCDEF])([0-9abcdefABCDEF])$/i;
Color.reHex6 = /^\#([0-9abcdefABCDEF]{2})([0-9abcdefABCDEF]{2})([0-9abcdefABCDEF]{2})$/i;
Color.parseColorString = function (obj, sClr) {
    var s;
    if (sClr != null) {
        s = sClr.trim();
        var r = s.match(Color.reRgb);
        if (r != null) {
            obj.r = parseInt(r[1]);
            obj.g = parseInt(r[2]);
            obj.b = parseInt(r[3]);
            return true;
        } else {
            r = s.match(Color.reHex6);
        }
        if (r == null) r = s.match(Color.reHex3);
        if (r != null) {
            obj.r = parseInt(r[1], 16);
            obj.g = parseInt(r[2], 16);
            obj.b = parseInt(r[3], 16);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
Color.prototype.toString = function (fmt) {
    var f = (fmt == null) ? "hex" : fmt;
    var s, r, g, b;
    switch (f.toUpperCase()) {
        case "HEX":
            r = (parseInt(this.r) % 256).toString(16);
            g = (parseInt(this.g) % 256).toString(16);
            b = (parseInt(this.b) % 256).toString(16);
            s = "#" + ((r.length < 2) ? "0" : "") + r + ((g.length < 2) ? "0" : "") + g + ((b.length < 2) ? "0" : "") + b;
            return s;
        case "RGB":
            s = "rgb(" + (parseInt(this.r) % 256).toString() + "," + (parseInt(this.g) % 256).toString() + "," + (parseInt(this.b) % 256).toString() + ")";
            return s;
        default:
            throw loc_UnsupportedColorFormat + ' '  + fmt;
    }
};