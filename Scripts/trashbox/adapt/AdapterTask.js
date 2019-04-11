function AdapterTask(requestor,data) {
	this.$requestor = requestor;
	this.set_data(data);
}
AdapterTask.inherit(BaseObject, "AdapterTask");
AdapterTask.implement(IDataHolder);
AdapterTask.implementProperty("data", new Initialize("Data context/data about the task",null),null,"OnDataContextChanged");

AdapterTask.prototype.$requestor = null;
AdapterTask.prototype.get_requestor = function() { return this.$requestor; };

AdapterTask.prototype.$answer = function() {
	var r = this.get_requestor();
	if (BaseObject.isCallback(r)) {
	} else if (BaseObject.is(r,"IAdapterTaskRequestor")) {
		/////////
	}
}
AdapterTask.prototype.complete = function() {
}