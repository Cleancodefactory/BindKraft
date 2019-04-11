function IProcessingChainWare() { }
IProcessingChainWare.Interface("IProcessingChainWare");

IProcessingChainWare.DeclarationBlock({
	operation: "r object * A reference to the operation create for the current instance of the chainware",
    execute: function (work, context, success, failure) {throw "An IProcessingChainWare instance has no execute() implementation.";}
});