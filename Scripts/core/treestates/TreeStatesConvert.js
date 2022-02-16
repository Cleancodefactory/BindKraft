(function() {
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
		
	State element (TSE)

	[ ["name1","int|number|missing"],["name2","bool|number|missing"] ]

	Data and:


	*/

	var $DefinerForTreeStates = Class("$DefinerForTreeStates");
	
	var definer = $DefinerForTreeStates;

	function TreeStatesConvert(map) {
		BaseObject.apply(this, arguments);
		if (typeof map == "function") {
			map = $DefinerForTreeStates._defineTS(map,TreeStatesConvert);
		} 
		
		if (definer.isMap(map)) {
			this.maps = [map];
			this.maps.$tskind = definer.MapSet;
		} else if (definer.isMapSet(map)) {
			this.maps = map;
		} else {
			throw "TreeStatesConvert must be initialized with map or map set";
		}
	}
	TreeStatesConvert.Inherit(BaseObject,"TreeStatesConvert");
	TreeStatesConvert.prototype.maps = null;
	TreeStatesConvert.prototype.linearize = function(objset) {
		return TreeStatesConvert.LinearizeTSMaps(this.maps, objset);
	}.Description("Converts the array of state objects to array of linearized state values")
		.Param("states","Array of state objects matching the map (MetaData in them is ignored for this process)")
		.Returns("If successful an array of linearized state values, each of them is an array in turn. The result can be empty, on error null is returned and last error set.");

	TreeStatesConvert.prototype.delinearize = function(linear) {
		return TreeStatesConvert.DelinearizeTSMaps(this.maps, linear);
	}

	// Static methods	

	//#region Error definitions
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
	TreeStatesConvert.getTextFromError = function(err) {
		if (this.isError(err)) {
			return err.text || "error occurred";
		}
		return null;
	}
	//#endregion Error definitions

	//#region TSU, validators and condition checking
	// Validators
	/**
		Checks if the comma separated list of types is valid - i.e. all types are supported
		
		@param types {string} Comma separated type names without spaces.
		@returns {tscerr|array<string>} Error or array of type names as strings
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
	TreeStatesConvert.TSEUValFromObject = function(tseu, obj) { // Extracts TSEU specific value from the object
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
	// Alias of the above
	TreeStatesConvert.LinearizeTSEU = function(tseu, obj) { return this.TSEUValFromObject(tseu, obj); }
	/**
		Checks the conditions in the TSEU over the value
	*/
	TreeStatesConvert.TSEUTestConditions = function(tseu, v) { // tests the conditions from the TSEU over the value v
		if (!definer.isUnit(tseu)) return false;
		var conditions = tseu[2];
		if (BaseObject.is(conditions,"Array")) {
			for (var i = 0; i < conditions.length;i++) {
				if (conditions[i].invoke(v) === false) return false;
			}
		}
		return true;
	}
	/**
		Called during delinearization of a TSE linear to deal with individual values
		If TSEU matches the value, the value is set to the object passed and true is returned.
		In case of any error or unmatched conditions the function returns false;
		
		@param tseu {TSEU}	
		@param value {any}
		@param obj {object} - the object to which to set the value

		@returns {boolean} - true indicates success
	*/
	TreeStatesConvert.DelinearizeTSEU = function(tseu, value, obj) {
		if (!definer.isUnit(tseu)) {
			return false;
		}
		var name = tseu[0];
		var types = tseu[1];
		var arrTypes = TreeStatesConvert.TSEUTypesValid(types);
		if (this.isError(arrTypes)) return false;
		if (!TreeStatesConvert.TSEUTestConditions(tseu, value)) return false;
		obj[name] = value;
		return true;
		
	}
	//#endregion TSEU, validators and condition checking

	//#region TSE (Element)
	/**
	 * @param {TSE} tse The stateTSE
	 * 
	 * @returns {object|null} The metadata of the TSE or null if missing or not TSE.
	 * 
	 * The same is done also by the definer.getMeta
	 * 
	 */
	TreeStatesConvert.GetMetaFromTSE = function(tse) {
		if (definer.isElement(tse)) {
			if (tse.length > 0 && definer.isMeta(tse[tse.length - 1])) {
				return tse[tse.length - 1];
			}
		}
		return null;
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
			if (definer.isUnit(tseu)) {
				var val = this.TSEUValFromObject(tseu, obj);
				if (this.isError(val)) {
					if (this.isNonFatalError(val)) {
						// non match and not an error really
						return null;
					}
					return val; // return the error
				}
				if (!this.TSEUTestConditions(tseu, val)) return null;
				result.push(val);
			}
		}
		return result;
	}
	/**
		Executes all the TSEU from a TSE to check the values from an array (linear) and puts them on the object
		Checks the conditions and stops if any fails - returns null in that case - the object otherwise.
		
		@param tse {TSE}		TSE to process
		@param arrvals {array}	The linear. It has to have the same size as the TSE
		@param _obj {object}	Optional - created if not passed. The object to which to set values.

		@return {object|null}	Returns the decoded object or null if not match or error. Any errors are issued as LASTERROR

		Attaches the metadata as MetaData property to the result.
		
		@remarks an important point here is that the linear has to be the same size as the TSE. This is introducing a
			requirement to the serialization/deserialization to keep the knowledge of the number of the values linearized
			using a TSE or take into account the TSE during both processes.
	*/
	TreeStatesConvert.DelinearizeTSE = function(tse, arrvals, _obj) {
		var obj = _obj || {};
			if (arrvals == null || arrvals.length == 0) {
			// TODO: May be dealing with required/non-required cases would be needed?
			return obj; // fine we are optional - empty object
		}
		if (definer.tseLength(tse) != arrvals.length) return null; // fail (see remarks)
		for (var i = 0; i < definer.tseLength(tse);i++) {
			// Read one and check type
			if (!this.DelinearizeTSEU(tse[i], arrvals[i], obj)) return null;
		}
		obj.MetaData = definer.getMeta(tse);
		return obj;
	}

	//#endregion TSE

	//#region TSM
	/**
	 * Linearizes over a single map. A map (TSM) is:
	 * 
	 * [TSE, TSM1, TSM2 .... TSM_N]
	 * 
	 * Defines an element and all the branches under it.
	 * objset is an array of objects matched to branches of the map tree and turned into array of linearized TSEs according to the match
	 * 
	 * Recursion: 	pass cloned objset without the processed object,
	 * 				pass next tsm
	 * 				recursion returns the linear on success (already appended with the data)
	 * 
	 * @param {TSM} tsm 
	 * @param {Array<object>} objset 
	 * @param {Array<Array>} _linear 
	 * @returns {[]|error|null} the linear if successful error on error, null on no match
	 */
	TreeStatesConvert.LinearizeTSM = function(tsm, objset, _linear) {
		var linear = _linear || [];
		var r; // temp result
		if (objset == null || objset.length == 0) { // nothing to linearize
			return linear; // Counts as success
		}
		var curObject = objset[0];
		var recurseObjSet; // temp var for cloned remains of object sets
		if (definer.isMap(tsm)) {
			if (tsm.length > 0) { // has a TSE - test it
				r = this.LinearizeTSE(tsm[0],curObject);
				if (Array.isArray(r)) { // We are match
					linear.push(r); // record it
					recurseObjSet = Array.createCopyOf(objset,1); // Cut the first object
					if (recurseObjSet.length == 0) { 
						// No more data to map - complete successfully
						return linear;
					}
					// recurse the submaps until match, error
					for (var i = 1; i < tsm.length; i++) {
						// Returns our linear appended with everything found down the map
						r = this.LinearizeTSM(tsm[i], recurseObjSet, linear); //
						if (Array.isArray(r)) {// Match !
							return r;
						} else if (this.isError(r)) { // Error - immediate bail out
							this.LASTERROR(this.getTextFromError(r));
							return null;
						} else {// Try next
							return null;
						}
					}
					// No matches - technically not an error, but it usually is. Just detect it outside
					return null;
				} else { // error or not a match - bail out. Will be null or error, no need to distinguish between them here.
					if (this.isError(r)) BaseObject.LASTERROR(this.getTextFromError(r));
					return r;
				}
			}
		}
		return null; // no match or/and not a map
	}
	/**
	 * Delinearizes from the linear to object.
	 */
	TreeStatesConvert.DelinearizeTSM = function(tsm, linear, _objset) {
		///
		var objset = _objset || [];
		if (linear == null || linear.length == 0) {
			return objset;
		}
		var _part = linear[0];
		if (!Array.isArray(_part)) { 
			BaseObject.LASTERROR("part of a linear is not an array.");
			return null;
		}
		var obj;
		if (definer.isMap(tsm)) { 
			obj = this.DelinearizeTSE(tsm[0],_part);
			if (obj != null) {
				objset.push(obj);
				// This map matches
				_part = Array.createCopyOf(linear,1);
				if (_part.length > 0) {
					// Traverse the submaps
					for (var i = 1; i < tsm.length; i++) {
						if (this.DelinearizeTSM(tsm[i],_part,objset) != null) {
							// data is already recorded in the objset - complete successfully
							return objset;
						}
					}
					// All tried, there is data, but cannot be decoded
					return null;
				} else {
					// Linear finished
					return objset;
				}
			} else {
				// This map does not match
				return null;
			}
		}
		return null;
	}

	//#endregion TSM

	//#region TSM set - multiple maps

	TreeStatesConvert.LinearizeTSMaps = function(tsms, objset, _linear) {
		if (definer.isMapSet(tsms)) {
			for (var i = 0; i < tsms.length; i++) {
				var linear = this.LinearizeTSM(tsms[i],objset);
				if (linear != null) { return linear; }
			}
		}
		return null;
	}
	TreeStatesConvert.DelinearizeTSMaps = function(tsms, linear, _objset) {
		if (definer.isMapSet(tsms)) {
			for (var i = 0; i < tsms.length; i++) {
				var objset = this.DelinearizeTSM(tsms[i],linear);
				if (objset != null) { return objset; }
			}
		}
		return null;
	}

	//#endregion TSM set


	//#region Old code

	/* TODO needs review

		Linearizes a set of object states according to matching TSM from a map set (TSMs)
		A TSMS is essentially an array of TSM - the first matching is used
		
		recursive outcomes
		match - []
		no-match - null
		error - error

		
	*/
	/*
	TreeStatesConvert.LinearizeTSMs = function(tsm, objset, _linear) {
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
				// Empty tsm is also a terminator (for those who like this syntax) - end recursion
				// But the object has to be exhausted
				if (object.length > 0) {
					return null;
				}
				return linear;
			}
			if (initial) {
				// tsm is tsms
				for (i = 0; i < tsm.length; i++) {
					
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
	*/
	//#endregion Old code


	// Basic routines
	/**
		Determines the type of the value (according to the TSEU type set)
		
		@param v {any} - the value to check
		@returns {string|null} the name of the type or null if mapping is impossible
	*/
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


})();