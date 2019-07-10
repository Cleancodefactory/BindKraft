/*

	A tree state is a chain of states that matches certain connected tree elements - usually starting from the root of the tree
	
	A TREE STATE ELEMENT (TSE)
	~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	TSE := [ TSEU1, TSEU2, ... TSEUN]
	
	' TSE describes a single state node
	
	' TSEU - TSE Unit
	TSEU :=
		[ 
			name, 			// the name of the element
			types, 			// the types the element can have
			conditions		// conditions for the types
		]
		
	' TSEU describe a single value in a TSE, its correspondency to a property in state node object, possible types and conditions (if any)
		
	' TST - Tree State Map
	TSM := [*[[TSE] [*TSM])]]
	
	' example:
	[
		// Level 0 is special, like [*TSM]
		[[TSE11],[
				[[TSE21,TSE22],[[TSE31],[]]],
				[[TSE23],[]]
			]
		]
	
	]
[name,types,const]
	types = num|string|bool|null
	
State element

[ ["name1","int|number|missing"],["name2","bool|number|missing"] ]

*/



function TreeStatesConvert(map) {
	BaseObject.apply(this, arguments);
	this.$map = map;
}
TreeStatesConvert.Inherit(BaseObject,"TreeStatesConvert");
TreeStatesConvert.prototype.$map = null;
TreeStatesConvert.prototype.linearize = function(/*array of state objects*/ states) {
}.Description("Converts the array of state objects to array of linearized state values")
	.Param("states","Array of state objects matching the map")
	.Returns("If successful an array of linearized state values, each of them is an array in turn. The result can be empty, on error null is returned and last error set.");
TreeStatesConvert.prototype.linearize = function(arrStates) {
	var r = TreeStatesConvert.LinearizeTSM(this.$map, arrStates);
	if (TreeStatesConvert.isError(r)) {
		this.LASTERROR(_Errors.compose(),r.text);
		return null;
	}
	return r;
}	
TreeStatesConvert.ErrorValue = {
	error: "TreeStatesConvert error"
}
TreeStatesConvert.Error = function(text,bnofatal) {
	BaseObject.lastError.report(-1,text,"TreeStatesConvert");
	return {
		text: text,
		value: TreeStatesConvert.ErrorValue,
		nonfatal: bnofatal
	};
}
TreeStatesConvert.isError = function(v) {
	if (v != null && v.value === TreeStatesConvert.ErrorValue) {
		return true;
	}
	return false;
}
TreeStatesConvert.isNonFatalError = function(v) {
	if (v != null && v.value === TreeStatesConvert.ErrorValue && v.nonfatal) {
		return true;
	}
	return false;
}
// Validators
/**
	Checks if the comma separated list of types is valid
*/
TreeStatesConvert.TSEUTypesValid = function(types) {
	if (typeof types != "string") {
		return this.Error("no types are set for this TSEU");
	}
	var arrTypes = types.split(",");
	if (!BaseObject.is(arrTypes,"Array") || arrTypes.length == 0) {
		return this.Error("no types are set for this TSEU");
	}
	if (!arrTypes.All(function(idx,itm) { return TreeStatesConvert.$reType.test(itm); })) {
		return this.Error("Unsupported type specified in TSEU: " + arrTypes.join(","));
	}
	return arrTypes;
}


