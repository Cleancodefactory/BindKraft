function ITickable(){};ITickable.Interface("ITickable");ITickable.prototype.tick=function(ticker){throw"tick() not implemented in "+this.fullClassType();};