(function(){

    var AjaxRequestInspectorBase = Class("AjaxRequestInspectorBase"),
    MiscellaneousFunctionLibrary = Class("MiscellaneousFunctionLibrary");

    /**
     * Inspects by URL specifics.
     * Null value of a property means the condition given by it will not be checked.
     * 
     * get/set_server - server pattern (Typical dir pattern *?)
     * get/set_path - path pattern (typical dir pattern *?)
     * get/set_noserver - if true, catches ULS having no authority part.
     * get/set_port - not implemented yet.
     */
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
        .ImplementProperty("noserver", new InitializeBooleanParameter("if true allows virtual URL without scheme and authority.", false))
        .ImplementProperty("port")
        .ImplementProperty("path", new InitializeStringParameter("wildcards supported - pattern for the path", null), null, function(ov, nv){
            if (typeof nv == "string" && nv.length > 0) {
                this.$rePath = MiscellaneousFunctionLibrary.regExpFromWildcards(nv.toLocaleLowerCase(), true);
            } else {
                this.$rePath = null;
            }
        });

    //#region Static constructors
    /**
     * Filters all the requests to the app server
     */
    AjaxRequestInspectorUrl.AppPathInspector = function() {
        var inspector = new AjaxRequestInspectorUrl();
        // TODO: Complete this
        var url = BKUrl.getBasePathAsUrl();
        url.get_authority()
        inspector.set_server(this.$reServer);
        BKUrl.baseURL();
    }
    //#endregion

    AjaxRequestInspectorUrl.prototype.$reServer = null;
    AjaxRequestInspectorUrl.prototype.$rePath = null;
    AjaxRequestInspectorUrl.prototype.inspectRequest = function(request) {
        var previousreview = request.getInstanceInfo(this);
        var summary;
        summary = request.getAttachedInfo(this);
        if (summary == null) summary = this.analyseUrl(request.url);
        if (previousreview != null && previousreview.passes) return summary;
        if (this.$reServer != null ) {
            if (typeof summary.server == "string") {
                if (!this.$reServer.test(summary.server)) return null;
            } else {
                if (!this.get_noserver()) return null;
            }
        }
        if (this.$rePath != null ) {
            if (typeof summary.pathString == "string") {
                if (!this.$rePath.test(summary.pathString)) return null;
            } else {
                return null;
            }
        }
        request.mixAttachedInfo(this, summary);
        request.mixInstanceInfo(this,{ passes: true});
        return summary;
    }


})();