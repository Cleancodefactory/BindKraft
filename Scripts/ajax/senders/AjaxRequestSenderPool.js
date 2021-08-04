(function(){

    function AjaxRequestSenderPool(fcount) { 
        AjaxRequestSenderBase.apply(this, arguments);
        fcount = fcount || 1;
        for (var i = 0; i < fcount; i++) {
            this.$fetchers.push(this.$createFetcher());
        }
    }
    AjaxRequestSenderPool.Inherit(AjaxRequestSenderBase,"AjaxRequestSenderPool");

    AjaxRequestSenderPool.prototype.sendRequest = function(req) {


    }

    //#region Fetchers pool
    AjaxRequestSenderPool.prototype.$fetchers = new InitializeArray("Fetchers to use");
    AjaxRequestSenderPool.prototype.get_fetchersCount = function() {
        return this.$fetchers.length;
    }
    AjaxRequestSenderPool.prototype.trySend = function() {
        if (this.$hasQueuedRequests()) {
            var fetcher = this.$fetchers.FirstOrDefault(function(idx, f){
                if (!f.isOpened()) return f;
                return null;
            });
            if (fetcher != null) {
                var req = this.$dequeueRequest();
                if (req != null) {
                    var op;
                    if (req.get_verb() == "POST") {
                        // TODO: How to determine postdata encode and expected type.
                        op = fetcher.postEx(req.get_url(), req.get_reqdata(), teq.get_data())
                    } else { // Get by default

                    }
                    
                }
            }
        }
    }


    // override to implement differently configured fetchers
    AjaxRequestSenderPool.prototype.$createFetcher = function() { 
        return new LightFetchHttp();
    }
    
    //#endregion

})();