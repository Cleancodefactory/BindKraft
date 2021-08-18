(function(){

    var AjaxRequestInspectorBase = Class("AjaxRequestInspectorBase"),
    MiscellaneousFunctionLibrary = Class("MiscellaneousFunctionLibrary");

    /**
     * Checks the query string parameters of an URL. Currently only 1 occurrence of any parameter is allowed to
     * keep the client behavior in sync with the CoreKraft server.
     * Supports the following syntax per parameter:
     * (specs)regex
     *   specs:
     *      ? - optional
     *      ! - required
     *   regex: regex as string - it is up to the user to specify ^/$
     * Supports general options:
     *      strict - only the described parameters are allowed
     */
    function AjaxRequestInspectorQuery() {
        AjaxRequestInspectorBase.apply(this,arguments);

    }
    AjaxRequestInspectorQuery.Inherit(AjaxRequestInspectorBase,"AjaxRequestInspectorQuery")
        .ImplementAccumulatingProperty("params", new InitializeObject("Empty carrier object for parameter defs"), null, 
            function(v, idx, obj) {
                this.$rexes = {}; // Clear the compiled ones
            }
        )
        .ImplementProperty("strict", new InitializeBooleanParameter("Specifies if only the described parameters should exist on the request", false));

    AjaxRequestInspectorQuery.prototype.$rexes = new InitializeObject("Created regular expressions and options");
    AjaxRequestInspectorQuery.prototype.$reCondition = /^\((\!|\?)\)(.*)$/;
    /**
     * The form of the compiled condition is:
     * { required: true|false, regex: Regexpp }
     */
    AjaxRequestInspectorQuery.prototype.$compileCondition = function(paramName) {
        var condition = this.$params[paramName];
        if (typeof condition === "string") {
            var match = reCondition.exec(condition);
            if (match != null) {
                var req = match[1];
                var rex = match[2];
                this.$rexes[paramName] = { required: (req == "!"), regex: new RegExp(rex) };
                return this.$rexes[paramName];
            } else {
                this.LASTERROR("Failed to compile condition for parameter: " + paramName, "$compileCondition");
                return null;
            }
        } else {
            // No condition specified
            return null;
        }
    }
    AjaxRequestInspectorQuery.prototype.$getCompiledConditions = function(paramName) {
        if (this.$rexes[paramName] != null) return this.$rexes[paramName];
        return this.$compileCondition(paramName);
    }

    AjaxRequestInspectorQuery.prototype.inspectRequest = function(request) {
        var previousreview = request.getAttachedInfo(this.$__instanceId);
        var summary;
        summary = request.getAttachedInfo(this);
        if (summary == null) summary = this.analyseUrl(request.url);
        if (previousreview != null && previousreview.passes) return summary;
        //if ()
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
        var vals, val, cond, countConditions = 0;
        for (var k in this.$params) {
            countConditions ++;
            cond = this.$getCompiledConditions(k);
            vals = query.get(k);
            if (vals != null) {
                if (vals.length > 1) {
                    this.LASTERROR("More than a single occurrence of the query parameter " + k);
                    summary.params[k] = null;
                } else if (vals.length == 1) {
                    val = vals[0];
                    if (cond != null) {
                        if (cond.regex.test(val)) {
                            // Condition passed
                            summary.params[k] = { required: cond.required, regex: true, exists: true };
                        } else {
                            // Condition not passed
                            summary.params[k] = { required: cond.required, regex: false, exists: true };
                        }
                    } else {
                        this.LASTERROR("A condition for the query parameter " + k + " is specified, but cannot be compiled.");
                        summary.params[k] = { required: cond.required, regex: false, exists: true, error: true };
                    }
                } else {
                    summary.params[k] = { required: cond.required, regex: false, exists: false, error: false };
                }
            } else {
                // No query parameter with that name
                summary.params[k] = { required: cond.required, regex: false, exists: false, error: false };
            }
        } 
        summary.paramConditions = countConditions;
    }


})();