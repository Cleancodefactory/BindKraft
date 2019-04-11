


/*INTERFACE*/
function ITickable() { };
ITickable.Interface("ITickable");
ITickable.prototype.tick = function (ticker) { // It makes no sense to Implement this Interface and not Implement its only method, isn't it?
    throw "tick() not implemented in " + this.fullClassType();
};