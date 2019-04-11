/*
	WindowCalculator
	
	A class helping you to calculate various stuff assuming certain things.
	
	Functional pattern:
		Created for a specific window in order to minimize arguments later and to a lesser extent to enable keeping 
		intermediate calculations.
		
	
*/

function WindowCalculator(wnd) {
	BaseObject.apply(this,arguments);
	this.$window = wnd;
}
WindowCalculator.Inherit(BaseObject,"WindowCalculator");
WindowCalculator.prototype.clientCenterPoint = function(param) {
	var rect = this.$window.get_clientrect(param);
	if (rect != null) {
		var pt = new Point();
		return rect.center(pt);
		
	}
	return null;
}
WindowCalculator.prototype.clientDockSlot = function(/*%,pixels,*/size,side) {
	var rect = this.$window.get_clientrect(param);
	
	if (rect != null) {
		switch (side) {
			case "top":
			break;
			case "rigth":
			break;
			case "bottom":
			break;
			case "left":
			default:
		}
	}
}