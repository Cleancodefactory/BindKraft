function ISupportsCommandContext() {}
ISupportsCommandContext.Interface("ISupportsCommandContext");
/**
	It is up to the implementer to decide whether the same context will be returned or a new one, also this applies to the content of the context - the command register and the environment may be new instance every time or
	the same instance(s) every time. If it is needed to support more than a single mode a separate behavior control should be exposed. There is no general standart for that - needs to control the behavior almost always
	rise from application specifics and this control should be exposed in a manner that fits better with them and not with the standard interfaces.
	
	So, the clients of the interface should not assume behavior unless they are implemented to be aware of the factors that may impact the choice (if control over it is implemented at all). Obviously this means only special
	solutions can assume something about the behavior, general purpose code should not.
*/
ISupportsCommandContext.prototype.get_commandcontext = function() { throw "not implemented";}