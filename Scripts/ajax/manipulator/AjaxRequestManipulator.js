(function(){

    var AjaxBase = Class("AjaxBase"),
        IAjaxCoreKraft = Interface("IAjaxCoreKraft"),
        BKUrl = Class("BKUrl");

    function AjaxRequestManipulator(request, pipeline) { 
        AjaxBase.apply(this,arguments);
        this.$request = request;
        this.$pipeline = pipeline;
    }
    AjaxRequestManipulator.Inherit(AjaxBase, "AjaxRequestManipulator");

    AjaxRequestManipulator.prototype.url = function(url) {
        var bkurl = BKUrl.getBasePathAsUrl();
        if (typeof url == "string") {
            var match;
            if (match = /(?:^(post:)|(get:))(.*)/.exec(url)) {
                if (match[1]) {
                    this.$request.set_verb("POST");
                    url = match[3];
                } else {
                    this.$request.set_verb("GET");
                    url = match[3]
                }
            }
            if (!bkurl.set_nav(url)) {
                throw "Cannot construct the url.";
            }

        } else if (BaseObject.is(url, BKUrl)) {
            if (!bkurl.set_nav(url)) {
                throw "Cannot construct the url.";
            }
        }
        this.$request.set_url(bkurl);
        return this;
    }
    AjaxRequestManipulator.prototype.data = function(data) {
        this.$request.set_data(data);
        return this;
    }
    AjaxRequestManipulator.prototype.mixData = function(data) {
        var _old = this.$request.get_data();
        if (_old != null && typeof _old == "object") {
            this.$request.set_data(BaseObject.CombineObjects(_old, data));
        } else {
            this.$request.set_data(data);
        }
        return this;
    }
    AjaxRequestManipulator.prototype.query = function(idx, v) {
        this.$request.set_reqdata(idx, v);
        return this;
    }
    AjaxRequestManipulator.prototype.verb = function(v) { 
        this.$request.set_verb(v);
        return this;
    }
    AjaxRequestManipulator.prototype.priority = function(v) { 
        this.$request.set_priority(v);
        return this; 
    }

    //#region Attached info stuff

    AjaxRequestManipulator.prototype.attachInfo = function(type, data) { 
        this.$request.attachInfo(type, data);
        return this;
    }
    AjaxRequestManipulator.prototype.mixInfo = function(type, data) { 
        this.$request.mixInfo(type, data);
        return this;
    }

    //#endregion

    //#region CoreKraft attachments

    AjaxRequestManipulator.prototype.contentFlags = function(flags) { 
        if (typeof flags == "number") {
            flags = flags | 0xFFFF;
            this.$request.mixInfo(IAjaxCoreKraft,{ contentFlags: flags });
        } else {
            this.LASTERROR("CoreKraft content flags must be a number. Nothing was set.");
        }
        return this;
    }

    //#endregion

    //#region Sending the request

    AjaxRequestManipulator.prototype.send = function() {
        return this.$pipeline.ajaxSendRequest(this, this.$request);
    }

    //#endregion
})();