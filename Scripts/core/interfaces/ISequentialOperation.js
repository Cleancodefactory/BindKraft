/*
	Sequential operations are supposed to present ref to the next operation when they are completed.
	If next operation is missing, the chain/sequence is presumed complete.
*/

function ISequentialOperation() {}
ISequentialOperation.Interface("ISequentialOperation");

ISequentialOperation.prototype.CompleteOperation = function(/*bool*/ success, errorinfo_or_data, nextoperation) {
	throw "Not implemented";
}.Description("Implemented by operations that represent sequential events/results/outcomes/messages");
ISequentialOperation.prototype.get_nextoperation = function () {
	throw "Not implemented";
}.Description("Should return the reference to the next operation provided in the call of the CompleteOperation method");
