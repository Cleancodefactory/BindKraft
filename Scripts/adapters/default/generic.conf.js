


// This file must be included after client.view.generic

//GenericViewBaseEx.$reUrlHashPattern = /(package\/[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})/i;
GenericViewBaseEx.$reUrlHashPattern = /(?:package\/((?:[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})|(?:name-[a-zA-Z0-9_\-]+)))/i;
// GenericViewBaseEx.$reUrlHashPatternPost = /(package\/store\/)/i;
GenericViewBaseEx.$reUrlHashPatternPost = /(package\/store\/)((?:[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})|(?:name-[a-zA-Z0-9_\-]+))/i;
GenericViewBaseEx.prototype.hashKeyOfUrl = function(url) {
    // The this in this method is the class definition not the class instance !!! See the notes about the PSupportsRequestHash Interface
    if (url != null) {
        var m;
        if (BaseObject.is(url, "string")) {
            m = GenericViewBaseEx.$reUrlHashPattern.exec(url);
            if (m != null) return m[1];
        } else if (url.url != null) {
            var u = BaseObject.ajaxCleanURLForHashOperations(url.url);
            if (url.type == "POST") {
                m = GenericViewBaseEx.$reUrlHashPatternPost.exec(u);
                if (m != null && m[2] != null && m[2].length > 0) {
                    return ("package/" + m[2]);
                } else {
                    if (m != null && url.data != null && url.data._metaData != null && url.data._metaData.packageid != null) {
                        // return (m[1] + url.data._metaData.packageid);
                        // TODO: Change this to package name!!!
                        return ("package/" + url.data._metaData.packageid);
                    }
                }
            } else {
                m = GenericViewBaseEx.$reUrlHashPattern.exec(u);
                if (m != null) return m[1];
            }
        }
    }
    return null;
};
GenericViewBaseEx.prototype.serverStoreData = function(data, pathIn, callback, callbackFailure, sync, failonoperations) { // The 4-th arg failure callback is optional
    var d;
    if (data == null) {
        d = this.get_data();
    } else {
        d = data;
    }
    var path = pathIn;
    var getparams = null;
    if (pathIn != null && typeof pathIn == "object") {
        path = pathIn.path;
        getparams = pathIn.params;
    }
    var pid;
    var dc = this.get_data();
    if (dc._metaData != null && dc._metaData.packageid != null) {
        pid = dc._metaData.packageid;
    } else {
        alert("Package id cannot be determined from _metaData");
        return;
    }
    var url = "package/store/" + pid;
    if (path != null && path.length > 0) url += "/" + path;

    this.ajax({
        url: url,
        type: "POST",
        dataType: 'xml', // we expect data and control notifications packed in xml
        contentType: "application/json; charset=utf-8", // we aresending stringified json as post body
        data: d,
        cache: false,
        getparams: getparams,
        success: function(result) {
            if (result.status.issuccessful) {
                callback.call(this, result.data, path);
            } else {
                if (callbackFailure != null) {
                    // note: please do not optimize these lines, they are this way for clarity
                    if (callbackFailure.call(this, result.status, path) === false) {
                        // Do nothing
                    } else {
                        Messenger.Default.post(new WorkspaceNotificationMessage("AJAX Error", "AJAX Error", "Operation failure reported: " + result.status.message, true));
                    }
                } else {
                    Messenger.Default.post(new WorkspaceNotificationMessage("AJAX Error", "AJAX Error", "Operation failure reported: " + result.status.message, true));
                }
            }
        },
        async: !sync
    }, "xml");
};