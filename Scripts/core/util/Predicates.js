/**
	Predicates
	
	Set of frequently used callbacks usable with Array.Select/Any/All/FirstOrDefault ... and some other methods expecting callback predicates
	
	The functions below return the comparator, depending on the case the functions may have different number of parameters.
*/
var Predicates = {
	TypeIs: function(instance) {
		return function(idx, item) {
			if (BaseObject.is(instance, item)) return true;
			return null;
		}
	},
	Equals: function(tocompare) {
		return function(idx, item) {
			return BaseObject.equals(tocompare, item);
		}
	}
};