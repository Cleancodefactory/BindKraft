

(function() {

    var IGPoint = Interface("IGPoint");
    var IGRect = Interface("IGRect");

    function GPoint(x, y) {
        BaseObject.apply(this, arguments);
        if (BaseObject.is(x, "Array")) {
            this.x = x[0];
            this.y = x[1];
        } else if (BaseObject.is(x, "IGPoint") || BaseObject.is(x, "Point")) {
            this.x = x.x;
            this.y = x.y;
        } else if (x != null && typeof (x) == "object") {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x; this.y = y;
        }
    }
    GPoint.Inherit(BaseObject, "GPoint")
        .Implement(IObjectifiable)
        .Implement(IGPoint);

    GPoint.prototype.objectifyInstance = function() {
        var o = {
            $__className: "GPoint",
            x: this.x,
            y: this.y
        }
        return o;
    }
    GPoint.prototype.individualizeInstance = function(v) {
        if (v != null && typeof v == "object" && this.is("GPoint")) {
            this.x = v.x;
            this.y = v.y;
        }
    }
    GPoint.fromArray = function(a) {
        if (BaseObject.is(a, "Array")) {
            return new GPoint(a[0], a[1]);
        } else {
            return new GPoint(0,0);
        }
    }
    GPoint.prototype.isValid = function() {
        if (typeof this.x == "number" && typeof this.y == "number" &&
            !isNaN(this.x) && !isNaN(this.y)) return true;
            return false;
    }
    GPoint.prototype.toString = function () {
        return ("x=" + this.x + ",y=" + this.y);
    };
    GPoint.prototype.subtract = function (p) {
        if (BaseObject.is(p, "IGPoint") || BaseObject.is(p, "Point")) {
            return new GPoint(this.x - p.x, this.y - p.y);
        }
        return new GPoint(this.x, this.y);
    };
    GPoint.prototype.add = function (p) {
        if (BaseObject.is(p, "IGPoint") || BaseObject.is(p, "Point")) {
            return new GPoint(this.x + p.x, this.y + p.y);
        }
        return new GPoint(this.x, this.y);
    };
    GPoint.prototype.distance = function(_pt) {
        var pt = new GPoint(_pt);
        if (pt.isValid()) {
            return Math.sqrt((this.x - pt.x) * (this.x - pt.x) + (this.y - pt.y) * (this.y - pt.y));
        }
        return null;
    }
    // override
    GPoint.prototype.mapFromTo = function(ptBaseCurrent,ptBaseNew) {
        var curBase, newBase;
        function _rp(pt) {
            if (BaseObject.is(pt,"IGPoint") || BaseObject.is(pt,"Point")) {
                return new GPoint(pt);
            } else {
                return new GPoint(0,0);
            }
        }
        curBase = _rp(ptBaseCurrent);
        newBase = _rp(ptBaseNew);
        return new GPoint(curBase.x + this.x - newBase.x, curBase.y + this.y - newBase.y);
    }
    // override
    GPoint.prototype.mapTo = function(pt) {
        return this.mapFromTo(null,pt);
    }
    // override
    GPoint.prototype.mapFromToElements = function(el1, el2) {
        var ref1 = new GPoint(0,0), ref2 = new GPoint(0,0);
        var dom_rect;
        if (el1 != null && el1 instanceof HTMLElement) {
            dom_rect = IGRect.RoundBoundingRect(el1.getBoundingClientRect());
            ref1 = new GPoint(dom_rect.left + el1.clientLeft,dom_rect.top + el1.clientTop);
        }
        if (el2 != null && el2 instanceof HTMLElement) {
            dom_rect = IGRect.RoundBoundingRect(el2.getBoundingClientRect());
            ref2 = new GPoint(dom_rect.left + el2.clientLeft,dom_rect.top + el2.clientTop);
        }
        return new GPoint(ref1.x + this.x - ref2.x, ref1.y + this.y - ref2.y);
    }.Description("maps the point coordinates from el1 space to el2 space, if any of them is null, it is considered to be the viewport (client coordinates of the browser window)")
    GPoint.prototype.toDOMElement = function (_el) {
		var el = DOMUtil.toDOMElement(_el);
		if (el instanceof HTMLElement) {
			el.style.left = this.x + "px";
			el.style.top = this.y + "px";
		}
	};
})();