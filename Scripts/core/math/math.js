
/*
    File: math/general.js
    General math stuff (we only add these as needed)
    
*/

//// MATH HELPERS /////////////////////	
/**
 * 
 * @param {int} v - value to manipulate as bit flags
 * @param {*} flags to set
 * @returns the value with the specified flags set
 */
Math.bitsOn = function (v, flags) {
    return (v | flags);
};
/**
 * 
 * @param {int} v Value to manipulate as flags
 * @param {int} flags to clear 
 * @returns returns thevalue 'v' wit the 'flags' cleared
 */
Math.bitsOff = function (v, flags) {
    return (v & (~flags));
};
/**
 * 
 * @param {int} v to manipulate as flags 
 * @param {int} flags to test for
 * @returns {boolean} true if the specified 'flags' are set, false if not all of them are set
 */
Math.bitsTest = function (v, flags) {
    return ((v & flags) == flags);
};
/**
 * 
 * @param {int} v value to manipulate as flags 
 * @param {int} mask to apply 
 * @returns {int} the value masked to the specified mask
 */
Math.bitsMasked = function(v, mask) {
	return (v & mask);
}


Math.newGuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};