(function (){
    function BKInit_AjaxPipeline() {
        BaseObject.apply(this,arguments);
    }
    BKInit_AjaxPipeline.Inherit(BaseObject, "BKInit_AjaxPipeline");
    BKInit_AjaxPipeline.$pipeline = null;

    BKInit_AjaxPipeline.prototype.createPipeline = function() { 
        this.$pipeline = new AjaxPipeline();
        return this;
    }
    //#region Send queue
    /**
     * Sets the system default (singleton) send queue as send queue for the pipeline.
     */
    BKinit_AjaxPipeline.prototype.useDefaultSendQueue = function() {
        this.$pipeline.set_sendqueue(AjaxSendQueue().Default());
        return this;
    }
    BKinit_AjaxPipeline.prototype.useSpecificSendQueue = function(sq) {
        if (BaseObject.is(sq, IAjaxSendQueue)) {
            this.$pipeline.set_sendqueue(sq);
            return this;
        } else {
            throw "The specified argument is not an IAjaxSendQueue";
        }
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
     * 
     * Usages: 
     *  pipeline.AddCarrier(function(carrierBuilder) {
     *  })
     * or
     *  pipeline.AddCarrier(new CustomCarrier(), function(carrierBuilder){
     *  })
     */
    BKinit_AjaxPipeline.prototype.AddCarrier = function(cr,fn) {
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