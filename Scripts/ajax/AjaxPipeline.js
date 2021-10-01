
(function(){


    var IAjaxProgressQueue = Interface("IAjaxProgressQueue"),
        AjaxRequest = Class("AjaxRequest"),
        AjaxSendQueue = Class("AjaxSendQueue");

    /**
     * This is a class intended for construction of a pipeline. In most cases a single pipeline for the system should be created,
     * but there is the possibility for more - app specific, task specific etc.
     * 
     * - 1 send queue - argument or AjaxSendQueue.Default()
     * - 1 carrier - self created (AjaxCarrier)
     * ? 1 progress queue - self created (AjaxProgressQueue)
     */
    /*
    function AjaxPipeline(sendQueue, useProgressQueue) {
        BaseObject.apply(this, arguments);
        if (BaseObject.is(sendQueue, "IAjaxSendQueue")) { 
            this.$sendqueue = sendQueue;
        } else if (sendQueue === true) {
            this.$sendqueue = new AjaxSendQueue();
        } else {
            this.$sendqueue = AjaxSendQueue().Default();
        }
        this.$carrier = new AjaxCarrier();
    }*/
    function AjaxPipeline() {
        BaseObject.apply(this, arguments);
    }
    AjaxPipeline.Inherit(BaseObject, "AjaxPipeline");

    AjaxPipeline.prototype.$carriers = new InitializeArray("All the carriers are registered here");
    AjaxPipeline.prototype.get_carrier = function(idx) { 
        if (idx >= 0 && idx < this.$carriers.length) {
            return this.$carriers[idx];
        }
        return null;
    };
    AjaxPipeline.prototype.findCarrier = function(name_or_callback) {
        if (typeof name_or_callback == "string") {
            return this.$carriers.FirstOrDefault(function(idx, carr) {
                if (carr.get_name() == name_or_callback) return carr;
                return null;
            });
        } else if (BaseObject.isCallback(name_or_callback)) {
            return this.$carriers.FirstOrDefault(function(idx, carr) {
                if (BaseObject.callCallback(name_or_callback, carr)) return carr;
                return null;
            });
        }
    }
    AjaxPipeline.prototype.addCarrier = function (v) { 
        if (BaseObject.is(v, "IAjaxCarrier")) {
            this.$carriers.push(v);
        } else {
            throw "The argument is not IAjaxCarrier";
        }
    }
    AjaxPipeline.prototype.removeCarrier = function (cr) {
        this.$carriers.Delete(function(idx, carr) {
            if (carr == cr) return true;
            if (BaseObject.isCallback(cr) && BaseObject.callCallback(cr, carr)) return true;
            return false;
        })
    }

    //#region Runners
    /**
     * Produces tasks for all the carriers, so that they can check the send queue.
     * // TODO This may need refactoring to make sure the tasks produced are not too many at once.
     */
    AjaxPipeline.prototype.asyncRunCarriers = function () {
        var me = this;
        this.callAsync(function(){
            if (me.$carriers != null && me.$carriers.length > 0) {
                me.$carriers.Each(function(idx, carrier){
                    carrier.asyncRun();
                });
            }
        });
    }
    AjaxPipeline.prototype.asyncPushCarriers = function () {
        var me = this;
        this.callAsync(function(){
            if (me.$carriers != null && me.$carriers.length > 0) {
                me.$carriers.Each(function(idx, carrier){
                    carrier.asyncPush();
                });
            }
        });
    }

    //#region Auto running carriers
    AjaxPipeline.prototype.$autorun = 0;
    AjaxPipeline.prototype.get_autorun = function() { 
        return this.$autorun;
    }
    AjaxPipeline.prototype.set_autorun = function(v) { 
        this.discardAsync("run");
        if (v == null || v == 0) {
            this.$autorun = 0;
            return this;
        }
        if (v > 0 && v < 3600000) {
            if (v < 100) v = 100;
            if (v > 3600000) v = 3600000;
            this.$autorun = v;
        }
        if (this.$autorun > 0) {
            this.$rerun();
        }
        return this;
    }
    AjaxPipeline.prototype.$rerun = function() { 
        this.asyncRunCarriers();
        if (this.$autorun > 0) {
            this.async(this.$rerun).key("run").after(this.$autorun).execute();
        }
        return this;
    }
    //#endregion auto running carriers

    //#region Auto pushing senders carriers
    AjaxPipeline.prototype.$autopush = 0;
    AjaxPipeline.prototype.get_autopush = function() { 
        return this.$autopush;
    }
    AjaxPipeline.prototype.set_autopush = function(v) { 
        this.discardAsync("run");
        if (v == null || v == 0) {
            this.$autopush = 0;
            return this;
        }
        if (v > 0 && v < 3600000) {
            if (v < 100) v = 100;
            if (v > 3600000) v = 3600000;
            this.$autopush = v;
        }
        if (this.$autopush > 0) {
            this.$repush();
        }
        return this;
    }
    AjaxPipeline.prototype.$repush = function() { 
        this.asyncRunCarriers();
        if (this.$autopush > 0) {
            this.async(this.$repush).key("push").after(this.$autopush).execute();
        }
        return this;
    }
    //#endregion auto running carriers

    //#endregion

    AjaxPipeline.prototype.$sendqueue = null;
    AjaxPipeline.prototype.get_sendqueue = function(){
        return this.$sendqueue;
    }
    AjaxPipeline.prototype.set_sendqueue = function(v) {
        if (v == null || BaseObject.is(v, "IAjaxSendQueue")) {
            this.$sendqueue = v;
        }
    }
    /**
     * Creates a very own send queue for tt pipeline.
     */
    AjaxPipeline.prototype.createSendQueue = function() { 
        this.set_sendqueue(new AjaxSendQueue());
    }

    //#region Sending - private part

    AjaxPipeline.prototype.$enqueueRequest = function(req, priority) {
        var sq = this.get_sendqueue();
        if (BaseObject.is(sq, "IAjaxSendQueue")) {
            var bresult = sq.enqueueRequest(req, priority || 0);
            this.asyncRunCarriers();
            return bresult;
        }
        return false;
    }
    /**
     * Checks for post: get: in the beginning of the url and sets the verb of the request if one is present.
     * @returns {string} returns the url stripped (clean). 
     */
    AjaxPipeline.prototype.$checkExplicitVerb = function(url, request) {
        var match;
        if (match = /(?:^(post:)|(get:))(.*)/.exec(url)) {
            if (match[1]) {
                request.set_verb("POST");
            } else {
                request.set_verb("GET");
            }
            return match[3];
        } else {
            return url; // no need to touch the request.
        }
    }

    AjaxPipeline.prototype.$ajaxSendRequest = function(request, callback) {
        request.completeRequest = function(response) {
            if (BaseObject.is(response, "IAjaxResponse")) {
                response.set_request(request);
                BaseObject.callCallback(callback, response);
            } else { // The spice must flow
                BaseObject.callCallback(callback, new AjaxErrorResponse("Invalid response received from infrastructure."));
            }
        }
        return this.$enqueueRequest(request);
    }
    AjaxPipeline.prototype.$ajaxSendRequestOp = function(request) {
        var op = new Operation();
        if (!this.$ajaxSendRequest(request, function (response) {
            if (response.get_success()) {
                op.CompleteOperation(true, response);
            } else {
                op.CompleteOperation(false, response.get_message());
            }
        })) {
            op.CompleteOperation(false, "Cannot schedule the request.");
        };
        return op;
    }

    AjaxPipeline.prototype.$ajaxSendRequestRaw = function(owner, url, data, callback) {
        // Build a request ourselves
        if (!BaseObject.isCallback(callback)) return false;
        var request = new AjaxRequest(owner);
        var bkurl = BKUrl.getBasePathAsUrl();
        if (typeof url == "string") url = this.$checkExplicitVerb(url, request);
        if (typeof url == "string" || BaseObject.is(url, "BKUrl")) {
            if (!bkurl.set_nav(url)) request.set_constructionError("Cannot determine the url") ;
        } else {
            return false; // Very deep internal error - if this problem occurs there will be much more consequences.
        } 
        request.set_url(bkurl);
        if (data != null) {
            request.set_data(data);
        }
        return this.$ajaxSendRequest(request, callback);
    }
    AjaxPipeline.prototype.$ajaxSendRequestRawOp = function(owner, url, data) {
        var op = new Operation();
        if (!this.$ajaxSendRequestRaw(owner, url, data, function(response) {
            if (response.get_success()) {
                op.CompleteOperation(true, response);
            } else {
                op.CompleteOperation(false, response.get_message());
            }
        })) {
            op.CompleteOperation(false,"Cannot schedule the request.");
        }
        return op;
    }

    

    //#endregion Sending - private part

    //#region Sending - public methods

    //#endregion Sending - public methods

    /**
     * 
     * Overloads:
     * f(owner, url, data_or_reqdata, callback, cache) : Boolean
     * f(owner, url, data_or_reqdata, cache) : Operation
     * f(owner, req, callback) : Boolean
     * f(owner, req) : Operation
     * 
     * 
     */
    AjaxPipeline.prototype.ajaxSendRequest = function(owner, url_or_req, data_or_reqdata_or_callback, callback, cache) {
        if (BaseObject.is(url_or_req, "IAjaxRequest")) {
            if (BaseObject.isCallback(data_or_reqdata_or_callback)) {
                return this.$ajaxSendRequest(url_or_req, data_or_reqdata_or_callback);
            } else { // Operation
                return this.$ajaxSendRequestOp(url_or_req);
            }
        } else if (typeof url_or_req == "string") {
            if (BaseObject.isCallback(callback)) {
                return this.$ajaxSendRequestRaw(owner, url_or_req, data_or_reqdata_or_callback, callback);
            } else { // Operation
                return this.$ajaxSendRequestRawOp(owner, url_or_req, data_or_reqdata_or_callback);
            }
        } else { // Unsupported
            return false;
        }
    }


    //#region Can be removed
    /* Reimplemented - cen be removed
    AjaxPipeline.prototype.ajaxSendRequest = function(owner, url_or_req, data_or_reqdata_or_callback, callback, cache) {
        // TODO Currently working on this!!!!!
        if (BaseObject.is(url_or_req, "IAjaxRequest")) { // Actually send something only if request is passed
            var request = url_or_req;
            var request_complete = request.completeRequest;
            if (BaseObject.isCallback(data_or_reqdata_or_callback)) { // callback (choosing from callback or operation)
                if (typeof callback == "boolean") {
                    request.set_cache(callback);
                }
                request.completeRequest = function(response) {
                    if (BaseObject.is(response, "IAjaxResponse")) {
                        response.set_request(request);
                    }
                    request_complete.call(request, response);
                    BaseObject.callCallback(data_or_reqdata_or_callback, response);
                }
                _enqueueRequest(request);
                return true;
            } else { // Operation - respond with operation
                if (typeof data_or_reqdata_or_callback == "boolean") {
                    request.set_cache(data_or_reqdata_or_callback);
                }
                var op = new Operation(); // TODO: Needs some safe timeouts etc.
                request.completeRequest = function(response) {
                    if (BaseObject.is(response, "IAjaxResponse")) {
                        response.set_request(request);
                    }
                    request_complete.call(request, response);
                    if (BaseObject.is(response, "IAjaxResponse")) {
                        if (response.get_success()) {
                            op.CompleteOperation(true, response);
                        } else {
                            op.CompleteOperation(false, response.get_message);
                        }
                    } else {
                        op.CompleteOperation(false, "" + response);
                    }
                }
                _enqueueRequest(request);
                return op;
            }
            
        } else { // URL then callback or op
            
            // Build a request ourselves
            var err = null;
            var _url = url_or_req;
            var _data = data_or_reqdata_or_callback;
            var _callback = null, _cache = false;
            if (BaseObject.isCallback(callback)) {
                _callback = callback;
            } else if (typeof cache == "boolean") {
                _cache = cache;
            }
            var request = new AjaxRequest(this);
            var bkurl = BKUrl.getBasePathAsUrl();
            if (typeof _url == "string" || BaseObject.is(_url, "BKUrl")) {
                if (!bkurl.set_nav(_url)) request.set_constructionError("Cannot determine the url") ;
            } 
            request.set_url(bkurl);
            if (_data) request.set_data(_data);
            return this.ajaxSendRequest(request, callback || _cache, _cache != null?_cache: null);
        }
    }
    */
   //#endregion can be removed
  

    AjaxPipeline.prototype.$progressQueue = null;
    AjaxPipeline.prototype.get_progressqueue = function() {
        return this.$progressQueue;
    }
    AjaxPipeline.prototype.set_progressqueue = function(v) {
        if (v == null || BaseObject.is(v, IAjaxProgressQueue)) {
            this.$progressQueue = v;
        }
        // TODO: Should we clean this further
    }

    /* Singleton by construction (BKInit)
    AjaxPipeline.Default = (function() { 
        var instance = null;
        return function() { 
            if (instance == null) instance = new AjaxPipeline(null, true);
            return instance;
        }
    })();
    */

})();