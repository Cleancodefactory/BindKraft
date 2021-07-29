(function() {

    var AjaxRequestPackerBase = Class("AjaxRequestPackerBase"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker");

    function AjaxRequestPackerSingleJson() {
        AjaxRequestPackerBase.apply(this,arguments);
        this.set_unpacker(this);
    }
    AjaxRequestPackerSingleJson.Inherit(AjaxRequestPackerBase, "AjaxRequestPackerSingleJson")
        .Implement(IAjaxResponseUnpacker);

        


    AjaxRequestPackerSingleJson.prototype.packRequests = function(requests) {
        if (BaseObject.is(requests, IAjaxRequest) || (Array.isArray(requests) && requests.length == 1 && BaseObject.is(requests[0],IAjaxRequest))) {
            return AjaxRequestPackerBase.prototype.packRequests.call(this, requests);
        }
        this.LASTERROR("packRequests works with single request only for this packer!");
        return null;
    }
    AjaxRequestPackerSingleJson.prototype.$packRequests = function(packedRequest) {
        var original = packedRequest.get_originalRequests()[0];
        packedRequest.set_reqdata(original.get_reqdata());
        packedRequest.set_cache(original.get_cache());
        if (original.get_verb() != null) {
            packedRequest.set_verb(original.get_verb());
        } else {
            if (original.get_data() != null) {
                packedRequest.set_verb("POST");
            } else {
                packedRequest.set_verb("GET");
            }
        }
        // Check the data
        var data = original.get_data();
        if (!this.$checkIfDataIsJSONCompatible(data)) return false;
        packedRequest.set_data(data);
        return true;
    }

    AjaxRequestPackerSingleJson.prototype.$checkIfDataIsJSONCompatible = function(data) {
        if (typeof data == "object") return true; // obejcts, arrays etc.
        return false;
    }
    //#region Waste
    /* this is too tricky - I'll decide later what to do with it
    AjaxRequestPackerSingleJson.prototype.$dataStatistics = function(data, statistics, level) {
        level = level || 0;
        if (statistics == null) { // root
            statistics = {
                types: {},
                levels: 0
            };
            if (typeof data == "object") {
                if (Array.isArray(data)) {
                    statistics.root = "array";
                } else {
                    statistics.root = "object";
                }
            } else {
                statistics.root = typeof data;
            }
        }
        if (level > statistics.levels) statistics.levels = level;
        
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                if (typeof data[i] == "object") {
                    this.$dataStatistics(data[i], statistics, level + 1);
                    
                }
            }
        } else if (typeof data == "object") {
            statistics.types["object"] = (statistics.types["object"] || 0) + 1;
        } else {
            statistics.types[typeof data] = (statistics.types[typeof data] || 0) + 1;
        }
    }
    */
    //#endregion

})();