//Default XHR request-response chainware
function ProcessingChainWareBase(){
	this.$operation= new Operation();	
};

ProcessingChainWareBase.Implement(IProcessingChainWare);