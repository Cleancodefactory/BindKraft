// NO LOAD DEPENDENCIES

/*
    File: selfdoc.js
    Contains Function extensions for maintaining self-documentation of methods, classes and interfaces.

    TODO: We should try to deprecate this and replace it with a system that provides this information on demand from outside.
*/

// Live Self-documentation utilities
// Sets the $hidden attribute. The documentation browsers should not display the method if $hidden is true
Function.prototype.Hide = function () {
    this.$hidden = true;
    return this;
};
Function.prototype.Hide.$hidden = true;
// Attaches a short description to the function
Function.prototype.Description = function (s) {
    this.$description = s;
    return this;
}.Hide();
Function.prototype.Param = function(pname, pdesc, nopos) {
    if (this.$paramDescriptions == null) {
        this.$paramDescriptions = [];
    }
    this.$paramDescriptions.push( { description: pdesc, name: pname, position: (nopos?null:this.$paramDescriptions.length) });
    return this;
}.Hide();
Function.prototype.Returns = function(s) {
    this.$returns = s;
    return this;
}.Hide();
Function.prototype.Virtual = function(isvirt) {
	// Because all methods are de facto virtual this mostly signifies that the method can be overriden optionally.
    var b = (arguments.length > 0)?(isvirt?true:false):true;
    this.$isvirtual = b;
    return this;
}.Hide();
Function.prototype.Override = function() {
	// The method has to be overriden
	this.$override = true;
	return this;
}
Function.prototype.BaseClass = function() {
	// Marks a class as a base class (not necesarrily abstract)
	// Helps the system with code validation mostly
	this.$baseclass = true;
	return this;
}
Function.prototype.Sealed = function(b) {
    if (b === false) {
        this.$issealed = false;
    } else {
        this.$issealed = true;
    }
}.Hide();
Function.prototype.Deprecated = function() {
    this.$isdeprecated = true;
	return this;
}.Hide();
// Additional remarks usually describing usage patterns and specifics.
// When used with two arguments, the first is a key in the $notes dictionary and can be cited with the Note function
Function.prototype.Remarks = function(s_key,s) {
    if (typeof s == "string" && typeof s_key == "string") {
        // Key value
        if (this.$notes == null) this.$notes = {};
        this.$notes[s_key] = s;
    } else {
        this.$remarks = (this.$remarks?this.$remarks + "":"") + s_key;
    }
    return this;
}.Hide();

// Cites a note specified on another function (the other function is usually the class itself)
Function.prototype.Note = function(func, note) {
    if (this.$quotations == null) this.$quotations = [];
    if (typeof func == "string" && note == null) {
        this.$quotations.push({key: func, func: null});
    } else if (typeof func == "function" && note != null) {
        this.$quotations.push({key: note, func: func});
    } 
    return this;
}.Hide();
// Report inconsistency or other potential problem that is not taken care of or is inherent.
Function.prototype.Problem = function(s) {
    this.$problem = (this.$problem?this.$problem + "":"") + s;
    return this;
}.Hide();
// Multiple arguments pointing to Initialize events
// e.g. MyClass.prototype.MyFunc = function() {...}.Fires("event1", "event2");
// The events are from the same class
Function.prototype.Fires = function(intentEvents) {
    if (this.$events == null) this.$events = [];
    for (var i = 0; i < arguments.length; i++) {
        this.$events.push(arguments[i]);
    }
    return this;
}.Hide();

//+VERSION 1.5
Function.prototype.CopyDocFrom = function(func,noevents) {
    // TODO: Review this if shallow clonning is not enough.
    if (func != null) {
        var k;
        if (func.$hidden === true) this.$hidden = true;
        if (func.$description != null) this.$description = func.$description;
        if (func.$paramDescriptions != null) this.$paramDescriptions = func.$paramDescriptions;
        if (func.$returns != null) this.$returns = func.$returns;
        if (func.$isvirtual === true) this.$isvirtual = true;
        if (func.$issealed === true) this.$issealed = true;
		if (func.$override === true) this.$override = true;
		if (func.$baseclass === true) this.$baseclass = true;
        if (func.$isdeprecated === true) this.$isdeprecated = true;
        if (func.$notes != null) {
            this.$notes = {};
            for (k in func.$notes) { this.$notes[k] = func.$notes[k]; }
        }
        if (func.$remarks != null) this.$remarks = func.$remarks;
        if (func.$problem != null) this.$problem = func.$problem;
        if (func.$quotations != null) this.$quotations = Array.createCopyOf(func.$quotations);
        if (noevents !== true) {
            if (func.$events != null) this.$events = Array.createCopyOf(func.$events);
        }
    }
    return this;
}.Hide();
//-VERSION 1.5

