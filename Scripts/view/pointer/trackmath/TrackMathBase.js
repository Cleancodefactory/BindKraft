(function() {

/**
 * Track math is represented by classes that are first configured with some settings that 
 * typically describe some geometry. Then their method trackPoint is called with a point and 
 * they have to correct the point according to the geometry and the rules based on it, implemented
 * by the class.
 * 
 * The point is most often a drag anchor that is used for resizing, moving, rotating of a geometry that
 * must match certain rules in respect to another geometry. E.g. a rectangle not allowed to leave even
 * partially the bounds of another, rotation angle which is determined by the position of the anchor on 
 * a circle etc.
 */
function TrackMathBase() {
    BaseObject.apply(this,arguments);
}
TrackMathBase.Inherit(BaseObject, "TrackMathBase");

TrackMathBase.prototype.trackPoint = function(pt) {
    throw "Not implemented";
}

})();