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
     *      strict - All the parameters must be described. Any additional query string parameters cause failure.
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
        var previousreview = request.getInstanceInfo(this);
        var _summary;
        if (previousreview != null) {
            if (previousreview.passes) {
                return { query: true };// The actual data for the outside world
            } else {
                return null; // Checked and failed
            }
        }
        _summary = request.getAttachedInfo(this);
        if (_summary == null) {
            _summary = this.$analyseUrl(request.get_url());
            if (_summary != null) {
                request.attachInfo(this, _summary); // Save the analysis for the next time
            }
        }
        if (_summary != null) {
            // Check if the conditions are ok
            if (!this.$checkAnalysis(_summary)) {
                request.mixInstanceInfo(this, { passes: false });
                return null;
            }
            // Now check strict if necessary
            if (this.get_strict()) {
                var url = request.get_url();
                if (BaseObject.is(url, "BKUrl" )) {
                    var qry = url.get_query();
                    if (qry != null) {
                        var keys = qry.keys();
                        for (var i = 0; i < keys.length; i++) {
                            if (keys[i] in this.$params) continue;
                            // Strict requirements not met.
                            request.mixInstanceInfo(this, { passes: false });
                            return null;
                        }
                    } else {
                       // This should be eliminated by checkAnalysis
                       request.mixInstanceInfo(this, { passes: false });
                       return null;
                    }
                } else {
                    request.mixInstanceInfo(this, { passes: false });
                    return null;
                }
            }
            request.mixInstanceInfo(this, { passes: true });
            return { query: true };
        } else {
            request.mixInstanceInfo(this, { passes: false });
            return null;
        }
    }
    AjaxRequestInspectorQuery.prototype.$checkAnalysis = function(summary) {
        if (summary != null && summary.paramConditions > 0) {
            if (summary.params != null) {
                var countConditions = 0;
                var condition;
                for (var k in summary.params) {
                    condition = summary.params[k];
                    if (condition == null) {
                        return false; // null condition is a condition that failed critically (e.g. more than 1 value bound to the name)
                    } else {
                        if (condition.required && !condition.exists) return false; // Missing required parameter
                        if (condition.exists && !condition.regex) return false; // Does not match 
                    }
                }
                return true;
            }
            return false; // Discrepancy - count is greater than 0, but no conditions are checked.
        } else {
            return true; // No conditions - treat as Ok.
        }
    }
    /**
     * Returns an object:
     * {
     *   paramConditions: <number of conditions>,
     *   params: {
     *      // Multiple
     *      <paramname>: { required: true|false, regex: true|false, exists: true|false }
     *   }
     * }
     */
    AjaxRequestInspectorQuery.prototype.$analyseQuery = function(url) {
        // params contains the matched params, the root contains the summary
        if (!BaseObject.is(url, "BKUrl")) return null;
        var summary = { params: {}, paramConditions: 0};
        if (this.$params == null || typeof this.$params != "object") {
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