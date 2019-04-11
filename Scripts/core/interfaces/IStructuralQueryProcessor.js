


/*INTERFACE*/
// Query processor Interface
function IStructuralQueryProcessor() { };
IStructuralQueryProcessor.Interface("IStructuralQueryProcessor");
IStructuralQueryProcessor.prototype.processStructuralQuery = function (query, processInstructions) {
    return false;
    // Override this in the implementing class
};
// Usage: myclass.Implement(IStructuralQueryProcessor);