(function() {

    /**
     * The purpose of this class is to be the base class for classes implementing
     * logic that decide what king of trap to use based on geometrical and structural 
     * (DOM) reasons. In the end the gesture result is used to provide detailed 
     * answer "what must be done".
     * 
     * The different tasks may differ drastically.
     * 
     */

    function GestureTaskBase() {
        BaseObject.apply(this, arguments);
    }
    GestureTaskBase.Inherit(BaseObject, "GestureTaskBase");

    GestureTaskBase.prototype.applyAt = function(pt_ot_event) /* :Operation */ {
        throw "Not implemented.";
    }


})();