/*	Registers is a central point for workspace wide registration of all kinds of providers, resources etc.
	Currently these registrations are spread around and attached to related classes or in globals, with this
	universal entry point we pave the ground for centralized registration of new features that need this and
	gradual migration of existing features to the new registers.
*/

function Registers() {
	BaseObject.apply(this, arguments);
};
Registers.Inherit(BaseObject, "Registers");
Registers.Implement(IRegisters);
Registers.$nameValidRegEx = /^[a-zA-Z0-9_$]{2,64}$/;
Registers.ImplementProperty("collections", new InitializeObject("The collection of registers."));

Registers.Default = (function() {
	var $Default = null;
	return function() {
		if ($Default == null) {
			$Default= new Registers();	
		}
		return $Default;
	}
})();
Registers.isRegisterNameValid = function(registername) {
	if (!BaseObject.is(registername, "string")) return false;
	if ( registername.length == 0 ) return false;
	if (!Registers.$nameValidRegEx.test(registername)) return false;
	return true;
};
//Add a register.
Registers.prototype.addRegister = function (register) {
	if (!BaseObject.is(register, "IRegister")) {
		throw 'Only "IRegister" derived classes can be added to the global registers.';	
	}
	var registername = register.get_registername();
	if (!Registers.isRegisterNameValid(register.get_registername())) {
		throw "Cannot add a register with invalid name " + registername;
	}
	if (this.$collections[registername] != null) {
		throw "A register with the name \"" + registername + "\" already exists!";
	}
	this.$collections[registername] = register;
};
Registers.addRegister = function (register){
	Registers.Default().addRegister(register);
};

//Check wheather a register exists or not
Registers.prototype.registerExists = function(registername){
	return (this.$collections[registername] != null);
};

Registers.registerExists = function(registername){
	return Registers.Default().registerExists(registername);
};


//Gets a specific register form the registers collection.
Registers.prototype.getRegister = function(registername){
    return this.$collections[registername];
};

Registers.getRegister = function(registername){
	return Registers.Default().getRegister(registername);
};