/**
	This interface is not for validation in UI or similar scenarios, it is for implementation of checking
	cerain conditions on values serving internal purposes, such as conditions for allowed values in a collection,
	conditions a name/key has to obey etc. Working through this interface configurable rules can be set to the 
	classes that have this kind of logic.
*/
function IValueChecker() {}
IValueChecker.Interface("IValueChecker");
/**
	@returns {boolean} - does the value meet the conditions enforced 
 */
IValueChecker.prototype.checkValue = function(v) { throw "not impl";}
/**
	Optional method that returns a string describing how the value does not meet the conditions or null if there is no description or if the value is correct.
*/
IValueChecker.prototype.checkValueDescription = function (v) { return null; }