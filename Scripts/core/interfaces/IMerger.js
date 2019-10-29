/**
	Similar to ITranslator, but for transformations that merge the data into some target.
*/
function IMerger() {}
IMerger.Interface("IMerger");
IMerger.prototype.MergeInto = function(data, target) { throw "not impl"; }
