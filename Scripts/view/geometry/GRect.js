
(function() {

	var GPoint = Class("GPoint"),
		IGRect = Interface("IGRect"),
		IGSize = Interface("IGSize");

	function GRect(x, y, w, h) {
		GPoint.apply(this, arguments);
		if (BaseObject.is(x, "IGPoint") && !BaseObject.is(x, "IGRect")) {
			this.x = x.x;
			this.y = x.y;
			if (BaseObject.is(y, "IGPoint")) {
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
		} else if (BaseObject.is(x, "IGRect") || BaseObject.is(x, "Rect")) {
			this.x = x.x; this.y = x.y;
			this.w = x.w;
			this.h = x.h;
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
			// GPoint already fetched the x and y
			this.w = w; this.h = h;
		}
	}
	GRect.Inherit(GPoint, "GRect")
		.Implement(IObjectifiable)
		.Implement(IGRect)
		.Implement(IGSize);

	//#region Ojectification

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
	//#endregion

	//#region Validation and regularization

	GRect.prototype.isValid = function() {
		if (GPoint.prototype.isValid.call(this)) {
			if (typeof this.w == "number" && typeof this.h == "number" &&
				!isNaN(this.w) && !isNaN(this.h)) return true;
		}
		return false;
	}
	GRect.prototype.isEmpty = function() {
		if (this.w == 0 || this.h == 0) return true;
		return false;
	}
	GRect.prototype.isRegular = function(checkTypesToo) {
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
	GRect.prototype.regularize = function() {
		var r = new GRect(this);
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
	GRect.nullOrEmpty = function(rect) {
		if (BaseObject.is(rect, "IGRect")) {
			return rect.isEmpty();
		} else {
			return true; // null and not a rect are treated the same
		}
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

	//#region Management

	GRect.prototype.clearPos = function () {
		this.x = this.y = null;
	};
	GRect.prototype.clearSize = function () {
		this.w = this.h = null;
	};
	GRect.prototype.zeroPos = function () {
		this.x = this.y = 0;
	};
	GRect.prototype.zeroSize = function () {
		this.w = this.h = 0;
	};

	GRect.prototype.get_left = function() { return this.x; }
	GRect.prototype.set_left = function(v) { this.x = v; }

	GRect.prototype.get_top = function() { return this.y; }
	GRect.prototype.set_top = function(v) { this.y = v; }

	GRect.prototype.get_width = function() { return this.w; }
	GRect.prototype.set_width = function(v) { this.w = v; }

	GRect.prototype.get_height = function() { return this.h; }
	GRect.prototype.set_height = function(v) { this.h = v; }

	GRect.prototype.get_right = function() { return this.w + this.x; }
	GRect.prototype.set_right = function(v) { this.w = v - this.x; }

	GRect.prototype.get_bottom = function() { return this.h + this.y; }
	GRect.prototype.set_bottom = function(v) { this.h = v - this.y; }

	//#endregion

	//#region Mapping

	// GPoint.mapFromTo works without correcting sizes (which is not expected from a map routine)

	GRect.prototype.mapFromTo = function(ptBaseCurrent, ptBaseNew) {
		var pt = GPoint.prototype.mapFromTo.call(this,ptBaseCurrent, ptBaseNew);
		return new GRect(pt.x, pt.y, this.w, this.h);
	}

	// override
	/**
	 * Maps the rectangle from client coordinates of the first to the client coordinates of the second
	 * element. If any of the elements is null 0,0 is assumed as start of its client coordinate system.
	 */
	GRect.prototype.mapFromToElements = function(el1, el2) { // Overrides the one from Point.
		var pt = GPoint.prototype.mapFromToElements.call(this,el1,el2);
		return new GRect(pt.x, pt.y,this.w, this.h);
	}
	GRect.prototype.mapTo = function(pt) {
		return this.mapFromTo(null,pt);
	}

	//#endregion

	//#region Calculative instance

	GRect.prototype.surfaceArea = function () {
		return (this.h * this.w);
	};
	GRect.prototype.toString = function () {
		return (GPoint.prototype.toString.call(this) + "; w=" + this.w + ", h=" + this.h);
	};
	/**
	 * Centers the passed object in this rectangle. Does NOT check for validity, the caller
	 * should check if the objects passed are valid if deemed necessary. If called without 
	 * arguments returns a GPoint with the coordinates of the center of the rectangle.
	 * 
	 */
	GRect.prototype.center = function (r) {
		if (BaseObject.is(r, "IGRect")) {
			if (r.w != null) {
				r.x = this.x + this.w / 2 - r.w / 2;
			}
			if (r.h != null) {
				r.y = this.y + this.h / 2 - r.h / 2;
			}
		} else if (BaseObject.is(r, "IGPoint")) {
			r.x = this.x + this.w / 2;
			r.y = this.y + this.h / 2;
		} else if (r == null) {
			return new GPoint(this.x + this.w / 2, this.y + this.h / 2);
		}
		return r;
	};

	/**
	 * Checks if a GPoint or another GRect are inside (entirely) in this rectangle.
	 * The result is undefined for non-regulars - one should regularize the objects
	 * before calling the method.
	 * 
	 */
	GRect.prototype.contains = function(pt_or_rect) {
		var result = false;
		var r = pt_or_rect;
		if (BaseObject.is(pt_or_rect,"IGPoint") || BaseObject.is(pt_or_rect,"Point")) {
			result = (r.x >= this.x &&
				r.x <= this.get_right() &&
				r.y >= this.y &&
				r.y <= this.get_bottom());
		} 
		if ((BaseObject.is(pt_or_rect,"IGRect") || BaseObject.is(pt_or_rect,"Rect"))  && result) {
			result = (r.get_right() >= this.x &&
					r.get_right() <= this.get_right() &&
					r.get_bottom() >= this.y &&
					r.get_bottom() <= this.get_bottom());
		}
		return result;
	}

	/**
	 * Returns the rectangle contained in this one in which the x,y of the passed object
	 * can be set so that the passed object is still inside this rectangle.
	 * Returns null if there is no such space. For a point returns the entire rectangle 
	 * (copy of this).
	 */
	GRect.prototype.innerSpaceFor = function(pt_or_rect) {
		if (BaseObject.is(pt_or_rect,"IGRect") || BaseObject.is(pt_or_rect,"Rect")) {
			var rin = pt_or_rect;
			var maxXInner = this.w - rin.w;
			var maxYInner = this.h - rin.h;
			if (maxXInner < 0 || maxYInner < 0) return null;
			return new GRect(this.x,this.y,maxXInner,maxYInner);
		} else if (BaseObject.is(pt_or_rect,"IGPoint") || BaseObject.is(pt_or_rect,"Point")) {
			return new GRect(this);
		}
		return null;
	}

	/**
	 * Returns the (regular) rectangle in which the anchor can be put in this rectangle so that
	 * the target rect will still be inside this one. The anchor is passed in coordinates relative 
	 * to the tested rect, while the returned rectangle is in browser vp coordinates.
	 */
	GRect.prototype.innerSpaceForAnchoredRectangle = function(rect, anchor) {
		if (!(BaseObject.is(rect,"IGRect") || BaseObject.is(anchor,"IGPoint") ||
				BaseObject.is(rect,"Rect") || BaseObject.is(rect,"Point"))) return null;
		if (!(BaseObject.is(anchor, "IGPoint") || BaseObject.is(anchor, "IPoint"))) return null;
		var result = new GRect( this.x + anchor.x, 
								this.y + anchor.y,
								this.w - rect.w,
								this.h - rect.h);
		if (result.isRegular()) return result;
		return null;
	}

	/**
	 * Maps a point or an rectangle with an anchor point to a location which is inside this rect.
	 * E.g. a point that is outside will result in the closest point to it which is still 
	 * in this rectangle. A rectangle which is partially or fully outside this rectangle will result in
	 * a rectangle with the same size that is still inside this one and is the closest to the one passed
	 * to the method.
	 * 
	 * @param pt_or_rect { IGPoint		The point is anywhere and is mapped to a point in this rect in this CS
	 * 						IGRect}		The rect with anchor
	 * @param anchor	 {IGPoint}		Required only if pt_or_rect is rect, anchor is in pt_or_rect's CS.
	 * 
	 * @returns {IGPoint}	In this coordinates 
	 * 						a) no anchor, pt_or_rect is point -> point corrected to be inside this (in VP coordinates) (anchor is ignored)
	 * 						b) no anchor, pt_or_rect is rect -> same as innerSpaceFor(rect)
	 * 						c) anchor, pt_or_rect is rect. IGPoint inside this in VP CS.
	 * 
	 * 
	 */
	GRect.prototype.mapToInsides = function(pt_or_rect) {
		var result = null;
		if (BaseObject.is(pt_or_rect,"IGRect") || BaseObject.is(pt_or_rect,"Rect")) {
			var	innerspace = this.innerSpaceForAnchoredRectangle(pt_or_rect,new GPoint(0,0));
			if (innerspace != null && innerspace.isRegular()) {
				return innerspace;
			}
		} else if (BaseObject.is(pt_or_rect,"IGPoint") || BaseObject.is(pt_or_rect,"Point")) {
			var p = pt_or_rect;
			var result = new GPoint(p);
			if (result.x < this.x) result.x = this.x;
			if (result.x >= this.x + this.w) result.x = this.x + this.w;
			if (result.y < this.y) result.y = this.y;
			if (result.y >= this.y + this.h) result.y = this.y + this.h;
		}
		return result;
	}

	/**
	 * Subtracts a point from the rectangle which includes also another rectangle. Regardless
	 * only the x,y is affected and subtracted the same way the point is. I.e. this moves the
	 * rectangle.
	 */
	GRect.prototype.subtract = function (p) {
		if (BaseObject.is(p, "IGPoint") || BaseObject.is(p, "Point")) {
			return new GRect(this.x - p.x, this.y - p.y, this.w, this.h);
		}
		return new GRect(this.x, this.y, this.w, this.h);
	};
	/**
	 * Adds a point to the rectangle which includes also another rectangle. Regardless
	 * only the x,y is affected and summed the same way the point is. I.e. this moves the
	 * rectangle
	 */
	GRect.prototype.add = function (p) {
		if (BaseObject.is(p, "IGPoint") || BaseObject.is(p, "Point")) {
			return new GRect(this.x + p.x, this.y + p.y, this.w, this.h);
		}
		return new GRect(this.x, this.y, this.w, this.h);
	};

	//#endregion

	//#region Calculative static

	GRect.maxRect = function (arr) {
		if (BaseObject.is(arr, "Array")) {
			var mi = -1, ma = 0;
			for (var i = 0; i < arr.length; i++) {
				if (BaseObject.is(arr[i], "IGRect")) {
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
		}
	};

	GRect.prototype.intersectWith = function (rect) {
		if (BaseObject.is(rect, "IGRect") || BaseObject.is(rect, "Rect")) {
			var fIntersect = (rect.x < (this.x + this.w) &&
								(rect.x + rect.w) > this.x &&
								rect.y < (this.y + this.h) &&
								(rect.y + rect.h) > this.y);
			if (fIntersect) {
				var x = Math.max(this.x, rect.x);
				var y = Math.max(this.y, rect.y);
				var w = Math.min(this.x + this.w, rect.x + rect.w) - x;
				var h = Math.min(this.y + this.h, rect.y + rect.h) - y;
				return new GRect(x,y,w,h);
			} else {
				return new GRect(0, 0, 0, 0);
			}
		}
	};

	GRect.prototype.uniteWith = function (rect) {
		if (BaseObject.is(rect, "IGRect") || BaseObject.is(rect, "Rect")) {
			var x = Math.min(this.x, rect.x);
			var y = Math.min(this.y, rect.y);
			var w = Math.max(this.x + this.w, rect.x + rect.w) - x;
			var h = Math.max(this.y + this.h, rect.y + rect.h) - y;
			return new GRect(x,y,w,h);
		}
	};



	//#endregion

	//#region Applicators

	/**
	 * Applies the rectangle to a DOM element as-is, which is effectively
	 *  its offset coordinates. The effect will depend on the element's display, but this
	 * is a concern for the caller.
	 */
	GRect.prototype.toDOMElement = function (_el) {
		var el = DOMUtil.toDOMElement(_el);
		if (el instanceof HTMLElement) {
			el.style.left = this.x + "px";
			el.style.top = this.y + "px";
			el.style.width = this.w + "px";
			el.style.height = this.h + "px";
		}
	};
	/**
	 * Applies the rectangle to a DOM element as offset coordinates so that the element
	 * will appear in this rectangle as browser's viewport coordinates. In other words
	 * positions (absolute or relative element) in the browser's view port without changing the
	 * parenting or its positioning.
	 */
	GRect.prototype.toDOMElementAsViewport = function(_el) {
		var el = DOMUtil.toDOMElement(_el);
		if (el instanceof HTMLElement) {
			var offp = el.offsetParent;
			if (offp != null) {
				var rect = this.mapFromToElements(null, offp);
				el.style.left = rect.x + "px";
				el.style.top = rect.y + "px";
				el.style.width = rect.w + "px";
				el.style.height = rect.h + "px";
			} else { // Assume the element is fixed
				el.style.left = this.x + "px";
				el.style.top = this.y + "px";
				el.style.width = this.w + "px";
				el.style.height = this.h + "px";
			}
		}
	}

	//#endregion

})();