function TrivialCalculation() {
	CalculcaitonBase.apply(this, arguments);
}
TrivialCalculation.Inherit(CalculcaitonBase,"TrivialCalculation");
TrivialCalculation.prototype.execute = function(input) {
	if (typeof input == "number") {
		return input;
	} else if (BaseObject.is(input,"Rect")) {
		return new Rect(input.x,input.y,input.w,input.h);
	} else if (BaseObject.is(input, "Point")) {
		return new Point(input.x,input.y);
	} else if (BaseObject.is(input, "SizeLimits")) {
		var sl = new SizeLimits();
		sl.w = input.w;
		sl.h = input.h;
		if (input.get_hasminsize()) {
			sl.set_minsize(this.execute(input.get_minsize()));
		}
		if (input.get_hasmaxsize()) {
			sl.set_maxsize(this.execute(input.get_maxsize()));
		}
		return sl;		
	} else if (BaseObject.is(input, "Size")) {
		return new Size(input.w,input.h);
	}
	return input;
}