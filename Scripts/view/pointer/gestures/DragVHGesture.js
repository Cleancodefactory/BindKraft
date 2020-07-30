(function() {
    var PointerGesture = Class("PointerGesture");

/**
 * 
 * 
 * @param direction     {string}    Possible values h, v, nesw, nwse
 * 
 */
function DragVHGesture(direction, timeallotted, distance) {
    PointerGesture.apply(this,arguments);
    this.timeallotted = timeallotted || 300; //Default is 300 ms;
    this.distance = distance || 3;
    this.direction = direction || "H";
}
DragVHGesture.Inherit(PointerGesture,"DragVHGesture");

// Data
DragVHGesture.prototype.direction = null;

DragVHGesture.prototype.distance = null;
DragVHGesture.prototype.timeallotted = null;
DragVHGesture.prototype.initialPos = null;
DragVHGesture.prototype.watch = new InitializeObject("Stop watch", "SimpleStopWatch");
DragVHGesture.prototype.clear = function() {
	this.initialPos = null;
	this.watch.stopInterval();
}
DragVHGesture.prototype.start = function() {
	this.watch.startInterval(this.timeallotted)
};
DragVHGesture.prototype.inspectMessage = function(msg) {
	if (!this.watch.intervalExpired()) {
		var pos = msg.get_clientpos();
		if (pos == null) return false;
		if (this.initialPos == null) {
            this.initialPos = pos;
            return null;
        }
        var x = pos.x - this.initialPos.x;
        var y = pos.y - this.initialPos.y;
        if (this.direction == "nwse" || this.direction == "nw" || this.direction == "se") {
            if ((x*x + y*y) >= this.distance ** 2 &&
                (Math.sign(x) == Math.sign(y)) &&
                (Math.abs(Math.abs(x) - Math.abs(y)) < this.distance / 2)) {
                return true;
            }
        } else if (this.direction == "nesw" || this.direction == "ne" || this.direction == "sw") {
            if ((x*x + y*y) >= this.distance ** 2 &&
                (Math.sign(x) != Math.sign(y)) &&
                (Math.abs(Math.abs(x) - Math.abs(y)) < this.distance / 2)) {
                return true;
            }
        } else if (this.direction == "h") {
            if (Math.abs(x) >= this.distance && Math.abs(y) < this.distance / 2) {
                return true;
            }
        } else if (this.direction == "v") {
            if (Math.abs(y) >= this.distance && Math.abs(x) < this.distance / 2) {
                return true;
            }
        }
		return null;
	} else {
		return false; // Signal that we do not want to be asked anymore.
	}
};

})();