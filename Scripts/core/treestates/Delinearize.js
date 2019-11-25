// TSEU - Tree State Element Unit READ
/**
	Checks the type of a value coming from linear
	
	returns {error|value}
*/
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
/**
	Delinearizes a TSM (not TSMS)
	@param tsm 	{TSM} A TSM to drive the delinearization
	@param _linears [Array<Array>] Array of arrays of values
*/
TreeStatesConvert.DeLinearizeTSM = function(tsm,_linear,objset) /* objset */ {
	if (!BaseObject.is(tsm, "Array") || tsm.length == 0) {
		if (_linear == null) return null;
		if (_linear.length == 0) return objset; // end of recursion
	}
	var tse = tsm[0];
}
/**
	Executes all the TSEU from a TSE to check the values from an array (linear) and puts them on the object
	Checks the conditions and stops if any fails - returns null in that case - the object otherwise.
	
	@param tse {TSE}		TSE to process
	@param arrvals {array}	The linear. It has to have the same size as the TSE
	@param _obj {object}	Optional - created if not passed. The object to which to set values.
	
	@remarks an important point here is that the linear has to be the same size as the TSE. This is introducing aLinkcolor
		requirement to the serialization/deserialization to keep the knowledge of the number of the values linearized
		using a TSE or take into account the TSE during both processes.
*/
TreeStatesConvert.DeLinearizeTSE = function(tse,arrvals,_obj) { // Converts data from object to linear array of values
	var obj = _obj || {};
		if (arr == null || arr.length == 0) {
		// if (isrequired) return null; // fail
		return obj; // fine we are optional - empty object
	}
	if (tse.length != arr.length) return null; // fail (see remarks)
	for (var i = 0; i < tse.length;i++) {
		// Read one and check type
		var val = TreeStatesConvert.TSEUValFromLinear(tse[i], arr[i]);
		if (this.isError(val)) return null; // fail
		// Check conditions and set to the object
		if (!TreeStatesConvert.DeLinearizeTSU(tse[i], val, obj)) {
			// Some condition is not met
			return null;
		}
	}
	return obj;
}
/**
	Called during delinearization of a TSE linear to deal with individual value
	If TSEU matches the value, the value is set to the object passed and true is returned.
	In case of any error the function returns false;
	
	@param tseu {TSEU}	
	@param value {any}
	@param obj {object} - the object to which to set the value
*/
TreeStatesConvert.DeLinearizeTSU = function(tseu, value, obj) {
	var name = tseu[0];
	var types = tseu[1];
	var arrTypes = TreeStatesConvert.TSEUTypesValid(types);
	if (this.isError(arrTypes)) return false;
	if (!TreeStatesConvert.TSEUTestConditions(tseu, value)) return false;
	obj[name] = v;
	return true;
	
}
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
