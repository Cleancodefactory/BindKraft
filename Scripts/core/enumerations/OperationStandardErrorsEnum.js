/*

*/

/*ENUM*/
var OperationStandardErrorsEnum = {
	unspecified: 	{ code:-1,description: "unspecified error"},
	
	singleinstance: { code:-100,description: "New operation cannot be started because another is in progress."},
	busy: 			{ code:-101,description: "The required facilities are busy."},
	
	state: 			{ code:-200,description: "The current state does not permit the operation to be performed."},
	
	notfound: 		{ code:-300,description: "A required resource cannot be found."},
	invalidproc:	{ code:-301,description: "Invalid function/operation requested."},
	swamped: 		{ code:-302,description: "There are not enough free resources to perform the operation."},
	denied: 		{ code:-303,description: "Operation is not permitted."},
	invaliddata:	{ code:-304,description: "Invalid data found."},
	parameters: 	{ code:-305,description: "Invalid parameter(s)/arguments(s)."},
	locked: 		{ code:-306,description: "Required resource locked by another party."},
	notsupported:	{ code:-307,description: "Not supported."},
	duplication:	{ code:-308,description: "Duplication of a resource, name, index, execution of run-once action."},
	incorrectkey:	{ code:-309,description: "Incorrect key or name."},
	exists:			{ code:-310,description: "The resource/item already exists"},
	notimpl:		{ code:-311,description: "Not implemented"},
	timeout:		{ code:-312,description: "Timeout"},
	buffer:			{ code:-313,description: "Insufficient buffer"},
	toobig:			{ code:-314,description: "Data is too big"},
	
	exists_wrongtype: 	{ code: -315, description: "Element found, but is of an unexpected type" },
	initfailed:			{ code: -316, description: "Initialization failed" }
};