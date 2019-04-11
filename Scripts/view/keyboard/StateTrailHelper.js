

// This should be moved to core!




/*
	A stack tailored for short state memory/signalling.
	The internal stack is configured for a given capacity (default 1) and
	then different values can be pushed onto it and then queried, but only to the specified capacity.
	When depleted the stack returns a configured default value.
	The stack also supports a set method that pushes a value (if there is free space) or replaces
	the top one (if the stack is full).
	
	The usage of this class is usually needed with depth 1 and helps asynchronously occurring,
	but related event handlers to synchronize certain aspects of their work.
*/
/*CLASS*/
function StateTrailHelper(def, depth) {
	BaseObject.apply(this, arguments);
	if (arguments.length > 0) this.set_default(def);
	this.set_capacity(depth);
}
StateTrailHelper.Inherit(BaseObject, "StateTrailHelper");
StateTrailHelper.ImplementProperty("default", new InitializeParameter("Default value", null));
StateTrailHelper.prototype.$capacity = 1;
StateTrailHelper.prototype.get_capacity = function() { return this.$capacity; }
StateTrailHelper.prototype.set_capacity = function(v) {
	this.$capacity = (v > 0)?v:0;
	if (this.$capacity > 0 && this.$stack.length > this.$capacity) {
		this.$stack = this.$stack.slice(this.$stack.length - this.$capacity);
	} else {
		this.$stack = [];
	}
}
StateTrailHelper.prototype.$stack = new InitializeArray("States");
StateTrailHelper.prototype.push = function(v) {
	if (this.$stack.length < this.$capacity) this.$stack.push(v);
}
StateTrailHelper.prototype.pull = function(v) {
	if (this.$stack.length > 0) return this.$stack.pop();
	return this.get_default();
}
StateTrailHelper.prototype.set = function(v) {
	if (this.$stack.length < this.$capacity) this.$stack.push(v);
	if (this.$capacity > 0) this.$stack[this.$stack - 1] = v;
}
StateTrailHelper.prototype.clear = function() {
	this.$stack = [];
}
StateTrailHelper.prototype.poll = function() {
	if (this.$stack.length > 0) return this.$stack[this.$stack.length - 1];
	return this.get_default();
}
