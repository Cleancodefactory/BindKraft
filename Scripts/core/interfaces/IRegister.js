
/* IRegister is an interface that needs to be implemented by every register known for the Registers singleton class (see [core]/Registers.js)
	
   Implementation guide:
   
   Registration SHOULD be done with a string key, but exceptions are allowed. Exceptions SHOULD be used only if they make more sense than the key/item registration
   from usage point of view.
   
   Exceptions are not a problem, because every regiser serves specific purpose and the purpose determines (and documents) how the register should be used. Thus
   the key/item registration is the default, if nothing else is documented.
   
   Exceptions must comply to one of the following two patterns:
   a) registration based on comparison (the .equals method). In such case the key argument in all the methods can be ignored or left optional (if dual search is supported)
   b) registration based on user supplied predicate function. This again can be combined with standard key/item pattern if possible. In this case the implementation should
		check the key parameter and use it as predicate if it is a callback (see BaseObject.isCallback) or (if also supported) as key if it is a string.
		
	Open questons: Should we support other types for keys?
	
	There is no point in supporting capabilities query mechanism, becuse the registers are not used in abstract manner - a specific and known in advance register is queried
	for something that certain code needs. So, the code that uses a register needs to know which register to use - this is by design.
	
	The implementation of IRegister.item MUST return by default the aspect which is needed for regular usage. For example a register may be filled with class names/class definitions
	and the purpose of this register may be to provide instances of them when asked, then instance of the class or class definition determined by the key should be returned by default.
	Another example - registers that store HTML templates should be designed to return the form that fits best their usage - assume you hold just text form of the template. Then such aLinkcolor
	regiser can be used as a supply for the template text (i.e. just raw strings), but the pattern established may be different and it could be better to return constructed DOM fragment 
	from the text instead.
	So, basically the registers MUST follow the philosophy of the API that uses them.
	
	
*/

function IRegister() {}
IRegister.Interface("IRegister");
IRegister.prototype.get_registername = function() { throw "IRegister.get_registername is not implemented by " + this.fullClassType(); }
IRegister.prototype.register = function(key, item) { throw "IRegister.register is not implemented by " + this.fullClassType(); };
IRegister.prototype.unregister = function(key, /*optional*/ item) { throw "IRegister.unregister is not implemented by " + this.fullClassType(); };
IRegister.prototype.item = function(key, /*optional*/ aspect) { throw "IRegister.item is not implemented by " + this.fullClassType(); };
IRegister.prototype.exists = function(key) { throw "IRegister.exists is not implemented by " + this.fullClassType(); };