function ResultsStack() {
	BaseObject.apply(this, arguments);
}
ResultsStack.Inherit(BaseObject, "ResultsStack");
ResultsStack.prototype.$stack = new InitializeArray("The results returned here");
ResultsStack.prototype.depth = function() {
	return this.$stack.length;
}
ResultsStack.prototype.top = function() {
	if (this.$stack.length > 0) {
		return this.$stack[this.$stack - 1];
	}
	return undefined;
}
ResultsStack.prototype.push = function(v) {
	this.$stack.push(v);
}
ResultsStack.prototype.pull = function() {
	var r = this.$stack.pop();
	if (r != undefined) return r;
	return undefined; // for better consistency
}
ResultsStack.prototype.clear = function() {
	this.$stack.splice(0);
}