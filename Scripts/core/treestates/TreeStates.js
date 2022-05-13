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

	function TreeStates(map) {
		BaseObject.apply(this, arguments);
		if (typeof map == "function") {
			map = $DefinerForTreeStates._defineTS(map,TreeStates);
		} 
		
		if (definer.isMap(map)) {
			this.maps = [map];
			this.maps.$tskind = definer.MapSet;
		} else if (definer.isMapSet(map)) {
			this.maps = map;
		} else {
			throw "TreeStates must be initialized with map or map set";
		}
	}
	TreeStates.Inherit(BaseObject,"TreeStates");

	TreeStates.prototype.createManipulator = function(a,b) {
		var man = Class("TreeStatesManipulator");
		return new man(a,b,this);
	}

	TreeStates.prototype.maps = null;
	TreeStates.prototype.linearize = function(objset) {
		return TreeStates.LinearizeTSMaps(this.maps, objset);
	}.Description("Converts the array of state objects to array of linearized state values")
		.Param("states","Array of state objects matching the map (MetaData in them is ignored for this process)")
		.Returns("If successful an array of linearized state values, each of them is an array in turn. The result can be empty, on error null is returned and last error set.");
	
	TreeStates.prototype.delinearize = function(linear) {
		return TreeStates.DelinearizeTSMaps(this.maps, linear);
	}

	TreeStates.prototype.cutFromState = function(namedPath, state) {
		return TreeStates.CutFromState(namedPath, state);
	}
	TreeStates.prototype.namedPathFromState = function(state) {
		return TreeStates.namedPathFromState(state);
	}
	TreeStates.prototype.cutAppendState = function(namedPath, cur_state, tail) {
		var base = TreeStates.CutFromState(namedPath, cur_state);
		if (base != null) {
			return base.concat(tail);
		}
		return null;
	}
	TreeStates.prototype.navToMap = function(namedPath) {
		if (Array.isArray(namedPath)) {
			if (namedPath.length > 0) {
				var curr = null;
				var name = namedPath[0];
				var i, j;
				var map, tse;
				for (i = 0; i < this.maps.length; i++) {
					map = this.maps[i];
					tse = map[0];
					if (definer.isElement(tse)) {
						if (tse.$tsname == name) {
							curr = map;
							break;
						}
					} else {
						this.LASTERROR("Expected map", "navToMap");
						return null;
					}
				}
				if (curr != null) { 
					var succeed = true;
					for (i = 1; i < namedPath.length; i++) {
						name = namedPath[i];
						if (curr.length <= 1) {
							this.LASTERROR("The " + i + " element cannot be found from this namedPath [" + namedPath.join(",") + "] cannot be found in the state", "navToMap");
							return null;
						}
						succeed = false;
						for (j = 1; j < curr.length; j++) {
							map = curr[j];
							tse = map[0];
							if (definer.isElement(tse)) {
								if (tse.$tsname == name) {
									curr = map;
									succeed = true;
									break;
								}
							} else {
								this.LASTERROR("Expected map", "navToMap");
								return null;
							}
						}
						if (!succeed) {
							this.LASTERROR("The " + i + " element cannot be found from this namedPath [" + namedPath.join(",") + "] cannot be found in the state", "navToMap");
							return null;
						}
					}
					return curr;
				} else {
					this.LASTERROR("The first map in [" + namedPath.join(",") + "] cannot be found in the state", "navToMap");
					return null;
				}
			} else {
				return this.maps;
			}
		}

		return null;
	}
	// Static creators

	


	// Static methods
	
	//#region Information and analysis (also available as instance methods)

	/**
	 * @param {Array<string>} namedPath - path to cut
	 * @param {Array<object>} state - object set state (usually the current state)
	 */
	TreeStates.cutFromState = function(namedPath, state) { 
		if (Array.isArray(state)) {
			if (Array.isArray(namedPath)) {
				if (namedPath.length > state.length) return null;
				var result = [];
				for (var i = 0; i < namedPath.length; i++) {
					if (namedPath[i] === state[i].StateElementName) {
						result.push(state[i]);
					} else {
						return null;
					}
				}
				return result;
			} else {
				return null;
			}
		} else {
			return null; // Kind of error - no state
		}
	}
	TreeStates.namedPathFromState = function(state) {
		if (Array.isArray(state)) {
			var result = [];
			for (var i = 0; i < state.length;i++) {
				if (typeof state[i].StateElementName == "string" && state[i].StateElementName.length > 0) {
					result.push(state[i].StateElementName);
				} else {
					return null;
				}
			}
			return result;
		}
		return null;
	}
	TreeStates.compareNamedPaths = function(named1,named2) {
		if (!this.isNamedState(named1) || !this.isNamedState(named2)) return false;
		if (named1.length != named2.length) return false;
		for (var i = 0; i < named1.length; i++) {
			if (named1[i] != named2[i]) return false;
		}
		return true;
	}
	TreeStates.isNamedState = function(state) {
		if (Array.isArray(state) && (state.length == 0 || state.All(function(idx,item) { 
			if (typeof item == 'string') return true;
			return false;
		}))) {
			return true;
		}
		return false;
	}
	TreeStates.isObjectState = function(state) {
		if (Array.isArray(state) && (state.length == 0 || state.All(function(idx,item) { 
			if (typeof item == 'object') return true;
			return false;
		}))) {
			return true;
		}
		return false;
	}

	//#endregion

	//#region Error definitions
	TreeStates.ErrorValue = {
		error: "TreeStates error"
	}
	TreeStates.Error = function(text,bnofatal) {
		BaseObject.lastError.report(-1,text,"TreeStates");
		return {
			text: text,
			value: TreeStates.ErrorValue,
			nonfatal: bnofatal
		};
	}
	TreeStates.isError = function(v) {
		if (v != null && v.value === TreeStates.ErrorValue) {
			return true;
		}
		return false;
	}
	TreeStates.isNonFatalError = function(v) {
		if (v != null && v.value === TreeStates.ErrorValue && v.nonfatal) {
			return true;
		}
		return false;
	}
	TreeStates.getTextFromError = function(err) {
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
	TreeStates.TSEUTypesValid = function(types) {
		if (typeof types != "string") {
			return this.Error("no types are set for this TSEU");
		}
		var arrTypes = types.split(",");
		if (!BaseObject.is(arrTypes,"Array") || arrTypes.length == 0) {
			return this.Error("no types are set for this TSEU");
		}
		if (!arrTypes.All(function(idx,itm) { return TreeStates.$reType.test(itm); })) {
			return this.Error("Unsupported type specified in TSEU: " + arrTypes.join(","));
		}
		return arrTypes;
	}


	// TSEU - Tree State Element Unit WRITE
	/**
		Gets the corresponding value from an object
		has to be called with a non-null TSEU
	*/
	TreeStates.TSEUValFromObject = function(tseu, obj) { // Extracts TSEU specific value from the object
		var name = tseu[0];
		var types = tseu[1];
		var arrTypes = TreeStates.TSEUTypesValid(types);
		if (this.isError(arrTypes)) return arrTypes;
		
		var v = obj[name];
		var vtype = TreeStates.ValueType(v);
		if (arrTypes.findElement(vtype) < 0) {
			return this.Error("Property " + name + " contains value of type not specified in the TSEU", true);
		}
		return v;
	}
	// Alias of the above
	TreeStates.LinearizeTSEU = function(tseu, obj) { return this.TSEUValFromObject(tseu, obj); }
	/**
		Checks the conditions in the TSEU over the value
	*/
	TreeStates.TSEUTestConditions = function(tseu, v) { // tests the conditions from the TSEU over the value v
		if (!definer.isUnit(tseu)) return false;
		var types = tseu[1];
		var arrTypes = TreeStates.TSEUTypesValid(types);
		if (this.isError(arrTypes)) return false;
		var vtype = this.ValueType(v);
		if (arrTypes.indexOf(vtype) < 0) return false;
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
	TreeStates.DelinearizeTSEU = function(tseu, value, obj) {
		if (!definer.isUnit(tseu)) {
			return false;
		}
		var name = tseu[0];
		//var types = tseu[1];
		//var arrTypes = TreeStates.TSEUTypesValid(types);
		//var vtype = this.ValueType(value);
		//if (this.isError(arrTypes)) return false;
		
		if (!TreeStates.TSEUTestConditions(tseu, value)) return false;
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
	TreeStates.GetMetaFromTSE = function(tse) {
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
	TreeStates.LinearizeTSE = function(tse,obj) { // Converts data from object to linear array of values
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
	TreeStates.DelinearizeTSE = function(tse, arrvals, _obj) {
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
		obj.StateElementName = tse.$tsname;
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
	TreeStates.LinearizeTSM = function(tsm, objset, _linear) {
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
	TreeStates.DelinearizeTSM = function(tsm, linear, _objset) {
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

	TreeStates.LinearizeTSMaps = function(tsms, objset, _linear) {
		if (definer.isMapSet(tsms)) {
			for (var i = 0; i < tsms.length; i++) {
				var linear = this.LinearizeTSM(tsms[i],objset);
				if (linear != null) { return linear; }
			}
		}
		return null;
	}
	TreeStates.DelinearizeTSMaps = function(tsms, linear, _objset) {
		if (definer.isMapSet(tsms)) {
			for (var i = 0; i < tsms.length; i++) {
				var objset = this.DelinearizeTSM(tsms[i],linear);
				if (objset != null) { return objset; }
			}
		}
		return null;
	}
	TreeStates.LinearizeTSSubMaps = function(tsm, objset, _linear) {
		if (definer.isMap(tsm)) {
			for (var i = 1; i < tsm.length; i++) {
				var linear = this.LinearizeTSM(tsm[i],objset);
				if (linear != null) { return linear; }
			}
		}
		return null;
	}
	TreeStates.DelinearizeTSSubMaps = function(tsm, linear, _objset) {
		if (definer.isMap(tsm)) {
			for (var i = 1; i < tsm.length; i++) {
				var objset = this.DelinearizeTSM(tsm[i],linear);
				if (objset != null) { return objset; }
			}
		}
		return null;
	}

	//#endregion TSM set



	//#region Conditions and typing


	// Basic routines
	/**
		Determines the type of the value (according to the TSEU type set)
		
		@param v {any} - the value to check
		@returns {string|null} the name of the type or null if mapping is impossible
	*/
	TreeStates.ValueType = function(v) {
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
	TreeStates.$reType = /^(num|string|bool|null)$/; // for .test only
	/**
		Creates a condition
		
		var callback = TreeStates.Condition(<condname>[,arg1 [,arg2[....]]]);
	*/
	TreeStates.Condition = function(condition /*, params */) {
		// TODO: Check if conserving the args in the outer closure is better
		if (this.Conditions[condition] != null) {
			return new Delegate(null, function(v /* params */) {
				if (TreeStates.ValueType(v) != TreeStates.Conditions[condition].type) return null; // ignore because types do not match
				return TreeStates.Conditions[condition].proc.apply(null, arguments);
			}, Array.createCopyOf(arguments,1));
		}
		return null;	
	}
	TreeStates.Conditions = {
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
	//#endregion Conditions and typing

})();