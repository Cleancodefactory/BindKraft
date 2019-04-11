


/*CLASS*/
function DialogLink() {
    Base.apply(this, arguments);
    this.on("click", this.onClick);
    this.on("keypress", this.onKeypress);
}
DialogLink.Inherit(Base, "DialogLink");
DialogLink.ImplementProperty("dialogHeight", new InitializeNumericParameter("Height", 400));
DialogLink.ImplementProperty("dialogWidth", new InitializeNumericParameter("Width", 400));
DialogLink.ImplementProperty("resizable", new InitializeBooleanParameter("Resizable", true));
DialogLink.prototype.set_baseurl = function (url) {
    this.$baseurl = url;
};
DialogLink.prototype.get_baseurl = function () {
    return this.$baseurl;
};
DialogLink.prototype.get_finalauthority = function () {
    return this.$finalauthority;
};
DialogLink.prototype.set_finalauthority = function (p) {
    this.$finalauthority = p;
};
DialogLink.ImplementIndexedProperty("parameters", new InitializeObject("Parameters by name"));
DialogLink.prototype.openedevent = new InitializeEvent("Informs handlers that the link was successfully opened");
DialogLink.prototype.get_url = function () {
    var url = this.get_baseurl();
    if (url != null) {
        var p = this.get_parameters();
        if (p != null && typeof p == "object") {
            for (var n in p) {
                if (n.indexOf("__") == 0) {
                    url += "/" + p[n];
                } else {
                    if (url.indexOf("?") >= 0) {
                        url += "&" + n + "=" + ((p[n] != null) ? p[n] : "");
                    } else {
                        url += "?" + n + "=" + ((p[n] != null) ? p[n] : "");
                    }
                }
            }
        }
    }
    return url;
};
DialogLink.prototype.openDialog = function (url) {
    var dlg = new DialogHelper();
    if (this.$finalauthority == "true") {
        dlg.$isFinalAuthority = true;
    }
    dlg.showModal({ url: url, dialogHeight: this.get_dialogHeight(), dialogWidth: this.get_dialogWidth(), parent: this, resizable: this.get_resizable() });
};
DialogLink.prototype.onClick = function () {
    var url = this.get_url();
    if (url != null) {
        this.openDialog(url);
        this.openedevent.invoke(this, url);
    }
};

DialogLink.prototype.onKeypress = function (e) {
    if (e.which == 13 || e.which == 32) {
        var url = this.get_url();
        if (url != null) {
            this.openDialog(url);
            this.openedevent.invoke(this, url);
        }
    }
};