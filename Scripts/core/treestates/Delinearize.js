// TSEU - Tree State Element Unit READ
/**
	Checks the type of a value coming from linear
	
	returns {error|value}
*/
/*
TreeStatesConvert.TSEUValFromLinear = function(tseu, v) {
	var types = tseu[1];
	var arrTypes = TreeStatesConvert.TSEUTypesValid(types);
	if (this.isError(arrTypes)) return arrTypes;
	
	var vtype = TreeStatesConvert.ValueType(v);
	if (arrTypes.findElement(vtype) < 0) {
		return this.Error("A value of type not specified in the TSEU");
	}
	return v;
}
*/
/**
	Delinearizes a TSM (not TSMS)
	@param tsm 	{TSM} A TSM to drive the delinearization
	@param _linears [Array<Array>] Array of arrays of values
*/
/*
TreeStatesConvert.DeLinearizeTSM = function(tsm,_linear,objset)  {
	if (!BaseObject.is(tsm, "Array") || tsm.length == 0) {
		if (_linear == null) return null;
		if (_linear.length == 0) return objset; // end of recursion
	}
	var tse = tsm[0];
}
*/

/**
	Sets the corresponding value to an object
	Returns true if successful
*/
/* Essentially the same as DeLinearizeTSU
TreeStatesConvert.TSEUValToObject = function(tseu, v, obj) { // Extracts TSEU specific value from the object
	var name = tseu[0];
	var types = tseu[1];
	// Validate TSEU
	var arrTypes = TreeStatesConvert.TSEUTypesValid(types);
	if (this.isError(arrTypes)) return false;
	// Check the type - not needed, already done
	// Test conditions
	if (!TreeStatesConvert.TSEUTestConditions(tseu, v)) return false;
	// Set it
	obj[name] = v;
	return true;
}
*/
