

// END BASE CLASSES FOR INSTRUMENTS
/*CLASS*/
function Point(x, y) {
	BaseObject.apply(this,arguments);
    
	if (BaseObject.is(x, "Array")) {
		this.x = x[0];
		this.y = x[1];
	} else if (BaseObject.is(x, "Point")) {
		this.x = x.x;
		this.y = x.y;
	} else if (x != null && typeof (x) == "object") {
		this.x = x.x;
		this.y = x.y;
	} else {
		this.x = x; this.y = y;
	}
};
Point.Inherit(BaseObject, "Point");
Point.interfaces = { PPoint: true };
Point.Implement(IObjectifiable);

Point.prototype.objectifyInstance = function() {
	var o = {
		$__className: "Point",
		x: this.x,
		y: this.y
	}
	return o;
}
Point.prototype.individualizeInstance = function(v) {
	if (v != null && typeof v == "object" && this.is("Point")) {
		this.x = v.x;
		this.y = v.y;
	}
}
Point.fromArray = function (a) {
    return new Point(a[0], a[1]);
};
Point.prototype.isValid = function() {
	if (typeof this.x == "number" && typeof this.y == "number" &&
		!isNaN(this.x) && !isNaN(this.y)) return true;
		return false;
}
Point.prototype.toString = function () {
    return ("x=" + this.x + ",y=" + this.y);
};
Point.prototype.subtract = function (p) {
    if (p != null) {
        return new Point(this.x - p.x, this.y - p.y);
    }
    return new Point(this.x, this.y);
};
Point.prototype.add = function (p) {
    if (p != null) {
        return new Point(this.x + p.x, this.y + p.y);
    }
    return new Point(this.x, this.y);
};
Point.prototype.distance = function(_pt) {
	var pt = new Point(_pt);
	if (pt.isValid()) {
		return Math.sqrt((this.x - pt.x) * (this.x - pt.x) + (this.y - pt.y) * (this.y - pt.y));
	}
	return null;
}
Point.prototype.mapRelativeFromTo = function(ptBaseCurrent,ptBaseNew) {
	var curBase, newBase;
	function _rp(pt) {
		if (BaseObject.is(pt,"Point")) {
			return Point(pt);
		} else {
			return Point(0,0);
		}
	}
	curBase = _rp(ptBaseCurrent);
	newBase = _rp(ptBaseNew);
	return new Point(curBase.x + this.x - newBase.x, curBase.y + this.y - newBase.y);
}.Description("Maps this point from one base to another given by arguments");
Point.prototype.mapTo = function(pt) {
	return mapRelativeFromTo(null,pt);
}
Point.prototype.mapFromToElements = function(el1, el2) {
	var ref1 = new Point(0,0), ref2 = new Point(0,0);
	var rect;
	if (el1 != null && el1 instanceof HTMLElement) {
		rect = el1.getBoundingClientRect();
		ref1 = new Point(rect.left,rect.top);
	}
	if (el2 != null && el2 instanceof HTMLElement) {
		rect = el2.getBoundingClientRect();
		ref2 = new Point(rect.left,rect.top);
	}
	return new Point(ref1.x + this.x - ref2.x, ref1.y + this.y - ref2.y);
}.Description("maps the point coordinates from el1 space to el2 space, if any of them is null, it is considered to be the viewport (client coordinates of the browser window)")