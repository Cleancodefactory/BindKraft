(function() {

    var IAjaxRequestInspector = Interface("IAjaxRequestInspector"),
        AjaxBase = Class("AjaxBase");

    /**
     * Base class for request inspectors.
     * Contains helper routines for various tasks that many inspectors may want to implement. all of them are named as analyse***.
     * As a rule the helper routines return summary information about the request or null if they can't work with it.
     *
     * The request inspectors do not manage requests in any way. they are responsible only for identifying them and extracting information about them
     * in more compact and easy to use form (easy for management logic)
     */
    function AjaxRequestInspectorBase() {
        AjaxBase.apply(this,arguments);
    }
    AjaxRequestInspectorBase.Inherit(AjaxBase, "AjaxRequestInspectorBase")
        .Implement(IAjaxRequestInspector);

    AjaxRequestInspectorBase.prototype.inspectRequest = function(request) {
        throw "Abstract inspectRequest is not implemented";
    }

    //#region Tools for use in inherited inspectors (if and when necessary)
    AjaxRequestInspectorBase.prototype.getSummary = function(patch) {
        var summary = {
            server: null,
            port: null,
            path: [],
            pathString: null,
            hasbinary: false,
            depth: 0, // Object depth
            hasvaluearrays: false,
            hasbinaryarrays: false,
            hasdates: false
        }
        if (typeof patch == "object") {
            return BaseObject.CombineObjects(summary, patch);
        }
        return summary;
    }
    /**
     * Maps the URL over the base URL, so the URL actually analysed always has scheme and authority.
     * Returns an object with general characteristics of the URL.
     * 
     * @param _url {string|IBKUrlObject} - The URL to analyse.
     * @returns {object}
     */
    AjaxRequestInspectorBase.prototype.analyseUrl = function(_url) {
        var url = BKUrl.getBasePathAsUrl();
        var summary = {
            server: null,
            port: null,
            path: [],
            pathString: null
        }
        if (typeof _url == "string" || BaseObject.is(_url, "IBKUrlObject")) {
            if (!url.set_nav(_url)) {
                this.LASTERROR("Cannot project '" + _url + "' onto base url", "analyseUrl");
                return null;
            }
        }
        var auth = url.get_authority();
        if (auth != null) {
            summary.server = auth.get_host();
            summary.port = auth.get_port();
        } else {
            this.LASTERROR("Unexpected error - no authority information in the url:" + url, "analyseUrl");
            return null;
        }
        var path = url.get_path();
        if (path != null) {
            summary.path = path.get_pathnamesegements();
            summary.pathString = path.toString();
        }
        return this.getSummary(summary);
    }

    AjaxRequestInspectorBase.prototype.analyseData = function(data) {
        var summary = {
            hasbinary: false,
            depth: 0, // Object depth
            hasvaluearrays: false,
            hasbinaryarrays: false,
            hasdates: false
        }
        this.$analyseData(data, summary, 0)
        return this.getSummary(summary);
    }
    AjaxRequestInspectorBase.prototype.$analyseData = function(data, summary, level) {
        var v;
        if (summary.depth < level) summary.depth = level;
        if (window.FileList && data instanceof FileList) {
            for (var i = 0; i < data.length; i++) {
                v = data[i];
                if (window.Blob && v instanceof Blob) {
                    summary.hasbinary = true;
                    summary.hasbinaryarrays = true;
                    continue;
                }
            }
        } else if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                v = data[i];
                t = typeof v;
                switch (t) { // Collect what we can here
                    case "number":
                    case "string":
                    case "boolean":
                        summary.hasvaluearrays = true;
                    continue;
                }
                if (window.Blob && v instanceof Blob) {
                    summary.hasbinary = true;
                    summary.hasbinaryarrays = true;
                    continue;
                }
                if (v instanceof Date) {
                    summary.hasdates = true;
                    continue;
                }
                if (typeof v == "object") {
                    this.$analyseData(v, summary, level + 1);
                    continue;
                }
                // Everything else is omitted.
            }
        } else if (typeof data == "object" && data != null) { // Work it as plain object, but not require it to be plain too much
            for (k in data) {
                if (k.length == 0) continue;
                if (data.hasOwnProperty(k)) {
                    v = data[k];
                    if (window.Blob && v instanceof Blob) {
                        summary.hasbinary = true;
                        continue;
                    }
                    if (v instanceof Date) {
                        summary.hasdates = true;
                        continue;
                    }
                    if (typeof v == "object") {
                        this.$analyseData(v, summary, level + 1);
                        continue;
                    }
                }
            }
        }
    }
    //#endregion
})();