(function() {
    function AjaxRequestInspectorBase() {
        AjaxBase.apply(this,arguments);
    }
    AjaxRequestInspectorBase.Inherit(AjaxBase, "AjaxRequestInspectorBase")
        .Implement(IAjaxRequestInspector);

    AjaxRequestInspector.prototype.inspectRequest = function(request) {
        throw "Abstract inspectRequest is not implemented";
    }

    //#region Tools for use in inherited inspectors (if and when necessary)
    AjaxRequestInspector.prototype.analyseData = function(data) {
        var summary = {
            hasbinary: false,
            depth: 0, // Object depth
            hasvaluearrays: false,
            hasbinaryarrays: false,
            hasdates: false
        }
        this.$analyseData(data, summary, 0)
        return summary;
    }
    AjaxRequestInspector.prototype.$analyseData = function(data, summary, level) {
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