//System wide error reporter chainware
function EventLogReporterChainWare(){};
EventLogReporterChainWare.Implement(IProcessingChainWare);

EventLogReporterChainWare.prototype.execute= function(work, context, success, failure){
	
	//if no context => complete	
	//UNECES: if(!BaseObject.is(context, "IProcessingChainContext")) //complete operation
	
	//if the context contains a described data of the type
	//dive in the event log context, extract usefull data about the state and ???
};

//Terminates all chain executions, which have encountered a critical issue! Must be specially summoned with "Legend of hearth".
function ExecutionTerminatorChainware(){};
ExecutionTerminatorChainware.Implement(IProcessingChainWare);

ExecutionTerminatorChainware.prototype.execute= function(work, context, success, failure){
	//if there is no array/criticalerrors data defined in the context => go to next chainware
	//see if there are any entries in the array/criticalerrors data in the processsing context
};