// This function is supposed to serve the documentation entries in directly usable form. Some
// data is kept in references or (or can be) collected from various places - this function constructs a simple
// object that can be directly used (in a view for example).
// This function is designed primarily for members of a class and may not return complete results for global functions.
// The 3-d argument (state) is optional. Pass an empty object the first time you call the function and the same object in all the
// remaining calls for information fetching from the same class. This enables the function to return null when some data is aggregated
// and needs to be omitted (for example get_/set_ props).
Function.GetDocumentationOf = function(cls, method_or_prop, state, bStatic) {
    var clean_name = method_or_prop;
    var prefix; // Work variable for name prefixes
    var member; // Processed member
    var result = { // Just in case
        name: method_or_prop,
        isstatic: bStatic
    };
    function extractProto (f) {
        var p = f.toString();
        var curly = p.indexOf("{");
        return p.slice(0, curly);
    }
    function accessorName(bWrite, priv, name) {
        return (priv?"$":"")+(bWrite?"set_":"get_")+name;
    }
    function extractAccessor(cls, bWrite, priv, name, bStatic) {
        var true_name = accessorName(bWrite, priv, name);
        var o = (bStatic?cls[true_name]:cls.prototype[true_name]);
        if (typeof o == "function") return o;
        return null;
    }
    function readParamInfo(f, spec) {
        if (f.$paramDescriptions != null) {
            if (result.params == null) result.params = [];
            for (var i = 0; i < f.$paramDescriptions.length; i++) {
                var o = f.$paramDescriptions[i];
                if (o != null) {
                    if (spec != null) o.specifics = spec;
                    result.params.push(o);
                }
            }
        }
        if (f.$events != null) {
            if (result.events == null) result.events = "";
            result.events = f.$events.join(",");
        }
    }
    function readIntentInfo(Initialize) {
        result.type = Initialize.type;
        result.paramType = Initialize.paramType;
        if (Initialize.description != null) {
            if (result.desc == null) result.desc = "";
            result.desc = Initialize.description;
        }
        var dvd = Initialize.defValueDescription();
        if (dvd != null) {
            result.defaultValue = dvd.value;
            result.defaultValueType = dvd.type;
        }
    }
    function isInherited(name, localVal) {
        if (cls.parent == null) return false;
        var parentProto = cls.parent.constructor.prototype;
        if (parentProto != null) {
            if (parentProto[name] == localVal) return true;
            return false;
        } else {
            return false;
        }
    }
    function isAccessorInherited(name, bWrite, priv,localVal) {
        return isInherited(accessorName(bWrite,priv,name),localVal);
    }
    if (cls != null && method_or_prop != null) {
        if (method_or_prop.indexOf("$") == 0) {
            result.priv = true;
            clean_name = method_or_prop.slice(1);
        } else {
            result.priv = false;
        }
        var reprop = /\$?(get_|set_)/g;
        if ( (prefix = reprop.exec(method_or_prop)) && prefix.index == 0) {
            var memberName = method_or_prop.slice(reprop.lastIndex); // Member name is the official name (not the real one)
            result.name = memberName;
            var failedProperty = true;
            if (bStatic && BaseObject.getProperty(state, "staticproperties." + memberName, false)) return null; // Already enumerated
            if (!bStatic && BaseObject.getProperty(state, "properties." + memberName, false)) return null; // Already enumerated
            if (state != null) {
                if (bStatic) { 
                    if (state.staticproperties == null) state.staticproperties = {};
                    state.staticproperties[memberName] = true;
                } else {
                    if (state.properties == null) state.properties = {};
                    state.properties[memberName] = true;
                }
            }
            
            result.isproperty = true;
            result.isfield = false;
            result.desc = "";
            result.isinherited = true;
            member = extractAccessor(cls, false, result.priv, memberName, bStatic);
            if (member != null) {
                failedProperty = false;
                result.isread = true;
                result.getproto = extractProto(member);
                result.hidden = member.$hidden;
                if (!bStatic) {
                    result.isinherited_get = isAccessorInherited(memberName, false, result.priv, member);
                }
                if (member.$description != null) {
                    result.desc += member.$description;
                }
                if (member.$isdeprecated) result.deprecated = true;
                if (member.$issealed) result.issealed = true;
                if (member.$isvirtual) result.virtual = true;
                if (member.$returns != null) result.returns = ((result.returns != null)?result.returns + member.$returns:member.$returns);
                if (member.$problem != null) result.problem = ((result.problem != null)?result.problem + member.$problem:member.$problem);
                
                if (member.$remarks != null) {
                    if (result.remarks == null) result.remarks = "";
                    result.remarks += member.$remarks;
                }
                if (member.$quotations != null) {
                    if (result.notes == null) result.notes = "";
                    for (var i = 0; i < member.$quotations.length; i++) {
                        var q = member.$quotations[i];
                        if (q != null && q.key != null) {
                            if (q.func == null) {
                                if (cls != null && cls.$notes != null && cls.$notes[q.key] != null) {
                                    result.notes += cls.$notes[q.key];
                                }
                            } else {
                                if (q.func.$notes != null && q.func.$notes[q.key] != null) {
                                    result.notes += q.func.$notes[q.key];
                                }
                            }
                        }
                    }
                }
                readParamInfo(member, "getter");
            }
            member = extractAccessor(cls, true, result.priv, memberName, bStatic);
            if (member != null) {
                failedProperty = false;
                result.iswrite = true;
                result.setproto = extractProto(member);
                result.hidden = member.$hidden;
                if (!bStatic) {
                    result.isinherited_set = isAccessorInherited(memberName, true, result.priv, member);
                }
                if (member.$description != null) {
                    result.desc += member.$description;
                }
                if (member.$isdeprecated) result.deprecated = true;
                if (member.$issealed) result.issealed = true;
                if (member.$isvirtual) result.virtual = true;
                if (member.$returns != null) result.returns = ((result.returns != null)?result.returns + member.$returns:member.$returns);
                if (member.$problem != null) result.problem = ((result.problem != null)?result.problem + member.$problem:member.$problem);
                if (member.$remarks != null) {
                    if (result.remarks == null) result.remarks = "";
                    result.remarks += member.$remarks;
                }
                if (member.$quotations != null) {
                    if (result.notes == null) result.notes = "";
                    for (var i = 0; i < member.$quotations.length; i++) {
                        var q = member.$quotations[i];
                        if (q != null && q.key != null) {
                            if (q.func == null) {
                                if (cls != null && cls.$notes != null && cls.$notes[q.key] != null) {
                                    result.notes += cls.$notes[q.key];
                                }
                            } else {
                                if (q.func.$notes != null && q.func.$notes[q.key] != null) {
                                    result.notes += q.func.$notes[q.key];
                                }
                            }
                        }
                    }
                }
                readParamInfo(member, "setter");
            }
            if (result.isinherited_set === false) result.isinherited = false;
            if (result.isinherited_get === false) result.isinherited = false;
            result.proto = "" + ((result.getproto)?"get:" + result.getproto:" ") + 
                                ((result.setproto)?"set:" + result.setproto:" ");
            if (result.isread && result.iswrite) {
                result.kind = "read/write";
            } else if (result.isread) {
                result.kind = "read";
            } else if (result.iswrite) {
                result.kind = "write";
            }
            if (failedProperty) {
                result.error = "A reserved name for a pseudo-property is used incorrectly.";
            }
        } else {
            member = (bStatic)?cls[method_or_prop]:cls.prototype[method_or_prop];
            if (BaseObject.is(member, "Initialize")) {
                result.kind = "field";
                result.isfield = true;
                readIntentInfo(member);
                if (!bStatic) {
                    result.isinherited = isInherited(method_or_prop,member);
                }
                result.hidden = member.$hidden;
                if (member.$isdeprecated) result.deprecated = true;
                if (member.$issealed) result.issealed = true;
                if (member.$isvirtual) result.virtual = true;
                if (member.$returns != null) result.returns = ((result.returns != null)?result.returns + member.$returns:member.$returns);
                if (member.$problem != null) result.problem = ((result.problem != null)?result.problem + member.$problem:member.$problem);
            } else if (typeof member == "function") {
                result.kind = "function";
                result.proto = extractProto(member);
                result.desc = "";
                if (!bStatic) {
                    result.isinherited = isInherited(method_or_prop,member);
                }
                if (member.$description != null) {
                    result.desc += member.$description;
                }
                if (member.$isdeprecated) result.deprecated = true;
                if (member.$issealed) result.issealed = true;
                if (member.$isvirtual) result.virtual = true;
                if (member.$returns != null) result.returns = ((result.returns != null)?result.returns + member.$returns:member.$returns);
                if (member.$problem != null) result.problem = ((result.problem != null)?result.problem + member.$problem:member.$problem);
                if (member.$remarks != null) {
                    if (result.remarks == null) result.remarks = "";
                    result.remarks += member.$remarks;
                }
                if (member.$quotations != null) {
                    if (result.notes == null) result.notes = "";
                    for (var i = 0; i < member.$quotations.length; i++) {
                        var q = member.$quotations[i];
                        if (q != null && q.key != null) {
                            if (q.func == null) {
                                if (cls != null && cls.$notes != null && cls.$notes[q.key] != null) {
                                    result.notes += cls.$notes[q.key];
                                }
                            } else {
                                if (q.func.$notes != null && q.func.$notes[q.key] != null) {
                                    result.notes += q.func.$notes[q.key];
                                }
                            }
                        }
                    }
                }
                result.hidden = member.$hidden;
                readParamInfo(member);
            } else {
                result.isfield = true;
                if (BaseObject.is(member, "Date")) {
                    result.type = "date";
                    result.defaultValue = member + "";
                    if (!bStatic) {
                        result.isinherited = isInherited(method_or_prop,member);
                    }
                } else if (BaseObject.is(member, "Array")) {
                    result.type = "array";
                    if (!bStatic) {
                        result.isinherited = isInherited(method_or_prop,member);
                    }
                    result.error = "Potential mistake. The array instance will be shared between the class instances";
                } else {
                    result.type = typeof(member);
                    if (!bStatic) {
                        result.isinherited = isInherited(method_or_prop,member);
                    }
                }
            }
        }
    } else if (cls != null && typeof cls == "function") {
        member = cls;
        result.kind = "function";
        result.proto = extractProto(member);
        result.desc = "";
        result.hidden = member.$hidden;
        if (member.$isdeprecated) result.deprecated = true;
        if (member.$returns != null) result.returns = ((result.returns != null)?result.returns + member.$returns:member.$returns);
        if (member.$problem != null) result.problem = ((result.problem != null)?result.problem + member.$problem:member.$problem);
        if (member.$description != null) {
            result.desc += member.$description;
        }
        if (member.$remarks != null) {
            if (result.remarks == null) result.remarks = "";
            result.remarks += member.$remarks;
        }
        if (member.$quotations != null) {
            if (result.notes == null) result.notes = "";
            for (var i = 0; i < member.$quotations.length; i++) {
                var q = member.$quotations[i];
                if (q != null && q.key != null) {
                    if (q.func == null) {
                        if (cls != null && cls.$notes != null && cls.$notes[q.key] != null) {
                            result.notes += cls.$notes[q.key];
                        }
                    } else {
                        if (q.func.$notes != null && q.func.$notes[q.key] != null) {
                            result.notes += q.func.$notes[q.key];
                        }
                    }
                }
            }
        }
        readParamInfo(member);
    }
    return result;
}
