(function() {

    var ITreeStatesSerializer = Interface("ITreeStatesSerializer"),
        BaseObject = Class("BaseObject")
        TreeStates = Class("TreeStates");

    function TreeStatesStringSerializer() {
        BaseObject.apply(this, arguments);
    }
    TreeStatesStringSerializer.Inherit(BaseObject,"TreeStatesStringSerializer")
        .Implement(ITreeStatesSerializer)
        .ImplementProperty("split", new Initialize("string or regular expression","/"))
        .ImplementProperty("delimiter", new InitializeStringParameter("delimiter between values in the same node", ":"));

    
    TreeStatesStringSerializer.prototype.$valToString = function(v) {
        var type = TreeStates.ValueType(v);
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

    TreeStatesStringSerializer.prototype.parseToLinear = function(input, options) { 
        if (typeof input === "string") {
            var linear = [], line;
            var parts = input.split("/");
            if (parts != null && parts.length > 0) {
                for (var i = 0; i < parts.length; i++) {
                    var arr = parts[i];
                }
            }
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
                for (var j = 0;j < line.length;j++) {
                    if (j > 0) result += ":";
                    result += this.$valToString(line[j]);
                }
            } else {
                throw new Error("Incorrect entry in linear");
            }
        }
        return result;
    }

})();