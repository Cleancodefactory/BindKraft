


/*CLASS*/
// Variants: Rect(Point[,Point | object]), Rect(x,y,width,height), Rect(array), Rect(object) where object is {x,y,w,h}
function Rect(x, y, w, h) {
	Point.apply(this, arguments);
    if (BaseObject.is(x, "Point") && !BaseObject.is(x, "Rect")) {
        this.x = x.x;
        this.y = x.y;
        if (BaseObject.is(y, "Point")) {
            this.w = y.x - x.x;
            this.h = y.y - x.y;
        } else if (typeof (y) == "object") {
            if (y.x != null && y.y != null) {
                this.w = y.x - x.x;
                this.h = y.y - x.y;
            } else if (y.w != null && y.h != null) {
                this.w = y.w;
                this.h = y.h;
            }
        }
    } else if (BaseObject.is(x, "Array")) {
        this.x = x[0];
        this.y = x[1];
        this.w = x[2];
        this.h = x[3];
    } else if (x != null && typeof (x) == "object") { // This also covers the Rect case
        if (x.x != null && x.y != null) {
            this.x = x.x; this.y = x.y;
        } else if (x.left != null && x.top != null) {
            this.x = x.left; this.y = x.top;
        }
        this.w = x.w;
        this.h = x.h;
    } else {
        // Rect.parent.constructor.call(this, x, y); // Should be done initially (see above)
        this.w = w; this.h = h;
    }
};
Rect.Inherit(Point, "Rect");
Rect.interfaces = { IGRect: true };
Rect.Implement(IObjectifiable);
Rect.prototype.objectifyInstance = function() {
	var o = {
		$__className: "Rect",
		w: this.w,
		h: this.h
	}
	IObjectifiable.objectifyToAs(o, this, "Point");
	return o;
}
Rect.prototype.individualizeInstance = function(v) {
	if (v != null && typeof v == "object" && this.is("Rect")) {
		Point.prototype.individualizeInstance.call(this,v);
		this.w = v.w;
		this.h = v.h;
	}
}

Rect.fromArray = function (a) {
    return new Rect(a[0], a[1], a[2], a[3]);
};
Rect.empty = function() {
	return new Rect(0,0,0,0);
}
Rect.fromDOMElement = function (_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null) {
		//if (el.offsetParent != null) {
			return new Rect(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight);
		//}
	}
	return null;
	/*
    var p = $(el).position();
    return new Rect(p.left, p.top, $(el).width(), $(el).height());
	*/
};
Rect.fromDOMElementOffset = function (_el) { 
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		//var brc = Rect.fromBoundingClientRectangle(document.body);
		//if (brc == null) return null;
		var rc = Rect.fromBoundingClientRectangle(el);
		rc.mapFromToElements(null, document.body);
		return rc;
	}
	return null;
	/*
    var off = $(el).offset();
    return new Rect(off.left, off.top, $(el).width(), $(el).height());
	*/
};
Rect.fromBoundingClientRectangle = function(_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		var rc = el.getBoundingClientRect();
		return new Rect(Math.floor(rc.left),Math.floor(rc.top),Math.floor(rc.right - rc.left),Math.floor(rc.bottom - rc.top));
	}
	return null;
}.Description("Returns browser's viewport coordinates");
Rect.fromDOMElementInner = function(_el) { // jq like - client offset from the body + border and RTL scrollbar (if any)
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		var rc = Rect.fromDOMElementOffset(el);
		if (rc == null) return null;
		var crc = new Rect(rc.x + el.clientLeft,rc.y + el.clientTop,el.clientWidth, el.clientHeight);
		return crc;
	}
	return null;
}
/*
Rect.fromDOMElementInner_old = function (el) {
    var off = $(el).offset();
    if ($(el).length > 0) {
        var raw = $(el).get(0);
        var w = $(el).width(), h = $(el).height();
        if (raw.scrollHeight > h) {
            h = h - JBUtil.getScrollbarWidth();
        }
        if (raw.scrollWidth > w) {
            w = w - JBUtil.getScrollbarWidth();
        }
		return new Rect(off.left, off.top, w, h);
    } else {
        return new Rect(off.left, off.top, $(el).width(), $(el).height());
    }
};
*/