// TSEU - Tree State Element Unit WRITE
/**
	Gets the corresponding value from an object
	has to be called with a non-null TSEU
*/
TreeStatesConvert.TSEUValFromObject = function(tseu, obj) { // Extracts TSEU specifie value from the object
	var name = tseu[0];
	var types = tseu[1];
	var arrTypes = TreeStatesConvert.TSEUTypesValid(types);
	if (this.isError(arrTypes)) return arrTypes;
	
	var v = obj[name];
	var vtype = TreeStatesConvert.ValueType(v);
	if (arrTypes.findElement(vtype) < 0) {
		return this.Error("Property " + name + " contains value of type not specified in the TSEU", true);
	}
	return v;
}
/**
	Checks the conditions in the TSEU over the value
*/
TreeStatesConvert.TSEUTestConditions = function(tseu, v) { // tests the conditions from the TSEU over the value vLinkcolor
	var conditions = tseu[2];
	if (BaseObject.is(conditions,"Array")) {
		for (var i = 0; i < conditions.length;i++) {
			if (conditions[i].invoke(v) === false) return false;
		}
	}
	return true;
}
/**
	Executes all the TSEU from a TSE to strip the values from an object and put them in an array
	Checks the conditions and stops if any fails - returns null in that case or the linear otherwise
	match - []
	not match - null
	error - error
*/
TreeStatesConvert.LinearizeTSE = function(tse,obj) { // Converts data from object to linear array of values
	var result = [];
	for (var i = 0;i < tse.length; i++) {
		var tseu = tse[i];
		var val = this.TSEUValFromObject(tseu, obj);
		if (this.isError(val)) {
			if (this.isNonFatalError(val)) {
				// non match and not an error realy
				return null;
			}
			return val; // return the error
		}
		if (!this.TSEUTestConditions(tseu, val)) return null;
		result.push(val);
	}
	return result;
}
/*
	Linearizes a set ot object states according to matching TSM from a map set (TSMs)
	A TSMS is essentially an array of TSM - the first matching is used
	
	recursive outcomes
	match - []
	no-match - null
	error - error
*/
TreeStatesConvert.LinearizeTSM = function(tsm, objset, _linear) {
	var linear = _linear || []; // Aggregates the result
	var i, r;
	var tses, tse;
	if (!BaseObject.is(objset,"Array")) {
		return this.Error("You can linearize only object sets - arrays of objects");
	}
	if (objset.length == 0) {
		// Nothing more to linearize
		// TODO: This can be a problem - we will see if it is usage problem or design one
		return linear; // end recursion
	}
	var initial = false;
	if (_linear == null) initial = true;
	if (!initial) {
		var obj = objset[0];
		if (obj == null || typeof obj !== "object") {
			return this.Error("Unexpected null or non-object in the object set");
		}
	}	
	// TSM is Array: (1*TSE)[,TSM]
	if (BaseObject.is(tsm, "Array")) {
		if (tsm.length == 0) {
			// Emtpty tsm is also a terminator (for those who like this syntax) - end recursion
			// But the objset has to be exhausted
			if (object.length > 0) {
				return null;
			}
			return linear;
		}
		if (initial) {
			// tsm is tsms
			for (i = 0; i < tsm.length; i++) {
				/* Is each maptree a valid TSM?
					This is initial level and non-TSM elements can be easilly skpet, however, this probably should be an error
				*/
				if (!BaseObject.is(tsm[i], "Array")) continue; // TODO: Skip wrongs seems not right, may be this is an error?
				r = this.LinearizeTSM(tsm[i], objset, linear); // each map tree, the whole objset as initialy passed, and linear
				// TODO: How the outcomes are signified?
				if (this.isError(r)) return r; // The error is returned to the outer caller
				// Not an error
				if (BaseObject.is(r,"Array")) {
					// match, all done
					return r;
				}
				// continue
			}
			// No match
			return null;
		} else {
			// tsm is tsm
			// Get the first element - it is a set of possible TSE - TSES
			var tses = tsm[0];
			if (!BaseObject.is(tses, "Array")) return this.Error("TSM error - key TSE at map/submap is not an array");
			// Check all TSE until one matches
			// not initial - obj is single objstate element
			for (i = 0; i < tses.length; i++) {
				tse = tses[i];
				if (BaseObject.is(tse, "Array")) {
					// Looks like a TSE
					r = this.LinearizeTSE(tse, obj);
					// Check what happened
					if (this.isError(r)) return r; // Will be handled on initial level
					if (r == null) continue;
					// match
					linear.push(r);
					if (tsm.length > 1) {
						// Submap exists
						if (tsm[1] == null) return linear; // end recursion
						if (BaseObject.is(tsm[1], "Array")) {
							if (tsm[1].length == 0) return linear; // end recursion
							r = this.LinearizeTSM(tsm[1], objset.slice(1),linear);
							// Result
							if (this.isError(r)) return r;
							if (r == null) return null; // wrong direction - non-matche further in this map
							return linear; // Returning from recursion
						}
					} else {
						// Here all objects should be encoded (the just encoded one is still here - we scrap it in recursive call)
						if (objset.length > 1) {
							// They are not - this is not the right direction
							return null;
						}
						return linear; // Ok end recursion
					}
				} else {
					// not a TSE - error
					return this.Error("non-TSE found in a submap key. TSES: " + tses.join("'")); // TODO: Improve the error text
				}
			}
		}
	} else {
		if (tsm == null) {
			// End recursion
			return linear;
		} else {
			// Error
			return this.Error("TSM must be array");
		}
	}
	
}
// TSEU - Tree State Element Unit READ
/**
	Checks the type of a value coming from linear
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
	Sets the corresponding value to an object
	Returns true if successful
*/
TreeStatesConvert.TSEUValToObject = function(tseu, v, obj) { // Extracts TSEU specifie value from the object
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

/**
	Executes all the TSEU from a TSE to check the values from an array and puts them on the object
	Checks the conditions and stops if any fails - returns null in that case - the object otherwise
	
*/
TreeStatesConvert.DeLinearizeTSE = function(tse,arr,_obj) { // Converts data from object to linear array of values
	var obj = _obj || {};
		if (arr == null || arr.length == 0) {
		if (isrequired) return null; // fail
		return obj; // fine we are optional - empty object
	}
	if (tse.length != arr.length + 1) return null; // fail
	for (var i = 0; i < tse.length;i++) {
		// Read one and check type
		var val = TreeStatesConvert.TSEUValFromLinear(tse[i], arr[i-1]);
		if (this.isError(val)) return null; // fail
		// Check conditions and set to the object
		if (!TreeStatesConvert.TSEUValToObject(tse[i], val, obj)) {
			// Some condition is not met
			return null;
		}
	}
	return obj;
}

// Basic routines
TreeStatesConvert.ValueType = function(v) {
	if (typeof v === "number" && !isNaN(v)) {
		return "num";
	} else if (typeof v === "string") {
		return "string";
	} else if (typeof v === "boolean") {
		return "bool";
	} else if (v == null) {
		return "null";
	}
	return null;
}
TreeStatesConvert.$reType = /^(num|string|bool|null)$/; // for .test only
/**
	Creates a condition
	
	var callback = TreeStatesConvert.Condition(<condname>[,arg1 [,arg2[....]]]);
*/
TreeStatesConvert.Condition = function(condition /*, params */) {
	// TODO: Check if conserving the args in the outer closure is better
	if (this.Conditions[condition] != null) {
		return new Delegate(null, function(v /* params */) {
			if (TreeStatesConvert.ValueType(v) != TreeStatesConvert.Conditions[condition].type) return null; // ignore
			return TreeStatesConvert.Conditions[condition].proc.apply(null, arguments);
		}, Array.createCopyOf(arguments,1));
	}
	return null;	
}
TreeStatesConvert.Conditions = {
	range: {
		type: "num",
		proc: function(v,low,high) {
			if (typeof low === "number" && v < low) return false;
			if (typeof high === "number" && v > high) return false;
			return true;
		}
	},
	text: {
		type: "string",
		proc: function(v,text) {
			if (v == text) return true;
			if (v.toUpperCase() == text.toUpperCase()) return true;
			// TODO: Add some locale compare stuff?
			return false;
		}
	},
	number: {
		type: "num",
		proc: function(v,number) {
			if (v != number) return false;
			return true;
		}
	},
	regex: {
		type: "string",
		proc: function(v,re) {
			return re.test(v);
		}
	},
	bool: {
		type: "bool",
		proc: function(v,b) {
			if (v != b) return false;
			return true;
		}
	}
};


//// Example for tests
g_cond1to20 = TreeStatesConvert.Condition("range",0,20);
g_cond21to40 = TreeStatesConvert.Condition("range",21,40);
g_condAlphaA = TreeStatesConvert.Condition("regex",/^A[a-zA-Z]+$/);
g_condAlphaB = TreeStatesConvert.Condition("regex",/^B[a-zA-Z]+$/);

g_ExampleTSE1 = [
	[ "alpha", "num,null", [g_cond1to20] ],
	[ "beta", "string",[g_condAlphaA]]
];
g_ExampleTSE2 = [
	[ "alpha", "num,null", [g_cond21to40] ],
	[ "beta", "string"]
];
g_ExampleTSE21 = [
	[ "gamma", "string,null", [g_condAlphaB] ]
];

g_ExampleTSM = [
	[ [g_ExampleTSE1]
	],
	
	[ [g_ExampleTSE2],
	  [ [g_ExampleTSE21]
	  ]
	]
];