
(function() {

    var GPoint = Class("GPoint");

function GRect() {

}
GRect.Inherit(GPoint, "GRect")
    .Implement(IObjectifiable);

GRect.prototype.objectifyInstance = function() {
	var o = {
		$__className: "GRect",
		w: this.w,
		h: this.h
	}
	IObjectifiable.objectifyToAs(o, this, "GPoint");
	return o;
}
GRect.prototype.individualizeInstance = function(v) {
	if (v != null && typeof v == "object" && this.is("GRect")) {
		GPoint.prototype.individualizeInstance.call(this,v);
		this.w = v.w;
		this.h = v.h;
	}
}

//#region Validation and regularization

GRect.prototype.isValid = function() {
	if (GPoint.prototype.isValid.call(this)) {
		if (typeof this.w == "number" && typeof this.h == "number" &&
		    !isNaN(this.w) && !isNaN(this.h)) return true;
    }
    return false;
}
GRect.prototype.isEmpty = function() {
	if (this.w == 0 && this.h == 0) return true;
	return false;
}


//#endregion

//#region Static creators
GRect.fromArray = function (a) {
    if (BaseObject.is(a, "Array")) {
        return new GRect(a[0], a[1], a[2], a[3]);
    } else {
        return GRect.empty();        
    }
};
GRect.empty = function() {
	return new GRect(0,0,0,0);
}
GRect.fromDOMElementViewport = function(_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		var rc = el.getBoundingClientRect();
		return new GRect(Math.floor(rc.left),Math.floor(rc.top),Math.floor(rc.right - rc.left),Math.floor(rc.bottom - rc.top));
	}
	return null;
}.Description("Returns browser's viewport coordinates");
GRect.fromDOMElementOffset = function (_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		if (el.offsetParent != null) {
			return new GRect(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight);
		} else {
            return GRect.empty();
        }
	}
	return null;
};
GRect.fromDOMElementClient = function (_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
		return new GRect(el.clientLeft, el.clientTop, el.clientWidth, el.clientHeight);
	}
	return null;
};
GRect.fromDOMElementClientViewport = function (_el) {
	var el = DOMUtil.toDOMElement(_el);
	if (el != null && el instanceof HTMLElement) {
        var rc = GRect.fromDOMElementViewport(el);
		return new GRect(el.clientLeft + rc.x, el.clientTop + rc.y, el.clientWidth, el.clientHeight);
	}
	return null;
};

//#endregion

//#region Mapping

//#endregion


})();