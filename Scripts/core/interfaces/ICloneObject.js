function ICloneObject() {}
ICloneObject.Interface("ICloneObject");

/**
 * Clones the object 
 * 
 * 
 * @returns {any} The cloned object
 * 
 * Optional parameters can be implemented, but the method should be fully functional if called without any.
 * The optional arguments should deal with matters like cloning all or parts of the runtime state of the
 * instance if the need to clone with or without that state selectively is forseen. In any case the cloned
 * object should have the same settings as the original and should be usable as a new copy created and 
 * configured the same way as the original. A good idea how to implement is the case of objects that change
 * irreversibly during usage - cloning of the parts of the state that cause this MUST NOT be cloned normally and
 * if the implementer sees any use of cloning them too in some niche scenarios, it should be done only in
 * response to some custom optional argument of the method. Said with a metaphor, cloning a bullet that was already
 * shot must give you a new bullet to load in your gun with the same qualities as the original and not an expended one.
 * 
 */
ICloneObject.prototype.cloneObject = function(/*optional parameters*/) { throw "not implemented."; }


//#region Static helpers
ICloneObject.recursiveCloneObject = function(x) {
    if (BaseObject.is(x, "ICloneObject")) {
        return x.cloneObject();
    } else if (Array.isArray(x)) {
        var arr = [];
        for (var i = 0; i < x.length;i++) {
            arr.push(this.recursiveCloneObject(x[i]));
        }
        return arr;
    } else if (BaseObject.is(x, "object")) {
        var obj = {};
        for (var k in x) {
            if (x.hasOwnProperty(k)) {
                obj[k] = this.recursiveCloneObject(x[k]);
            }
        }
        return obj;
    } else {
        return x;
    }
}
//#endregion