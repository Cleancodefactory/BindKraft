function Scrollable() {
	Base.apply(this, arguments);
}
Scrollable.Inherit(Base, "Scrollable");
// Scrollable.Implement(IUIControl);
Scrollable.ImplementProperty("direction", new InitializeStringParameter("Direction - H or V - only the first letter matters","H"));
Scrollable.ImplementProperty("carefor", new InitializeStringParameter("child elements to care for. Null for all of them.",null));

Scrollable.prototype.changedevent = new InitializeEvent("Firest every time the position changes");
Scrollable.ImplementProperty("scrollablecontainer", new Initialize("use plugelement to fill it in", null));


Scrollable.prototype.finalinit = function() {
	//
	this.on("mouseover", this.onMouseOver);
	this.on("mouseout", this.onMouseOut);
	if (window.addWheelListener) window.addWheelListener(this.root, Delegate.createWrapper(this, this.$onMouseWheel));
}
Scrollable.prototype.get_direction = function() {
	if (this.$direction) {
		if (this.$direction.charAt(0).toUpperCase() == "V") return "V";
	}
	return "H";
}
Scrollable.prototype.get_booldirection = function() { // H is true, V is false
	return ((this.get_direction() == "V")?false:true);
}
Scrollable.prototype.$elementsToCareFor = function() {
	var els = null;
	if (this.get_carefor() != null) {
		els = $(this.get_scrollablecontainer()).children(); // We have to filter them, but how? Needs decision.
	} else {
		els = $(this.get_scrollablecontainer()).children();
	}
	return els;
}

Scrollable.prototype.onMouseOver = function(e) {
	// TODO something?
}
Scrollable.prototype.onMouseOut = function(e) {
	// TODO something?
}
Scrollable.prototype.isRectVisible = function(rect) {
	if (this.get_booldirection()) { // Horizontal
		var curScroll = this.get_scrollablecontainer().scrollLeft;
		var width = $(this.get_scrollablecontainer()).width();
		if (rect.x - curScroll >= 0) {
			if ((rect.x + rect.w - curScroll) <= width) {
				return true;
			}
		}
		return false;
	} else { // Vertical not implemented

	}
}
Scrollable.prototype.$onMouseWheel = function(e) {
	if (e != null) {
		if (e.deltaY < 0) {
			this.moveNext();
		} else {
			this.movePrev();
		}
        e.preventDefault();
    }
}
Scrollable.prototype.movePrev = function(e, dc, bind) {
	if (this.get_booldirection()) { // Horizontal
		var curScroll = this.get_scrollablecontainer().scrollLeft;
		var itemEls = this.$elementsToCareFor();
		var arrRects = [];
		var rect;
		for (var i = 0; i < itemEls.length; i++) {
			rect = new Rect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			arrRects.push(rect);
		}
		// var b = false;
		var firstVisible = -1;
		for (i = 0; i < arrRects.length; i++) {
			if (this.isRectVisible(arrRects[i])) {
				firstVisible = i;
				break;
			}
		}
		if (i > 0) {
			rect = arrRects[i-1];
			this.get_scrollablecontainer().scrollLeft -= (this.get_scrollablecontainer().scrollLeft - rect.x);
		}
	} else { // Vertical not impl.
	
	}
	this.changedevent.invoke(this, null);
}
Scrollable.prototype.moveNext = function(e, dc, bind) {
	if (this.get_booldirection()) { // Horizontal
		var curScroll = this.get_scrollablecontainer().scrollLeft;
		var itemEls = this.$elementsToCareFor();
		var width = $(this.get_scrollablecontainer()).width();
		var arrRects = [];
		var rect;
		for (var i = 0; i < itemEls.length; i++) {
			rect = new Rect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			arrRects.push(rect);
		}
		// var b = false;
		var firstVisible = -1;
		for (i = arrRects.length - 1; i >= 0; i--) {
			if (this.isRectVisible(arrRects[i])) {
				firstVisible = i;
				break;
			}
		}
		if (i < arrRects.length - 1) {
			rect = arrRects[i + 1];
			this.get_scrollablecontainer().scrollLeft += ((rect.x + rect.w) - (this.get_scrollablecontainer().scrollLeft + width));
		}
	} else { // Vertical not impl
	}
	
	this.changedevent.invoke(this, null);
}
Scrollable.prototype.get_prevactive = function() {
	if (this.get_booldirection()) { // Horizontal
		var i;
		var itemEls = this.$elementsToCareFor();
		var rect;
		var firstVisible = -1;
		for (i = 0; i < itemEls.length; i++) {
			rect = new Rect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			if (this.isRectVisible(rect)) {
				firstVisible = i;
				break;
			}
		}
		if (firstVisible > 0) return true;
	} else { // Vertical not implemented
	}
	return false;
}.Description("Returns true if there are prev elements partialy or fully invisible");
Scrollable.prototype.get_nextactive = function() {
	if (this.get_booldirection()) { // Horizontal
		var i;
		var itemEls = this.$elementsToCareFor();
		var rect;
		var firstVisible = itemEls.length;
		for (i = itemEls.length - 1; i >= 0; i--) {
			rect = new Rect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			if (this.isRectVisible(rect)) {
				firstVisible = i;
				break;
			}
		}
		if (firstVisible < (itemEls.length - 1)) return true;
	} else { // Vertical
	}
	return false;
}.Description("Returns true if there are next elements partialy or fully invisible");
Scrollable.prototype.moveTo = function(e, dc, bind) {
	// TODO: write me ;)
	this.changedevent.invoke(this, null);
}