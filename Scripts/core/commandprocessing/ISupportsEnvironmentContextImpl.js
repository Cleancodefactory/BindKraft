/**
	Unlike commandregister which is by default static, this one is by default instance specific.
	Defines a property that returns the encironment context.
*/
function ISupportsEnvironmentContextImpl() {}
ISupportsEnvironmentContextImpl.InterfaceImpl(ISupportsEnvironmentContext,"ISupportsEnvironmentContextImpl");
ISupportsEnvironmentContextImpl.ImplementReadProperty("environment", new InitializeObject("EnvironmentContext instance","EnvironmentContext"));