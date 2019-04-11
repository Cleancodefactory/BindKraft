


/*INTERFACE*/
// Implemented by classes attached to DOM element(s). It can be used to query their instances for the DOM elements they are using 
// The get_connecteddomelement should return jQuery objects and can packmore than one element in the answer.
// Without parameters it should return the main/root DOM element if such exists or null otherwise.
//
// CORRECTION: Should return native objects.
function IDOMConnectedObject() { }
IDOMConnectedObject.Interface("IDOMConnectedObject");
IDOMConnectedObject.prototype.get_connecteddomelement = function(key) {}