(function (){

    var AjaxPipeline = Class("AjaxPipeline"),
        AjaxProgressQueue = Class("AjaxProgressQueue"),
        AjaxSendQueue = Class("AjaxSendQueue"),
        BKInit_AjaxCarrier = Class("BKInit_AjaxCarrier"),
        AjaxCarrier = Class("AjaxCarrier"),
        AjaxPipelines = Class("AjaxPipelines");

    function BKInit_AjaxPipeline(/*optional string*/ name ) {
        BaseObject.apply(this,arguments);
        this.$pipelineName = name;
        this.createPipeline();

    }
    BKInit_AjaxPipeline.Inherit(BaseObject, "BKInit_AjaxPipeline");

    BKInit_AjaxPipeline.prototype.$pipelineName = null;
    BKInit_AjaxPipeline.prototype.$pipeline = null;

    BKInit_AjaxPipeline.prototype.createPipeline = function() { 
        if (this.$pipeline !== null) throw "No need to call createPipeline twice";
        this.$pipeline = new AjaxPipeline();
        AjaxPipelines.Default().setPipeline(this.$pipelineName, this.$pipeline);
        return this;
    }
    //#region Send queue
    /**
     * Sets the system default (singleton) send queue as send queue for the pipeline.
     */
    BKInit_AjaxPipeline.prototype.useDefaultSendQueue = function() {
        this.$pipeline.set_sendqueue(AjaxSendQueue.Default());
        return this;
    }
    BKInit_AjaxPipeline.prototype.useOwnSendQueue = function() {
        this.$pipeline.createSendQueue();
        return this;
    }
    BKInit_AjaxPipeline.prototype.useSpecificSendQueue = function(sq) {
        if (BaseObject.is(sq, IAjaxSendQueue)) {
            this.$pipeline.set_sendqueue(sq);
            return this;
        } else {
            throw "The specified argument is not an IAjaxSendQueue";
        }
    }
    //#endregion

    //#region Auto-driving it
    BKInit_AjaxPipeline.prototype.autoRun = function(n) { 
        if (n == null) n = 1000;
        this.$pipeline.set_autorun(n);
        return this;
    }
    BKInit_AjaxPipeline.prototype.autoPush = function(n) { 
        if (n == null) n = 500;
        this.$pipeline.set_autopush(n);
        return this;
    }
    //#endregion

    //#region Progress queue
    /**
     * Includes a progress queue in the pipeline. It is used for diagnostics and activity visualization.
     */
    BKInit_AjaxPipeline.prototype.useProgressQueue = function() { 
        this.$pipeline.set_progressqueue(new AjaxProgressQueue());
        return this;
    }
    //#endregion

    //#region Carrier
    /**
     * Adds a carrier. By default (with single argument) the standard AjaxCarrier is created, but
     * there is the option for a custom one (two argument version)
     * 
     * Usages: 
     *  pipeline.AddCarrier(function(carrierBuilder) {
     *  })
     * or
     *  pipeline.AddCarrier(new CustomCarrier(), function(carrierBuilder){
     *  })
     */
    BKInit_AjaxPipeline.prototype.AddCarrier = function(cr,fn) {
        var _fn = fn;
        var _cr = cr
        if (!BaseObject.is(cr, "IAjaxCarrier")) {
            _fn = cr;
            _cr = new AjaxCarrier();
        }
        this.$pipeline.addCarrier(_cr);
        if (typeof _fn == "function") {
            _fn(new BKInit_AjaxCarrier(_cr,this.$pipeline));    
        }
        return this;
    }
    //#endregion


})();