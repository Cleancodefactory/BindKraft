/*
    The interface must be implemented only by the class(es) used by the chain processing chains to drive its execution.
    The classes imlementing this interface serve as storage for the chain elements where they can find, pick, put the pieces 
    of their work and sometimes even processing scoped state.
    
    The task specific data is split into two places:
    - an array (get_data) of objects (preferably IDescribedDataHolder).
    - a context object - an instance of a class packing the specific task (e.g. ajax request, requested async calculation etc.).
    
    The chain elements may cut/copy pieces of data from the context object and put them into the data array to expose them to
    potential processors. Then others can pick already processed pieces and attach them back. This approach enables coexistence
    of specialized and multipurpose elements in a chain where the specialized ones can decide what to expose for processing by 
    others, when to do so and also pick it when it is done.
    
    The described data interfaces enable purpose/strcuture oriented marking of data which can be used as a key for processing operations 
    reusability.
    
*/

function IProcessingChainContext() { }
IProcessingChainContext.Interface("IProcessingChainContext");
IProcessingChainContext.DeclarationBlock({
	
	//usefull methods
    complete: function () {},
    next: function () {},
    abort: function () {}, 
    
	//usefull references
	chain: "r any * The IProcessingChain to which this chain context belongs.",
    current: "r numeric * Index of the current chain element will point to the currently executing one",
    datas: "r any * The objects for processing. What happens with them depends fully on the elements in the chain - replace, change state etc.",
    
	//metainfo
	context: "r any * The object that represents the specific kind of task - ajaxrequest, complex calculation etc.",
	status: "r numeric * Current status - see ProcessingChainContextStatusFlags"
});

//changed the datas from array to any