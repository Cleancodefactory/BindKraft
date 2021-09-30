(function () {

    /**
     * This class is intended to exist as a global singleton and hold the defined ajax pipelines.
     * Typically the system is configured with a single (default) pipeline, but there could be projects that
     * require additional ones.
     * 
     * To serve all the needs for finding a specific pipeline (or the default one) this class implements simple
     * register for them.
     * 
     * When implementing app specific pipeline it is usually best to expect that it might be needed in another app as well, if not
     * immediately, then later. For this reason such pipelines should be registered as additional ones and obtained by name. To keep 
     * them 'attached' to the specific app, one can simply use the app's class name as a name for the pipeline.
     * 
     */

    function AjaxPipelines() {
        BaseObject.apply(this, arguments);
    }
    AjaxPipelines.Inherit(BaseObject, "AjaxPipelines");

    //#region Main pipeline
    AjaxPipelines.prototype.$main = null;
    AjaxPipelines.prototype.get_main = function () {
        return this.$main;
    }
    AjaxPipelines.prototype.set_main = function (v) {
        if (v == null || BaseObject.is(v, "AjaxPipeline")) {
            this.$main = v;
        } else {
            this.LASTERROR("The pipeline can be null or an instance of AjaxPipeline");
        }
    }
    //#endregion

    //#region Additional pipelines
    AjaxPipelines.prototype.$additional = new InitializeObject("The global additional pipelines are registered here");
    AjaxPipelines.prototype.setPipeline = function(name, v) { 
        if (v == null || BaseObject.is(v, "AjaxPipeline")) {
            if (typeof name == "string" && name.length > 0) {
                this.$additional[name] = v;
            } else {
                this.set_main(v);
            }
        } else {
            this.LASTERROR("The pipeline can be null or an instance of AjaxPipeline");
        }
    }
    AjaxPipelines.prototype.getPipeline = function(name) { 
        if (typeof name == "string" && name.length > 0) {
            return this.$additional[name];
        } else {
            if (name != null && typeof name !== "string") this.LASTERROR("Returning main pipeline, but the argument 'name' does not look correct.");
            return this.get_main();
        }
    }
    //#endregion

    //#region Singleton
    AjaxPipelines.Default = (function(){
        var  instance = null;
        return function() {
            if (instance == null) instance = new AjaxPipelines();
            return instance;
        }
    })();
    //#endregion

})();