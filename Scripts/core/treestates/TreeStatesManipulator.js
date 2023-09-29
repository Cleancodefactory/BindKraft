(function() {

    var ITreeStatesSerializer = Interface("ITreeStatesSerializer"),
        ICloneObject = Interface("ICloneObject"),
        TreeStates = Class("TreeStates");

    function TreeStatesManipulator(/*serializer, states, approuter*/) {
        BaseObject.apply(this, arguments);
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (BaseObject.is(arg, ITreeStatesSerializer)) {
                this.$serializer = arg;
            } else if (BaseObject.is(arg,"TreeStates")) {
                this.$states = arg;
            } else if (BaseObject.is(arg, "IAppRouter" )) {
                this.$approuter = arg;
            } else if (arg == null) {
                // Skip it
            } else {
                throw "Unknown and unexpected argument";
            }
        }
        
    }
    TreeStatesManipulator.Inherit(BaseObject, "TreeStatesManipulator")
        .Implement(ICloneObject)
        .ImplementProperty("serializer")
        .ImplementProperty("states")
        .ImplementProperty("approuter");

    TreeStatesManipulator.prototype.cloneObject = function(approuter) {
        return new TreeStatesManipulator(this.$serializer, this.state, BaseObject.is(approuter, IAppRouter)?approuter:this.$approuter);
    }
    TreeStatesManipulator.prototype.isFunctional = function() {
        if (BaseObject.is(this.$serializer, "ITreeStatesSerializer") && 
            BaseObject.is(this.$states, "TreeStates")) return true;
        return false;
    }
    /**
     * Array of TSE name
     * @param {*} namedState 
     * @returns 
     */
    TreeStatesManipulator.prototype.isNamedState = function(namedState) {
        return TreeStates.isNamedState(namedState);
    }
    TreeStatesManipulator.prototype.isObjectState = function(objState) {
        return TreeStates.isObjectState(objState);
    }
    TreeStatesManipulator.prototype.navToMap = function(namedPath) {
        return this.$states.navToMap(namedPath);
    }
    /**
     * @param {Array<object>} objSet - the state to strip named path for. If omitted will use the current app state
     * @return {Array<string>} - the named path for this state
     */
    TreeStatesManipulator.prototype.namedPathFromState = function(objSet) {
        if (arguments.length == 0) {
            return TreeStates.namedPathFromState(this.$approuter.currentTreeState());
        } else {
            return TreeStates.namedPathFromState(objSet);
        }
    }
    /**
     * @param {Array<string>} namedPath - the path to cut
     * @param {Array<object>} state - object set state - optional. If supplied will cut from it. If missing will use the current app state.
     */
    TreeStatesManipulator.prototype.cutFromState = function(namedPath, state) {
        if (arguments.length <= 1) {
            return TreeStates.cutFromState(namedPath, this.$approuter.currentTreeState());
        } else {
            return TreeStates.cutFromState(namedPath, state);
        }
    }
    TreeStatesManipulator.prototype.compareNamedPathWithState = function(namedPath, objSet) {
        if (!TreeStates.isNamedState(namedPath)) return false;
        var namedState = TreeStates.namedPathFromState(objSet);
        if (namedState != null) {
            return TreeStates.compareNamedPaths(namedPath, namedState);
        }
        return false;
    }
    /**
     * Compares two object set states and returns a result that contains the same and different parts.
     * The best illustration is usage of the method when navigation should occur and s1 is the current state
     * and s2 is the state we want to switch to.
     * 
     * 
     * @param {Array<object>} s1 the first state (the state to which you want to go down and preserve)
     * @param {Array<object>} s2 the second state (the new state to which you want to go.)
     * @returns {object} The two parts of the comparison:
     * {
     *  base: {Array<object>} The part where the both states are equal
     *  nav: {Array<object>} The part from s2 that is different
     *  clean: {Array<object>} The part to deconstruct, reversed,ready to use in a forward cycle
     * }
     */
    TreeStatesManipulator.prototype.compareStates = function(s1, s2) {
        var r = this.$states.compareStates(s1,s2);
        if (r.incompatible) return null;
        if (r.equal) return {
            full: s1,
            base: s1, // length can be used as truncation index if the states themselves are not necessary
            nav: [],
            clean: []
        }
        return {
            full: s1.slice(0,r.differentFrom).concat(s2.slice(r.differentFrom)),
            base: s1.slice(0,r.differentFrom),
            nav: s2.slice(r.differentFrom),
            clean: s1.slice(r.differentFrom).reverse()
        }
    }
    /**
     * @param {Array<string>} namedPath - The part of the path to preserve (base)
     * @param {Array<object>|string} targetState - The relative route to which we want to go from the namedPath
     * @return {object} -
     * {
     *  base: {Array<object>} The part where the both states are equal
     *  nav: {Array<object>} The part from targetState that is different
     *  clean: {Array<object>} The part to deconstruct, reversed,ready to use in a forward cycle
     * }
     */
    TreeStatesManipulator.prototype.navigateBackAndForth = function(namedPath, targetState) {
        var baseObjectState, t;
        if (typeof targetState == 'string') {
            namedPath = this.stateMan().deserialize(namedPath);
        }
        if (this.isNamedState(namedPath)) {
            baseObjectState = this.$approuter.currentTreeState(namedPath);
        } else if (this.isObjectState(namedPath) && targetState == null) {
            t = this.compareStates(this.$approuter.currentTreeState(),namedPath);
            if (t != null) {
                return t;
            } else {
                baseObjectState = null;
                targetState = namedPath;
            }
        } else {
            throw "targetState should be omitted when object state is passed as first argument";
        }
        
        if (baseObjectState == null || baseObjectState.length == 0) {
            // TODO Do we need checks here?
            t = this.isObjectState(targetState)?targetState:this.$states.delinearize(this.get_serializer().parseToLinear(targetState));
            return {
                full: t,
                base: null,
                nav: t,
                clean: this.$approuter.currentTreeState().reverse()
            };
        } else if (baseObjectState.length > 0) {
            var startMap = this.$states.navToMap(namedPath);
            var navObjectSet = [];
            if (this.isObjectState(targetState)) {
                navObjectSet = targetState;
            } else if(typeof targetState == "string") {
                var sublinear = ser.parseToLinear(targetState);
                navObjectSet = TreeStates.DelinearizeTSSubMaps(startMap, sublinear);
            } else {
                throw "targetState argument can be either object state or string";
            }
            return this.compareStates(this.$approuter.currentTreeState(), baseObjectState.concat(navObjectSet));
        }
    }

    TreeStatesManipulator.prototype.truncateFromState = function(namedPath) { 
        var state = this.$approuter.currentTreeState();
        var i;
		if (Array.isArray(state)) {
			if (Array.isArray(namedPath)) {
				if (namedPath.length > state.length) return null;
				var result = [];
                var clean = [];
				for (i = 0; i < namedPath.length; i++) {
					if (namedPath[i] === state[i].StateElementName) {
						result.push(state[i]);
					} else {
						return null;
					}
				}
                if (state.length > namedPath.length) {
                    clean = state.slice(namedPath.length);
                }
				return { result: result, clean: clean.reverse() };
			} else {
				return null;
			}
		} else {
			return null; // Kind of error - no state
		}
	}
    TreeStatesManipulator.prototype.deserialize = function(input, options) { 
        if (!this.isFunctional()) {
            this.LASTERROR("Serializer or/and TreeStates map not set.","deserialize");
            return null;
        }
        var ser = this.get_serializer();
        var linear = ser.parseToLinear(input, options);
        return this.$states.delinearize(linear);
    }
    TreeStatesManipulator.prototype.deserializeSubState = function(namedBase, subpath) {
        var ser = this.get_serializer();
        var startMap = this.$states.navToMap(namedBase);
        if (startMap != null) {
            var sublinear = ser.parseToLinear(subpath);
            return TreeStates.DelinearizeTSSubMaps(startMap, sublinear);
        }
        return null;
    }
    TreeStatesManipulator.prototype.combineSubState = function(namedBase, subpath) {
        var ser = this.get_serializer();
        var current_state = this.$approuter.currentTreeState(namedBase);
        if (current_state == null) return null;
        var startMap = this.$states.navToMap(namedBase);
        if (startMap != null) {
            if (this.isObjectState(subpath)) {
                return current_state.concat(subpath);
            } else if (typeof subpath == "string") {
                var sublinear = ser.parseToLinear(subpath);
                var sub_objstate = TreeStates.DelinearizeTSSubMaps(startMap, sublinear);
                return current_state.concat(sub_objstate);
            }
        }
        return null;
    }

    TreeStatesManipulator.prototype.serialize = function(base, objset) { 
        if (!this.isFunctional()) {
            this.LASTERROR("Serializer or/and TreeStates map not set.","serialize");
            return null;
        }
        var ser = this.get_serializer();
        var linear = this.$states.linearize(objset);
        return ser.encodeFromLinear(base, linear);
    }

    //#region App helpers - called mostly from inside the apps to navigate internally
    /**
     * @param {Array<string>} base - Base named path array
     * @param {string|any} subpath - serialized for of the subpath
     * 
     * remarks: What we want achieve is to preserve the base part of the current state and deserialize the subPath, then
     * concatenate the object sets and route the app there.
     * considerations: Depending on what the app can do we may:
     *  - just go forward and pass the whole object set route and then we assume the app will smartly keep the same nodes intact
     *  - help the app to optimize the change by giving it the base to which it should truncate its current state and give it separately
     *  the tail (deserialized subpath)
     */
    TreeStatesManipulator.prototype.routeTo = function(namedBase, subpath) {
        var objset = this.deserializeSubState(namedBase, subpath);
        if (objset != null) {
            this.get_approuter().routeTreeState(nameBase, objset);
        }
        // TODO Error or what?
    }
    //#endregion

})();