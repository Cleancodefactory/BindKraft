//Maybe do interface?
function DefaultProcessingChainExecutor(chain){
	//validate inputs
	if(!BaseObject.is(chain, "IProcessingChain"))
		throw "The Processing chain executor can only work with ProcessingChain instances.";
	this.$chain= chain;
};

DefaultProcessingChainExecutor.DeclarationBlock({
	//chain reference
    chain: "r object * A reference to the chain, which will be executed."
});

DefaultProcessingChainExecutor.prototype.stepFunc= function(lastop, proccont){
		
	//Maybe do a BaseObject.Is check here instead!
	if(lastop!=null)//lastop is null only on the first go 		
	{
		//if last operation has failed, report error
		if(lastop.isOperationSuccessful()== false)	throw op.$operationErrorInfo;		
		
		proccont.$current++;
	}
	
	//set default state
	proccont.$status= ProcessingChainContextStatusEnum.IDLE;
	
	//break the chains
	if(proccont.get_current()>= chain.$wares.length)
	{
		proccont.$status= ProcessingChainContextStatusEnum.COMPLETE;
		//the chain has been excuted, maybe report on success
		return;
	}
	
	//get current ware reference
	var currWareConstruct= chain.$wares[proccont.get_current()];	
	var currWare= null;
	
	//create current chain ware instance
	if(BaseObject.is(currWareConstruct, "string"))
	{
		currWare= Function.createInstance(currWareConstruct);
	}
	else if (BaseObject.is(currWareConstruct, "function"))
	{
		currWare= new currWareConstruct();
	}
	
	if(currWare==null) throw "Could not construct an instance for one of the nodes: "+currWareConstruct+" in the chain: "+this.$chain.$name+"!";
	
	//execute current operation
	proccont.$status= ProcessingChainContextStatusEnum.BUSY;
	var op= currWare.$operation;
	currWare.execute("", proccont);
	op.then(new Delegate(this, this.stepFunc, [op, proccont]));	
};

DefaultProcessingChainExecutor.prototype.execute= function(initialData){
	//create processing context for the execution
	var proccont= new ProcessingChainContext(this.$chain, "", initialData);
	
	//add more stuff to the processing context datas at the beginning		
	
	//start stepping
	try
	{
		this.stepFunc(null, proccont);
	}
	catch(error)
	{
		//maybe retrow here as well
		proccont.$status= ProcessingChainContextStatusEnum.FAILED;
		proccont.report(error, ReportingEventTypeEnum.CRITERR);
	}
};