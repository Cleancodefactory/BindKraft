/**
	The support of this interface declares that the class can supply LocalAPI import table.
	The table has to be declared as InterfaceData (it is queried before creating an instance of the class).
	
	Example:
	MyClass.InterfaceData(ILocalAPIImports, { IAPI1:null, IAPI2:"oldversion", IAPI3: null});
*/
function ILocalAPIImports() {}
ILocalAPIImports.Interface("ILocalAPIImports");
