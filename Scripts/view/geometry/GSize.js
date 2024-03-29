

(function() {

    var IGPoint = Interface("IGPoint"),
        IGSize = Interface("IGSize"),
        IGRect = Interface("IGRect");

    function GSize(w, h) {
        BaseObject.apply(this,arguments);
        if (arguments.length == 1) {
            if (BaseObject.is(w,"IGPoint") || BaseObject.is(w,"Point")) {
                this.w = w.x;
                this.h = w.y;
            } else if (BaseObject.is(w,"IGSize") || BaseObject.is(w,"IGRect") || BaseObject.is(w,"Size") || BaseObject.is(w,"Rect")) {
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
    GSize.Inherit(BaseObject, "GSize")
        .Implement(IObjectifiable)
        .Implement(IGSize);

    GSize.fromArray = function (a) {
        if (BaseObject.is(a, "Array")) {
            return new GSize(a[0], a[1]);
        } else {
            return new GSize(0,0);
        }
    };
    GSize.fromDOMElement = function (_el) {
        var el = DOMUtil.toDOMElement(_el);
		if (el != null && el instanceof HTMLElement) {
            var r = IGRect.RoundBoundingRect(el.getBoundingClientRect());
            return new GSize(Math.floor(rc.right - rc.left),Math.floor(rc.bottom - rc.top));
        }
        return null;        
    };
    GSize.fromDOMElementClient = function (_el) {
        var el = DOMUtil.toDOMElement(_el);
		if (el != null && el instanceof HTMLElement) {
            return new GSize(el.clientWidth, el.clientHeight);
        }
        return null;        
    };

    //#region Objectivization/serialization

    GSize.prototype.objectifyInstance = function() {
        var o = {
            $__className: "GSize",
            width: this.w,
            height: this.h
        }
    };
    GSize.prototype.individualizeInstance = function(v) {
        if (v != null && typeof v == "object" && this.is("GSize")) {
            this.w = o.width;
            this.h = o.height;
        }
    };
    GSize.prototype.toString = function () {
        return ("w=" + this.w + ",h=" + this.h);
    };

    //#endregion


    //#region Valiadtion

    GSize.prototype.isValid = function() {
        if (typeof this.w == "number" || typeof this.h == "number") {
            if (!(isNaN(this.w) || isNaN(this.h))) {
                return true;
            }
        }
        return false;
    }
    // Why?
    GSize.prototype.get_isvalid = function() {
        return this.isValid();
    }


    //#endregion


    //#region Calculative

    GSize.prototype.subtract = function (p) {
        if (BaseObject.is(p, "IGPoint") || BaseObject.is(p, "Point")) {
            return new Size(this.w - p.x, this.h - p.y);
        } else if (BaseObject.is(p, "IGSize") || BaseObject.is(p, "Size")) {
            return new Size(this.w - p.w, this.h - p.h);
        } else if (typeof(p) == "object") {
            return new Size(this.w - p.w, this.h - p.h);
        }
        return new Size(this.w, this.h);
    };
    GSize.prototype.add = function (p) {
        if (BaseObject.is(p, "IGPoint")) {
            return new GSize(this.w + p.x, this.h + p.y);
        } else if (BaseObject.is(p, "IGSize")) {
            return new GSize(this.w + p.w, this.h + p.h);
        } else if (typeof (p) == "object") {
            return new GSize(this.w + p.w, this.h + p.h);
        }
        return new GSize(this.w, this.h);
    };

    //#endregion

})();