Rect.prototype.isEmpty = function() {
	if (this.w == 0 && this.h == 0) return true;
	return false;
}
Rect.prototype.isValid = function() {
	if (Point.prototype.isValid.call(this)) {
		if (typeof this.w == "number" && typeof this.h == "number" &&
		!isNaN(this.w) && !isNaN(this.h)) return true;
	}
}
Rect.prototype.isRegular = function(checkTypesToo) {
	function _nn(v) {
		if (typeof v == "number" && !isNaN(v)) return true;
		return false;
	}
	if (this.x != null && this.y != null && this.w != null && this.h != null) {
		if (checkTypesToo && (!_nn(this.x) || !_nn(this.y) || !_nn(this.w) || !_nn(this.h))) return false;
		if (this.w >= 0 && this.h >= 0) return true;
	}
	return false;
}
Rect.prototype.regularize = function() {
	var r = new Rect(this);
	function _nn(v) {
		if (typeof v == "number" && !isNaN(v)) return true;
		return false;
	}
	if (r.x == null || r.y == null || r.w == null || r.h == null) return null; // Cannot repair this.
	if (typeof r.x != "number") r.x = parseFloat(r.x);
	if (typeof r.y != "number") r.y = parseFloat(r.y);
	if (typeof r.w != "number") r.w = parseFloat(r.w);
	if (typeof r.h != "number") r.h = parseFloat(r.h);
	if (!_nn(r.x) || !_nn(r.y) || !_nn(r.w) || !_nn(r.h)) return null; // Cannot repair this too
	if (r.w < 0) {
		r.x = r.x + r.w;
		r.w = - r.w;
	}
	if (r.h < 0) {
		r.y = r.y + r.h;
		r.h = - r.h;
	}
	return r;	
}
Rect.prototype.mapFromToElements = function(el1, el2) { // Overrides the one from Point.
	var pt = Point.prototype.mapFromToElements.call(this,el1,el2);
	return new Rect(pt.x, pt.y,this.w, this.h);
}.Description("maps the rectangle coordinates from el1 space to el2 space, if any of them is null, it is considered to be the viewport (client coordinates of the browser window)")
Rect.prototype.toDOMElement = function (_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		el.style.left = this.x + "px";
		el.style.top = this.y + "px";
		el.style.width = this.w + "px";
		el.style.height = this.h + "px";
	}
	/*
    var el = $(domEl);
    if (el.length > 0) {
        if (this.x != null) el.css("left", this.x + "px");
        if (this.y != null) el.css("top", this.y + "px");
        if (this.w != null) el.css("width", this.w + "px");
        if (this.h != null) el.css("height", this.h + "px");
    }
	*/
};
Rect.prototype.clearPos = function () {
    this.x = this.y = null;
};
Rect.prototype.clearSize = function () {
    this.w = this.h = null;
};
Rect.prototype.get_size = function() {
	return new Size(this.w,this.h);
}
Rect.prototype.set_size = function(v) {
	var s = new Size(v);
	if (s.get_isvalid()) {
		this.w = s.w;
		this.h = s.h;
	}
}
Rect.prototype.get_right = function() {
	if (this.w != null && this.x != null) return this.w + this.x;
	return null;
}
Rect.prototype.get_bottom = function() {
	if (this.h != null && this.y != null) return this.h + this.y;
	return null;
}
Rect.prototype.contains = function(pt_or_rect) {
	var result = false;
	var r = pt_or_rect;
	if (BaseObject.is(pt_or_rect,"Point")) {
		result = (r.x >= this.x &&
			r.x <= this.get_right() &&
			r.y >= this.y &&
			r.y <= this.get_bottom());
	} 
	if (BaseObject.is(pt_or_rect,"Rect") && result) {
		result = (r.get_right() >= this. x &&
				  r.get_right() <= this.get_right() &&
				  r.get_bottom() >= this.y &&
				  r.get_bottom() <= this.get_bottom());
	}
	return result;
}
Rect.prototype.innerSpaceFor = function(pt_or_rect) {
	if (BaseObject.is(pt_or_rect,"Rect")) {
		var rin = pt_or_rect;
		var maxXInner = this.w - rin.w;
		var maxYInner = this.h - rin.h;
		if (maxXInner < 0 || maxYInner < 0) return null;
		return new Rect(this.x,this.y,maxXInner,maxYInner);
	} else if (BaseObject.is(pt_or_rect,"Point")) {
		return new Rect(this);
	}
	return null;
	
}.Description("Returns a rectangle where the passed rectangle's x,y can be placed so that the whole passed rectangle would fit into this one.")
	.Param("pt_or_rect","Rect or Point, if point is passed new rectangle same as this one will be returned.");
