/*
    The default processing chain.
*/
function ProcessingChain(name){//context) {
    BaseObject.apply(this, arguments);
	this.$name= name+"";
    /*if (BaseObject.is(context, "IProcessingChainContext")) {
        this.$context = context;
    } else {
        this.$context = {};
    }*/
};

ProcessingChain.Inherit(BaseObject, "ProcessingChain");
ProcessingChain.Implement(IProcessingChain);

//ProcessingChain.prototype.step = function (ar) {};//default step method implementation