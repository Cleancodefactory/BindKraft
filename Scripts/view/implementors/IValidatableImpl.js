/**
	Default implementaton of IValidateable.
	
	This implementation and in fact the IValidatable interface in general are intended mainly for implementation
	by components/controls that are parts of a view or another component and should be validated separetely
	
	The usage cycle is intended as follows:
	
	1. The container calls resetknownvalidity() whenever it puts the component into a situation in which the userAgent
	can make changes to it. This guarantees that the next time get_checkvalidity is called a validation will be performed.
	
	2. Usage of the result
	
	2.1. A binding is usually bound to get_checkvalidity to initiate and return the validity. The binding SHOULD have 
		the options=operation option, because the validity is returned as an operation. The binding can link to somethign that 
		displays the result or the effect of the result.
		
	2.2. Like in 2.1. a binding can be linked to get_checkvalidity, but the option is not neccessary. A Validator is linked to that 
		binding (which means the binding can be even "probe" if it does not need to update a source). The validator can be activated 
		as part of the validation of the container which will indirectly call the property. The validator MUST use the CheckValidationRule
		with alias 'validation':
		
		
		
	
	
*/
function IValidatableImpl() {}
IValidatableImpl.InterfaceImpl(IValidatable, "IValidatableImpl");
IValidatableImpl.RequiredTypes("Base");
IValidatableImpl.prototype.$knownvalidity = ValidationResultEnum.uninitialized;
IValidatableImpl.prototype.get_knownvalidity = function() { return this.$knownvalidity; }
/**
 * Usages:
 *  MyClass.Implement(IValidatableImpl,"mygroup")
 *  MyClass.Implement(IValidatableImpl,true)
 *  MyClass.Implement(IValidatableImpl,function.call(this));
 * All the parameters can be mixed together.
 */
IValidatableImpl.classInitialize = function(cls, _customValidation, _alwaysReset) {
	var customValidation, grpName = null, alwaysReset = false;
	for (var i = 1; i < arguments.length; i++) {
		if (BaseObject.isCallback(arguments[i])) {
			customValidation = arguments[i];
		} else if (typeof arguments[i] == "string") {
			grpName = arguments[i];
		} else if (arguments[i] === true) {
			alwaysReset = true;
		}
	}
	cls.prototype.resetknownvalidity = function() { 
		this.uninitValidators(grpName);
		this.$knownvalidity = ValidationResultEnum.uninitialized; 
	}
	cls.prototype.get_checkvalidity = function() { 
		if (alwaysReset || this.$knownvalidity == ValidationResultEnum.uninitialized) {
			return this.performValidation();
		}
		return this.$knownvalidity;
	}
	if (BaseObject.isCallback(customValidation)) {
		cls.prototype.performValidation = function () {
			var r = customValidation.call(this);
			if (BaseObject.is(r, Operation)) return r;
			return Operation.From(r);
		}
	} else if (typeof grpName == "string") {
		cls.prototype.performValidation = function() { 
			var op = new Operation();
			this.validate(function(vresult) {
				this.$knownvalidity = vresult;
				op.CompleteOperation(true, vresult);
			}, grpName);
			return op;
		}
	} else {
		cls.prototype.performValidation = function() { 
			var op = new Operation();
			this.validate(function(vresult) {
				this.$knownvalidity = vresult;
				op.CompleteOperation(true, vresult);
			});
			return op;
		}
	}
}