Rect.prototype.innerSpaceForAnchoredRectangle = function(rect, anchor) {
	if (!BaseObject.is(rect,"Rect") || !BaseObject.is(anchor,"Point")) return null;
	var result = new Rect(this.x + (anchor.x - rect.x), this.y + (anchor.y - rect.y),this.w - (rect.w - anchor.x - rect.x),this.h - (rect.h - anchor.y - rect.y));
	if (result.isRegular()) return result;
	return null;
}.Description("Returns the rectangle in which the ancor can move so that the passed rctangle would fit into this one.")
	.Param("rect","The anchored rectangle. Only the widht and the height are taken into account. The x,y are position - it makes no sense to use them for anything.")
	.Param("anchor","The anchor point in the same coordinates as rect")
	.Returns("Rect in the same coordinate system as this one.");
Rect.prototype.mapToInsides = function(pt_or_rect, anchor) {
	var result = null;
	if (BaseObject.is(pt_or_rect,"Rect")) {
		var innerspace = null;
		if (BaseObject.is(anchor,"Point")) {
			innerspace = this.innerSpaceForAnchoredRectangle(pt_or_rect,anchor);
			if (innerspace != null && innerspace.isRegular()) {
				var pt = innerspace.mapToInsides(anchor);
				if (pt != null) {
					result = new Rect(pt_or_rect.x = pt_or_rect.x + pt.x - anchor.x,
									pt_or_rect.y = pt_or_rect.y + pt.y - anchor.y,
									pt_or_rect.w, pt_or_rect.h);
				}
			}
		} else {
			innerspace = this.innerSpaceFor(pt_or_rect);
			if (innerspace == null || !innerspace.isRegular()) return null;
			var newUL = innerspace.innerSpaceFor(new Point(pt_or_rect.x,pt_or_rect.y));
			result = new Rect(this);
			result.x = newUL.x;
			result.y = newUL.y;
		}
	} else if (BaseObject.is(pt_or_rect,"Point")) {
		var p = pt_or_rect;
		var result = new Point(p);
		if (result.x < this.x) result.x = this.x;
		if (result.x >= this.x + this.w) result.x = this.x + this.w - 1;
		if (result.y < this.y) result.y = this.y;
		if (result.y >= this.y + this.h) result.y = this.y + this.h - 1;
	}
	return result;
}.Description("Returns the closest point or rectangle which is still inside this one. The coordinate systems are assumed to be the same.")
	.Param("anchor","Taken into account only if pt_or_rect is Rect and is treated as anchor point.");

