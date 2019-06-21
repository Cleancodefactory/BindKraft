/**
	Marker interface. Strongly recommended for all apps targetting BK 2.8 and above
	
	If present the shell will pass an AppGate object to the launched app and not queryback interface
*/
function IRequiresAppGate() {}
IRequiresAppGate.Interface("IRequiresAppGate");
IRequiresAppGate.RequiredTypes("IAppBase");