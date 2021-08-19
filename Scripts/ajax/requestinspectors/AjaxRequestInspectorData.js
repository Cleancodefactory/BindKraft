(function() {

    function AjaxRequestInspectorData() {
        AjaxRequestInspectorBase.apply(this, arguments);
    }
    AjaxRequestInspectorData.Inherit(AjaxRequestInspectorBase, "AjaxRequestInspectorData")
        .ImplementProperty("hasbinary", new Initialize("Null - no matter, true - contains, false - does not contain.", null))
        .ImplementProperty("hasvaluearrays", new Initialize("Null - no matter, true - contains, false - does not contain.", null))
        .ImplementProperty("hasbinaryarrays", new Initialize("Null - no matter, true - contains, false - does not contain.", null))
        .ImplementProperty("hasdates", new Initialize("Null - no matter, true - contains, false - does not contain.", null))
        .ImplementProperty("maxdepth", new Initialize("Null - no matter, number - the maximum depth of the data.", null))
        .ImplementProperty("nodata", new Initialize("Null - no matter, true - has no data, false - has some data.", null));

    AjaxRequestInspectorData.prototype.inspectRequest = function(request) {
        if (BaseObject.is(request,"IAjaxRequest")) {
            var summary, previousreview = request.getInstanceInfo(this);
            if (previousreview != null) {
                if (!previousreview.passes) return null;
                summary = request.getAttachedInfo(this);
                return summary;
            }
            var data = request.get_data();
            if (data != null) {
                summary = this.analyseData(data);
                if (summary == null) return this$.inspectRequest(request, null, false);
                if (this.get_hasbinary() == true && !summary.hasbinary) return this.$inspectResult(request, summary, false);
                if (this.get_hasbinary() == false && summary.hasbinary) return this.$inspectResult(request, summary, false);
                if (this.get_hasvaluearrays() == true && !summary.hasvaluearrays) return this.$inspectResult(request, summary, false);
                if (this.get_hasvaluearrays() == false && summary.hasvaluearrays) return this.$inspectResult(request, summary, false);
                if (this.get_hasbinaryarrays() == true && !summary.hasbinaryarrays) return this.$inspectResult(request, summary, false);
                if (this.get_hasbinaryarrays() == false && summary.hasbinaryarrays) return this.$inspectResult(request, summary, false);
                if (this.get_hasdates() == true && !summary.hasdates) return this.$inspectResult(request, summary, false);
                if (this.get_hasdates() == false && summary.hasdates) return this.$inspectResult(request, summary, false);
                if (this.get_maxdepth() != null && summary.depth > this.get_maxdepth()) return this.$inspectResult(request, summary, false);
                // If all this is passed - the request qualifies
                return this.$inspectResult(request, summary, true);
            } else {
                if (this.get_nodata() == null || this.get_nodata()) {
                    // ok
                    summary =  {
                        hasbinary: false,
                        depth: 0, 
                        hasvaluearrays: false,
                        hasbinaryarrays: false,
                        hasdates: false,
                        nodata: true
                    };
                    return this.$inspectResult(request, summary, true);
                } else {
                    // Some data required
                    return this.$inspectResult(request, null,false);
                }
            }
            
        }
        return null; // Wrong argument
    }
    AjaxRequestInspectorData.prototype.$inspectResult = function(request, summary, passes) {
        if (passes) {
            request.mixInstanceInfo(this, { passes: true});
            if (summary != null) request.mixInfo(this, summary);
            return summary;
        } else {
            request.mixInstanceInfo(this, { passes: false });
            return null;
        }
    }

})();