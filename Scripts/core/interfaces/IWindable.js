


/*INTERFACE*/
// Must be used only for calling own methods on this.
function IWindable() {}
IWindable.Interface("IWindable");
IWindable.prototype.$windupCall = function(funcName, var_args) {
	if (!BaseObject.is(this.$springTriggerQueue, "SpringTriggerQueue")) {
		this.$springTriggerQueue = new SpringTriggerQueue(this,500);
	}
	this.$springTriggerQueue.windupArray(funcName, Array.createCopyOf(arguments, 1));
}