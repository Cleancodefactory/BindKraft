/*
	Extends the base interface to fit the needs of the URL parts.
	This is needed because in some cases the parts are treated differently depending on the state of the parent
	The parent must be BKUrl for now, a more abstract implementation may be possible and desirable, but we will deal with that later.
**/
function IBKUrlPart() {}
IBKUrlPart.Interface("IBKUrlPart");
IBKUrlPart.prototype.get_parent = function() { throw "not implemented";}
IBKUrlPart.prototype.set_parent = function(v) { throw "not implemented";}
