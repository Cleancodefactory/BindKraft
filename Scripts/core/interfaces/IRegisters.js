
/* 
	The register of all the registers
	
	Mainly defined for the supported by the system registers. Its Default() (available only in implementation) makes 
	objects that support it - system singletons.
	However, usages other than that are possible, but they should not use or overrite the Default method
	
*/

function IRegisters() {}
IRegisters.Interface("IRegisters");
IRegisters.prototype.addRegister = function (register) {throw "not implemented";};
IRegisters.prototype.registerExists = function(registerName) {throw "not implemented";}
IRegisters.prototype.getRegister = function(register) {throw "not implemented";}
IRegisters.prototype.removeRegister = function(registerName) {throw "not implemented";}