
function DragGesture(distance, timeallotted) {
	PointerGesture.apply(this,arguments);
	this.timeallotted = timeallotted || 300; //Default is 300 ms;
	this.distance = distance || 3;
}
DragGesture.Inherit(PointerGesture,"DragGesture");
// Data
DragGesture.prototype.distance = null;
DragGesture.prototype.timeallotted = null;
DragGesture.prototype.initialPos = null;
DragGesture.prototype.watch = new InitializeObject("Stop watch", "SimpleStopWatch");
DragGesture.prototype.clear = function() {
	this.initialPos = null;
	this.watch.stopInterval();
}
DragGesture.prototype.start = function() {
	this.watch.startInterval(this.timeallotted)
};
DragGesture.prototype.inspectMessage = function(msg) {
	if (!this.watch.intervalExpired()) {
		var pos = msg.get_clientpos();
		if (pos == null) return false;
		if (this.initialPos == null) {
            this.initialPos = pos;
            return null;
        }
		if (this.initialPos.distance(pos) >= this.distance) return true;
		return null;
	} else {
		return false; // Signal that we do not want to be asked anymore.
	}
};