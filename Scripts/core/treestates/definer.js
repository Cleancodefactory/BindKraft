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

	$DefinerForTreeStates.hasMeta = function(tse) { 
		if (this.isElement(tse)) {
			if (tse.length > 0 && this.isMeta(tse[tse.length - 1])) {
				return true;
			}
		}
		return false;
	}


	$DefinerForTreeStates.tseLength = function(o) { 
		if (this.typeOf(o) == _tskinds.tse) {
			if (this.hasMeta(o)) return o.length - 1;
			return o.length;
		}
		return -1;
	}

	// Called over TSE only
	$DefinerForTreeStates.getMeta = function(o) { 
		if (this.typeOf(o) == _tskinds.tse) {
			if (this.hasMeta(o)) return o[o.length - 1];
		}
		return null;
	}

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
		var tse = function(name, tseuN, meta) {
			var arr = [];
			if (typeof name == "string" && name.length > 0) {
				arr.$tsname = name;
			} else {
				throw "Name of TreeState element is required!";
			}
			for (var i = 1; i < arguments.length; i++) {
				var tseu = arguments[i];
				if (Array.isArray(tseu)) {
					if (tseu.$tskind != _tskinds.tseu) throw "TSE can contain only TSEU elements";
					arr.push(tseu);
				} else if (typeof tseu == "object" && i == arguments.length - 1) {
					tseu.$tskind = _tskinds.tsmeta;
					arr.push(tseu);
				}
			}
			arr.$tskind = _tskinds.tse;
			return arr;
		}
		var tsm = function(_tse, _tsm, _tsm2 /* etc.*/) {
			if (BaseObject.is(_tse, "Array") && _tse.$tskind == _tskinds.tse) {
				var arr = [];
				arr.push(_tse);
				for (var i = 1; i < arguments.length; i++) {
					var t = arguments[i];
					if ($DefinerForTreeStates.isMap(t)) {
						arr.push(t);
					} else {
						throw "The TS maps consist of one element and 0 or more (sub) maps";
					}
				}
				arr.$tskind = _tskinds.tsm; // One map
				return arr;
			} else {
				throw "TS map must start with a TS element";
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