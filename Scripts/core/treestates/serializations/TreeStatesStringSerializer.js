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
                return v + "";
            case "string":
                
        }
    }

    TreeStatesStringSerializer.prototype.parseToLinear = function(input, options) { 
        if (typeof input === "string") {

        } else if (input == null) {
            return []; // Empty linear
        }
        return null;
    }
    TreeStatesStringSerializer.prototype.encodeFromLinear = function(base, linear) {

    }

})();