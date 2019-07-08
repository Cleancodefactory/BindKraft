/**
	Works in conjunction with IManagedInterfaceContainer (MIC). Implementors declare the fact that they use MIC and allow the caller
	to obtain it. This is used on a very low level and should not be a concern for a typical application level programming.
	
	The container (MIC) is usually a separate object and needs this interface as means to obtain it.
*/
function IHasManagedInterfaceContainer() {}
IHasManagedInterfaceContainer.Interface("IHasManagedInterfaceContainer");
IHasManagedInterfaceContainer.prototype.get_managedinterfacecontainer = function() { throw "not impl"; }