/*
	Helper for classes that use value checkers (various implementations of IValueChecker)
	Provides you with a method:
	this.checkValueWith(checker, value);
	You have to supply the checker, if it is null the value passes without checks, otherwise it is checked using the checker instance.
	If the checker is not null, but not an IValueChecker also - the check always fails.
	
	A class may use multiple checkers exposed to a different degree for replacement. That is why the checker has to be supplied - there cannot exist
	a standard way that will not limit your code. So, the checker can come from a property, internal private member field, from method argument, from some static source and so on.
	This simply gives you the option to do the check easilly.
	
	Some checkers support checking for null or other variations, which means that quite complex tests can be implemented and available for wide use in methods of a class or series of
	classes comraising all the checks that are needed and good planning will eliminate the need to check value for being null separatelly for example. To get the full benefit
	take some time to consider and plan where and how the checkers will be set, what are their defaults and what they will be configured to check.
	
	At the moment of writing this the widely used checker classes are: PatternChecker and TypeChecker
	
*/

function IUsingValueCheckersImpl() {}
IUsingValueCheckersImpl.InterfaceImpl(IUsingValueCheckers, "IUsingValueCheckersImpl");
IUsingValueCheckersImpl.prototype.checkValueWith = function(checker, value) {
	var _checker = checker;
	if (checker == "string") {
		_checker = BaseObject.getProperty(this, checker, null); // Read it from get_property or field
	}
	return IUsingValueCheckersImpl.checkValueWith(_checker, value);
	
}
IUsingValueCheckersImpl.checkValueWith = function(checker, value) {
	if (checker == null) {
		return true; // Non-checked value
	} else if (BaseObject.is(checker, "IValueChecker")) {
		return checker.checkValue(value);
	} else {
		return false; // WRong checker - false (assume intent for checking configured wrongly)
	}
}