Rect.prototype.intersectWith = function (rect) {
    if (BaseObject.is(rect, "Rect")) {
        var fIntersect = (rect.x < (this.x + this.w) &&
                            (rect.x + rect.w) > this.x &&
                            rect.y < (this.y + this.h) &&
                            (rect.y + rect.h) > this.y);
        if (fIntersect) {
            var x = Math.max(this.x, rect.x);
            var y = Math.max(this.y, rect.y);
            var w = Math.min(this.x + this.w, rect.x + rect.w) - x;
            var h = Math.min(this.y + this.h, rect.y + rect.h) - y;
            return new Rect(x,y,w,h);
        } else {
            return new Rect(0, 0, 0, 0);
        }
    }
};
Rect.prototype.center = function (r) {
    if (BaseObject.is(r, "Rect")) {
        if (r.w != null) {
            r.x = this.x + this.w / 2 - r.w / 2;
        }
        if (r.h != null) {
            r.y = this.y + this.h / 2 - r.h / 2;
        }
    } else if (BaseObject.is(r, "Point")) {
		r.x = this.x + this.w / 2;
		r.y = this.y + this.h / 2;
    }
    return r;
};
Rect.maxRect = function (arr) {
    var mi = -1, ma = 0;
    for (var i = 0; i < arr.length; i++) {
        if (BaseObject.is(arr[i], "Rect")) {
            var a = arr[i].surfaceArea();
            if (a > ma) {
                ma = a;
                mi = i;
            }
        }
    }
    if (mi >= 0 && ma >= 0) {
        return arr[mi];
    } else {
        return new Rect(0, 0, 0, 0);
    }
};
Rect.prototype.adjustPopUp = function (pt, rect, method, shifttop, shiftleft) {
    var lshift = 0;
    var tshift = 0;
    if (!IsNull(shifttop)) lshift = shifttop;
    if (!IsNull(shiftleft)) tshift = shiftleft;
    if (BaseObject.is(rect, "Rect") && BaseObject.is(pt, "Rect")) {
        if (method == "aboveunder") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x, pt.y + pt.h, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x, pt.y - rect.h, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x + pt.w - rect.w, pt.y + pt.h, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x + pt.w - rect.w, pt.y - rect.h, rect.w, rect.h))
                                 ]);
        } else if (method == "sideways") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x + pt.w, pt.y - rect.h, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x + pt.w, pt.y + pt.h, rect.w, rect.h)),                                  
                                  this.intersectWith(new Rect(pt.x - rect.w, pt.y - rect.h, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w, pt.y + pt.h, rect.w, rect.h))
            ]);
        }
    } else if (BaseObject.is(rect, "Rect") && BaseObject.is(pt, "Point")) {
        var r, a;
        if (method == "center") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x - rect.w / 2, pt.y - rect.h - tshift, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w / 2, pt.y + tshift, rect.w, rect.h))
                                  ]);
        } else if (method == "middle") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x + tshift, pt.y - rect.h / 2, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y - rect.h / 2, rect.w, rect.h))]);
        } else if (method == "centermiddle") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y - rect.h / 2, rect.w, rect.h)),
                                 this.intersectWith(new Rect(pt.x + tshift, pt.y - rect.h / 2, rect.w, rect.h)),
                                 this.intersectWith(new Rect(pt.x - rect.w / 2, pt.y - rect.h - lshift, rect.w, rect.h)),
                                 this.intersectWith(new Rect(pt.x - rect.w / 2, pt.y + lshift, rect.w, rect.h))
                                 ]);
        } else if (method == "corners") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x + tshift, pt.y + lshift, rect.w, rect.h)),
                                 this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y + lshift, rect.w, rect.h)),
                                 this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y - rect.h - lshift, rect.w, rect.h)),
                                 this.intersectWith(new Rect(pt.x + tshift, pt.y - rect.h - lshift, rect.w, rect.h))]);
        }
        else if (method == "all") {
            return Rect.maxRect([this.intersectWith(new Rect(pt.x + tshift, pt.y + lshift, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y + lshift, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y - rect.h - lshift, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x + tshift, pt.y - rect.h - lshift, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w - tshift, pt.y - rect.h / 2, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x + tshift, pt.y - rect.h / 2, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w / 2, pt.y - rect.h - lshift, rect.w, rect.h)),
                                  this.intersectWith(new Rect(pt.x - rect.w / 2, pt.y + lshift, rect.w, rect.h))
                                  ]);
        }
    }

};

Rect.prototype.surfaceArea = function () {
    return (this.h * this.w);
};
Rect.prototype.toString = function () {
    return (Rect.parent.toString.call(this) + ";w=" + this.w + ",h=" + this.h);
};