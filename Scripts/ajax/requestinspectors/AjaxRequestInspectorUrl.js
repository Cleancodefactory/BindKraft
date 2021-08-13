(function(){

    var AjaxRequestInspectorBase = Class("AjaxRequestInspectorBase"),
    MiscellaneousFunctionLibrary = Class("MiscellaneousFunctionLibrary");

    function AjaxRequestInspectorUrl() {
        AjaxRequestInspectorBase.apply(this,arguments);

    }
    AjaxRequestInspectorUrl.Inherit(AjaxRequestInspectorBase,"AjaxRequestInspectorUrl")
        .ImplementProperty("server", new InitializeStringParameter("wildcards supported - pattern for the server name to accept", null), null, function(ov, nv) {
            if (typeof nv == "string" && nv.length > 0) {
                this.$reServer = MiscellaneousFunctionLibrary.regExpFromWildcards(nv.toLocaleLowerCase(), true);
            } else {
                this.$reServer = null;
            }
        })
        .ImplementProperty("port")
        .ImplementProperty("path", new InitializeStringParameter("wildcards supported - pattern for the path", null), null, function(ov, nv){
            if (typeof nv == "string" && nv.length > 0) {
                this.$rePath = MiscellaneousFunctionLibrary.regExpFromWildcards(nv.toLocaleLowerCase(), true);
            } else {
                this.$rePath = null;
            }
        });

    AjaxRequestInspectorUrl.prototype.$reServer = null;
    AjaxRequestInspectorUrl.prototype.$rePath = null;
    AjaxRequestInspectorUrl.prototype.inspectRequest = function(request) {
        var previousreview = request.getAttachedInfo(this.$__instanceId);
        var summary;
        summary = request.getAttachedInfo(this);
        if (summary == null) summary = this.analyseUrl(request.url);
        if (previousreview.passes) return summary;
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


})();