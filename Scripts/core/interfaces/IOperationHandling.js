/*
	
	See before: IOperation
*/

/*INTERFACE*/
function IOperationHandling() {}
IOperationHandling.Interface("IOperationHandling");
// IOperationHandling.RequiredTypes("IOperation");
IOperationHandling.prototype.onCompleteOperation = function () { 
	// var cr = this.get_completionroutine();
	// if (cr != null) {
	// return BaseObject.callCallback(cr,this);
	// }
	// return undefined
}.Description("The default implementation calls the completion routine passing the operation obejct to it.");


