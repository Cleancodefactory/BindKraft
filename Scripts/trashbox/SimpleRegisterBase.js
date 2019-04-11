/* DEPRECATED!!!


	This class SHOULD replace RegisterBase as a base for implementing registers.
	The oversophistication in RegisterBase is not needed - at least in most cases and key -> value registrations should be enough
	uless some internal structure is needed by a specific register. The syntax of the kay may carry some structural meaning, but the register
	does not need tounderstand it and can just treat it as a key in a linear dictionary.
	
	Remarks: The registers are supposed to provide additional functionality, useful for the specific register, so it is normal to have specific key resolution
		in each of them, however it rarely needs to go as far as to openly support a tree-like structure.
	
	There is no implementer for IRegister, because register classes are not expected to provide IRegister functionality as as an addition, but as their main purpose.
*/

function SimpleRegisterBase() {
	BaseObject.apply(this,arguments);
}
SimpleRegisterBase.Inherit(BaseObject, "SimpleRegisterBase");
SimpleRegisterBase.Implement(IRegister);
SimpleRegisterBase.prototype.$register = new InitializeObject("The register");
SimpleRegisterBase.prototype.get_registername = function() { 
	throw "IRegister.register is not implemented by " + this.fullClassType(); 
}
SimpleRegisterBase.prototype.register = function(key, item) { 
	throw "IRegister.register is not implemented by " + this.fullClassType(); 
};
SimpleRegisterBase.prototype.unregister = function(key, /*optional*/ item) { throw "IRegister.unregister is not implemented by " + this.fullClassType(); };
SimpleRegisterBase.prototype.item = function(key, /*optional*/ aspect) { throw "IRegister.item is not implemented by " + this.fullClassType(); };
SimpleRegisterBase.prototype.exists = function(key) { throw "IRegister.exists is not implemented by " + this.fullClassType(); };