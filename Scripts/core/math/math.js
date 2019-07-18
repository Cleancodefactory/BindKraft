
/*
    File: math/general.js
    General math stuff (we only add these as needed)
    
*/

//// MATH HELPERS /////////////////////	
	
Math.bitsOn = function (v, flags) {
    return (v | flags);
};
Math.bitsOff = function (v, flags) {
    return (v & (~flags));
};
Math.bitsTest = function (v, flags) {
    return ((v & flags) == flags);
};
Math.bitsMasked = function(v, mask) {
	return (v & mask);
}


Math.newGuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};