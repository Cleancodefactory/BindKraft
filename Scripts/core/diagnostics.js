/*
    File: diagnostics.js
    Diagnostic utils. Most of this functionality is part of the classes functionality, but here are the utility methods and helpers for it.
	TODO: Extend that to support subscribers etc. (not urgent)
*/

//// DIAGNOSTIC HELPERS /////////////////////////

JBUtil.referenceObjCount = function ( obj ) {
	
	var className = obj.classType();
	if ( className == null )
	{
		CompileTime.notice("Created instance with undetermined type: " + obj + " " + className + "\n" );
	}
	else
	{
		if ( typeof DIAGNOSTICS.all[className] == "undefined" )
		{
			DIAGNOSTICS.all[className] = 0;
		}
		DIAGNOSTICS.all[className]++;
	}
	DIAGNOSTICS.totalCounter++;
};
// Called by obliterators - we can see how much the obliteration does its job
// Garbage collector will still reclaim the memory, but obliteration speeds up that and helps avoid memory leaks in IE for instance.
// So, if some objects remain unobliterated it is not a fatal problem, but it shows how good are we at helping the GC.
JBUtil.referenceObjCountRem = function ( obj ) {
	
	
	var className = obj.classType();
	if ( className == null )
	{
		CompileTime.notice("Created instance with undetermined type: " + obj + " " + className + "\n" );
	}
	else
	{
		DIAGNOSTICS.all[className]--;
	}
	
	DIAGNOSTICS.totalCounter--;
};
