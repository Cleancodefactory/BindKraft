(function(){

    var AjaxRequestInspectorBase = Class("AjaxRequestInspectorBase"),
    MiscellaneousFunctionLibrary = Class("MiscellaneousFunctionLibrary");

    function AjaxRequestInspectorQuery() {
        AjaxRequestInspectorBase.apply(this,arguments);

    }
    AjaxRequestInspectorQuery.Inherit(AjaxRequestInspectorBase,"AjaxRequestInspectorQuery")
        .ImplementAccumulatingProperty("params", new InitializeObject("Empty carrier object for parameter defs"));

    AjaxRequestInspectorQuery.prototype.inspectRequest = function(request) {
        var previousreview = request.getAttachedInfo(this.$__instanceId);
        var summary;
        summary = request.getAttachedInfo(this);
        ////////////////////////////////////////////////////////////////
        if (summary == null) summary = this.analyseUrl(request.url);
        if (previousreview != null && previousreview.passes) return summary;
        if (this.$reServer != null ) {
            if (typeof summary.server == "string") {
                if (!this.$reServer.test(summary.server)) return null;
            } else {
                return null;
            }
        }
        if (this.$rePath != null ) {
            if (typeof summary.pathString == "string") {
                if (!this.$rePath.test(summary.pathString)) return null;
            } else {
                return null;
            }
        }
        request.mixInfo(this.$__instanceId,{ passes: true});
        return summary;
    }
    AjaxRequestInspectorQuery.prototype.analyseQuery = function(url) {
        // params contains the matched params, the root contains the summary
        var summary = { params: {}};
        if (this.$params == null || typeof this.$params != "object") {
            summary.paramConditions = 0;
            return summary;
        }
        var query = url.get_query();
        var vals;
        for (var k in this.$params) {
            vals = query.get(k);
            // TODO Decide on the syntax and implement.
        }
    }


})();