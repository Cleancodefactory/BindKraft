function IFormatterRegistrationImpl() {}
IFormatterRegistrationImpl.InterfaceImpl(IFormatterRegistration, "IFormatterRegistrationImpl");
IFormatterRegistrationImpl.inheritorInitialize = function(cls, parentCls) {
	if (!cls.DoNotRegister) {
		var reg = Registers.Default().getRegister("systemformatters");
		if (BaseObject.is(cls.RegsiterAs,"Array")) {
			reg.register(cls.classType, new InitializeObject("",cls.classType, cls.RegisterAs));
		} else {
			reg.register(cls.classType, new InitializeObject("",cls.classType));
		}
	}
}