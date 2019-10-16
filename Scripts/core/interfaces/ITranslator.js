/**
	Interface for objects that provide translation from data to usable forms of data or even live instances (if that is what's expected)
*/
function ITranslator() {}
ITranslator.Interface("ITranslator");
ITranslator.prototype.PerformTranslation = function(input) { throw "not impl"; }

// TODO:
