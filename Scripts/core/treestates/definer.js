(function(){


	var _tskinds = {
		conditions: "conditions",
		tseu: "tseu", // MArks TSEU array
		tse: "tse", 
		tsm: "tsm",
		tsms: "tsms",
		tsmeta: "tsmeta"
	};
	function $DefinerForTreeStates() {
		BaseObject.apply(this,arguments);
		throw "This class is not instantiable.";
	}
	$DefinerForTreeStates.Inherit(BaseObject,"$DefinerForTreeStates");

	$DefinerForTreeStates.typeOf = function(obj) {
		if (Array.isArray(obj)) {
			return obj.$tskind;
		} else if (typeof obj == "object") {
			return _tskinds.tsmeta;
		}
		return null;
	}
	$DefinerForTreeStates.Conditions = _tskinds.conditions;
	$DefinerForTreeStates.Unit = _tskinds.tseu;
	$DefinerForTreeStates.Element = _tskinds.tse;
	$DefinerForTreeStates.Map = _tskinds.tsm;
	$DefinerForTreeStates.MapSet = _tskinds.tsms;
	$DefinerForTreeStates.Meta = _tskinds.tsmeta;

	$DefinerForTreeStates.isConditions = function(o) { return this.typeOf(o) == _tskinds.conditions;}
	$DefinerForTreeStates.isUnit = function(o) { return this.typeOf(o) == _tskinds.tseu;}
	$DefinerForTreeStates.isElement = function(o) { return this.typeOf(o) == _tskinds.tse;}
	$DefinerForTreeStates.isMap = function(o) { return this.typeOf(o) == _tskinds.tsm;};
	$DefinerForTreeStates.isMapSet = function(o) { return this.typeOf(o) == _tskinds.tsms;}
	$DefinerForTreeStates.isMeta = function(o) { return this.typeOf(o) == _tskinds.tsmeta;}

	$DefinerForTreeStates._defineTS = function(proc,tsapi) {
		
		var cond = function(name,args) {
			return tsapi.Condition.apply(tsapi, arguments);
		}
		
		var tseu = function(name,types,conditions) {
			var arrTypes = tsapi.TSEUTypesValid(types);
			if (tsapi.isError(arrTypes)) throw "One or more of the types in TSEU definition are not recognized. Types specified:" + types;
			if (typeof name != "string" || name.length == 0) throw "Name is required for a TSEU definition";
			var conds = [];
			for (var i = 2; i < arguments.length; i++) {
				if (!BaseObject.is(arguments[i], "Delegate")) throw "Conditions must be delegates. Use condition() to create them."; 
				conds.push(arguments[i]);
			}
			var arr = [name,types];
			if (conds.length > 0) {
				conds.$tskind = _tskinds.conditions;
				arr.push(conds);
			}
			arr.$tskind = _tskinds.tseu;
			return arr;
		}
		var tse = function(tseuN, meta) {
			var arr = [];
			for (var i = 0; i < arguments.length; i++) {
				var tseu = arguments[i];
				if (Array.isArray(tseu)) {
					if (tseu.$tskind != _tskinds.tseu) throw "TSE can contain only TSEU elements";
					arr.push(tseu);
				} else if (typeof tseu == "object" && i == arguments.length - 1) {
					arr.push(tseu);
				}
			}
			arr.$tskind = _tskinds.tse;
		}
		var tsm = function(_tse, _tsm) {
			if (BaseObject.is(_tse, "Array") && _tse.$tskind == _tskinds.tse) {
				var arr = [];
				arr.push(_tse);
				if (_tsm != null) {
					if (!BaseObject.is(_tsm, "Array") || _tsm.$tskind != _tskinds.tsm) {
						throw "The second argument of TSM is not a TSM";
					}
					arr.push(_tsm);
				}
				arr.$tskind = _tskinds.tsm; // One map
				return arr;
			} else {
				throw "Empty TSM are not allowed";
			}
		}
		var tsms = function(tsmN) {
			var arr = [];
			for (var i = 0; i < arguments.length; i++) {
				var _tsm = arguments[i];
				if (!BaseObject.is(_tsm, "Array") || _tsm.$tskind != _tskinds.tsm) {
					throw "TSMS can contain only TSM entries";
				}
				arr.push(_tsm);
			}
			arr.$tskind = _tskinds.tsms; // Multiple maps - no single root
			return arr;
		}
		var result = proc(tsms, tsm, tse, tseu, cond);
		return result;
		
	}
})();