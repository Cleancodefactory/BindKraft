(function (){

    var AjaxPipeline = Class("AjaxPipeline"),
        AjaxProgressQueue = Class("AjaxProgressQueue"),
        AjaxSendQueue = Class("AjaxSendQueue"),
        BKInit_AjaxCarrier = Class("BKInit_AjaxCarrier"),
        AjaxCarrier = Class("AjaxCarrier");

    function BKInit_AjaxPipeline() {
        BaseObject.apply(this,arguments);

    }
    BKInit_AjaxPipeline.Inherit(BaseObject, "BKInit_AjaxPipeline");
    BKInit_AjaxPipeline.$pipeline = null;

    BKInit_AjaxPipeline.prototype.createPipeline = function() { 
        BKInit_AjaxPipeline.$pipeline = new AjaxPipeline();
        return this;
    }
    //#region Send queue
    /**
     * Sets the system default (singleton) send queue as send queue for the pipeline.
     */
    BKInit_AjaxPipeline.prototype.useDefaultSendQueue = function() {
        BKInit_AjaxPipeline.$pipeline.set_sendqueue(AjaxSendQueue.Default());
        return this;
    }
    BKInit_AjaxPipeline.prototype.useSpecificSendQueue = function(sq) {
        if (BaseObject.is(sq, IAjaxSendQueue)) {
            BKInit_AjaxPipeline.$pipeline.set_sendqueue(sq);
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
        BKInit_AjaxPipeline.$pipeline.set_progressqueue(new AjaxProgressQueue());
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
        BKInit_AjaxPipeline.$pipeline.addCarrier(_cr);
        if (typeof _fn == "function") {
            _fn(new BKInit_AjaxCarrier(_cr,BKInit_AjaxPipeline.$pipeline));    
        }
        return this;
    }
    //#endregion


})();