


function ISupportsURLHashImpl() { }
ISupportsURLHashImpl.InterfaceImpl ( ISupportsURLHash );
ISupportsURLHashImpl.prototype.hashKeyOfUrl = function () {
    return null;
};
ISupportsURLHashImpl.RegisterOfClasses = [];
ISupportsURLHashImpl.classInitialize = function ( cls, routingTypeName, getParentProc ) {
	// add classes implementing this Interface
	ISupportsURLHashImpl.RegisterOfClasses.push ( cls );
};