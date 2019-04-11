


/*INTERFACE*/
function IStructuralQueryEmiter() { }
IStructuralQueryEmiter.Interface("IStructuralQueryEmiter");
IStructuralQueryEmiter.prototype.throwStructuralQuery = function (query, processInstructions) { throw "Not implemented"; } .Description("Throws a hot query starting with self");
IStructuralQueryEmiter.prototype.throwDownStructuralQuery = function (query, processInstructions) { throw "Not implemented"; } .Description("Throws a hot query starting its first structural parent.");
