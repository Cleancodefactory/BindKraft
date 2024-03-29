/**
	Interface for OperationDescription.
	
	Everything is actually optional, but certain constructs using operations may require the parties using operations to fill some fields.
	The role field is the most interesting in these cases and has some standardized values:
	role: 
	"demand" - this operation has to be completed by its receiver, it is given and the code that supplied it expects itto be completed in order to continue
	"task" - same as no role - this is a typical operation which will complete then the task is done
	"condition" - this operation is intended as condition
	
	Roles can change 
*/
function IOperationDescription() {}
IOperationDescription.Interface("IOperationDescription");
IOperationDescription.prototype.get_name = function() { throw "not implemented";}
IOperationDescription.prototype.get_role = function() { throw "not implemented";}
IOperationDescription.prototype.get_resulttype = function() { throw "not implemented";}
IOperationDescription.prototype.get_description = function() { throw "not implemented";}

IOperationDescription.Dump = function(desc) { 
	if (!BaseObject.is(desc,"IOperationDescription")) return "";
	var s = "";
	var x = desc.get_name();
	if (typeof x == "string" && x.length > 0) s += "[name:" + x + "]";
	x = desc.get_role();
	if (typeof x == "string" && x.length > 0) s += "[role:" + x + "]";
	x = desc.get_resulttype();
	if (typeof x == "string" && x.length > 0) s += "[resulttype:" + x + "]";
	x = desc.get_description();
	if (typeof x == "string" && x.length > 0) s += "[description:" + x + "]";
	return s;
}