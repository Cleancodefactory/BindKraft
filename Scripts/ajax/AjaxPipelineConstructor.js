(function(){

    // DOWE NEED anything like this?

    function AjaxPipelineConstructor() {
        BaseObject.call(this,arguments);
    }
    AjaxPipelineConstructor.Inherit(BaseObject, "AjaxPipelineConstructor");

    AjaxPipelineConstructor.prototype.$pipeline = null;
    AjaxPipelineConstructor.prototype.get_pipeline = function() {return this.$pipeline;};
    AjaxPipelineConstructor.prototype.set_pipeline = function (v) {this.$pipeline = v;}

    //AjaxPipelineConstructor.prototype.create = function()

})();