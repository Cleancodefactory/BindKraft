



/*CLASS*/
function Size(w, h) {
	BaseObject.apply(this,arguments);
    if (arguments.length == 1) {
		if (BaseObject.is(w,"Point")) {
			this.w = w.x;
            this.h = w.y;
		} else if (BaseObject.is(w,"Size") || BaseObject.is(w,"Rect")) {
			this.w = w.w;
            this.h = w.h;
		} else if (BaseObject.is(w, "Array")) {
            this.w = w[0];
            this.h = w[1];
        } else if (typeof (w) == "object") {
            this.w = w.w;
            this.h = w.h;
        }
    } else {
        this.w = w; this.h = h;
    }
};
Size.Inherit(BaseObject, "Size");
Size.interfaces = { PSize: true };
Size.Implement(IObjectifiable);
Size.fromArray = function (a) {
    return new Size(a[0], a[1]);
};
Size.prototype.objectifyInstance = function() {
	var o = {
		$__className: "Size",
		width: this.w,
		height: this.h
	}
};
Size.prototype.individualizeInstance = function(v) {
	if (v != null && typeof v == "object" && this.is("Size")) {
		this.w = o.width;
		this.h = o.height;
	}
};
Size.prototype.toString = function () {
    return ("w=" + this.w + ",h=" + this.h);
};
Size.prototype.get_isvalid = function() {
	return (this.h != null && this.w != null);
}
Size.prototype.subtract = function (p) {
    if (BaseObject.is(p, "Point")) {
        return new Size(this.w - p.x, this.h - p.y);
    } else if (BaseObject.is(p, "Size")) {
        return new Size(this.w - p.w, this.h - p.h);
    } else if (typeof(p) == "object") {
        return new Size(this.w - p.w, this.h - p.h);
    }
    return new Size(this.w, this.h);
};
Size.prototype.add = function (p) {
    if (BaseObject.is(p, "Point")) {
        return new Size(this.w + p.x, this.h + p.y);
    } else if (BaseObject.is(p, "Size")) {
        return new Size(this.w + p.w, this.h + p.h);
    } else if (typeof (p) == "object") {
        return new Size(this.w + p.w, this.h + p.h);
    }
    return new Size(this.w, this.h);
};
Size.fromDOMElement = function (el) {
    var p = $(el).position();
    return new Size($(el).width(), $(el).height());
};