/*var ProcessingChainOperation = {
	ABORT: 1,
    COMPLETE: 1,
    NEXT: 2
};*/

/*Default processing context*/
function ProcessingChainContext(chain, context, datas) {
    BaseObject.apply(this, arguments);
	
	//set the default metadata values
	this.$context= context || "generic";
	this.$status= ProcessingChainContextStatusEnum.IDLE;
	
	//set references	
	if(!BaseObject.is(chain, "IProcessingChain"))
		throw "The processing chain context cannot be initialized without a proper chain (IProcessingChain instance).";
	
	this.$chain= chain;
	
	this.$current= 0;
	this.$datas= (Array.isArray(datas))? datas: [];
};

ProcessingChainContext.Inherit(BaseObject, "ProcessingChainContext");
ProcessingChainContext.Implement(IProcessingChainContext);

//becomes a reporter
ProcessingChainContext.Implement(IEventReporterImpl);

ProcessingChainContext.prototype.addDescribedData= function(data, aspect) {
	var describedData= data;
	if(!BaseObject.is(data, IDescribedDataHolder)){
		describedData= new DescribedDataHolder(data, new DataAspect(aspect));		
	}
	//this.datas.push(describedData);
	this.$datas.addElement(describedData);
};

ProcessingChainContext.prototype.getAllDescribedEntriesByAspect= function(aspect) {
	return this.$datas.Select(function(i,el){
		 if (BaseObject.equals(el, new DescribedDataHolder(null, aspect))) return el;
	});
};

ProcessingChainContext.prototype.deleteAllDescribedEntriesByAspect= function(aspect) {
	return this.$datas.Delete(function(i,el){
		 if (BaseObject.equals(el, new DescribedDataHolder(null, aspect))) return el;
	});
};

//maybe have find and delete by reference in the FUTURE

/*ProcessingChainContext.prototype.getFirstDescribedDataEntry= function(aspect){
	return this.$datas.getElement(new DescribedDataHolder(null, aspect));
};

ProcessingChainContext.prototype.findDescribedData= function(aspect){
	return this.$datas.findElement(new DescribedDataHolder(null, aspect));
};*/