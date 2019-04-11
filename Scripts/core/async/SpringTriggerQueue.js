


/*CLASS*/
// Trigger set
function SpringTriggerQueue(obj, pause) {
	BaseObject.apply(this, arguments);
	this.obj = obj;
	this.pause = pause;
}
SpringTriggerQueue.Inherit(BaseObject, "SpringTriggerQueue");
SpringTriggerQueue.prototype.triggers = new InitializeObject("The set of triggers");
SpringTriggerQueue.prototype.windupArray = function(funcName,argsArray) {
	if (this.triggers[funcName] == null) {
		this.triggers[funcName] = new SpringTrigger(new Delegate(this.obj, funcName), this.pause);
	}
	if (BaseObject.is(this.triggers[funcName].callback, "Delegate")) {
		this.triggers[funcName].callback.applyArguments(argsArray);
	}
	this.triggers[funcName].windup();
}
SpringTriggerQueue.prototype.windup = function(funcName,var_arg) {
	this.windupArray(funcName, Array.createCopyOf(arguments, 1));
}
