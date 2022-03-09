(function() {

    var ITreeStatesSerializer = Interface("ITreeStatesSerializer"),
        BaseObject = Class("BaseObject"),
        TreeStates = Class("TreeStates");

    function TreeStatesStringSerializer() {
        BaseObject.apply(this, arguments);
    }
    TreeStatesStringSerializer.Inherit(BaseObject,"TreeStatesStringSerializer")
        .Implement(ITreeStatesSerializer)
        .ImplementProperty("split", new Initialize("string or regular expression","/"))
        .ImplementProperty("delimiter", new InitializeStringParameter("delimiter between values in the same node", ":"));

    
    TreeStatesStringSerializer.prototype.$valToString = function(v,shortSyntax) {
        var type = TreeStates.ValueType(v);
        if (shortSyntax) {
            switch (type) {
                case "num":
                    return v.toString(10);
                case "string":
                    return BKUrlObjectBase.encodeURIComponentRFC3986(v);
                case "bool":
                    return (v?"1":"0");
                case "null":
                    return "null";
                default:
                    throw new Error("Non-serializable value");
                    
            }
        } else {
            switch (type) {
                case "num":
                    return "d" + v;
                case "string":
                    return "s" + BKUrlObjectBase.encodeURIComponentRFC3986(v);
                case "bool":
                    return (v?"b1":"b0");
                case "null":
                    return "n";
                default:
                    throw new Error("Non-serializable value");
                    
            }
        }
    }
    TreeStatesStringSerializer.prototype.$stringToVal = function(v,shortSyntax) {
        var s, v = BKUrlObjectBase.decodeURIComponentRFC3986(v);
        if (shortSyntax) {
            if (/^(\+|-)?\d+$/.test(v)) {
                return parseInt(v, 10);
            } else if (/^(\+|-)?\d+(.\d+)$/.test(v)) {
                return parseFloat(v);
            } else if (v == "null") {
                return null;
            } else {
                return v;
            }
        } else if (v.length > 0) {
            switch (v.charAt(0)) {
                case "d":
                case "b":
                    if (/^(\+|-)?\d+$/.test(v)) {
                        return parseInt(v.slice(1), 10);
                    } else {
                        return parseFloat(v.slice(1));
                    }
                case "s":
                    return v.slice(1);
                case "n":
                    return null;
            } 
        }
    }

    TreeStatesStringSerializer.prototype.parseToLinear = function(input, options) { 
        var me = this;
        if (typeof input === "string") {
            var linear = [], line;
            var parts = input.split("/");
            parts = parts.Select(function(i,p) {
                if ((i == 0 || i == this.length - 1) && p.length == 0) return null;
                return p;
            });
            if (parts != null && parts.length > 0) {
                for (var i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    if (part.indexOf(":") >= 0) {
                        line = part.split(":").Select(function(i, p) {
                            return me.$stringToVal(p);
                        });
                        linear.push(line);
                    } else {
                        linear.push([this.$stringToVal(part, true)]);
                    }
                }
            }
            return linear;
        } else if (input == null) {
            return []; // Empty linear
        }
        return null;
    }
    TreeStatesStringSerializer.prototype.encodeFromLinear = function(base, linear) {
        var result = base || "";
        for (var i = 0; i < linear.length; i++) {
            var line = linear[i];
            if (Array.isArray(line)) {
                result += "/";
                if (line.length > 1) {
                    for (var j = 0;j < line.length;j++) {
                        if (j > 0) result += ":";
                        result += this.$valToString(line[j]);
                    }
                } else {
                    result += this.$valToString(line[0], true);
                    
                }
            } else {
                throw new Error("Incorrect entry in linear");
            }
        }
        return result;
    }

})();