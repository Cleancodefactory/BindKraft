/**
	Typically implemented through the implementer IUsingValueCheckersImpl.
	Defines a method that can be internally used to check conditions on various values, using various instances of IValueChecker (as needed for the specific implementation - simplifies its code and 
		applies common policy for missing IValueChecker or future similar features that extend the value checking functionality.
*/
function IUsingValueCheckers() {}
IUsingValueCheckers.Interface("IUsingValueCheckers");
IUsingValueCheckers.prototype.checkValueWith = function(checker, value) {
	throw "not impl";
}
	