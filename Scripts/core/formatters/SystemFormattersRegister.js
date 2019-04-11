function SystemFormattersRegister() {
	BasicRegister.call(this, "systemformatters");
}
SystemFormattersRegister.Inherit(BasicRegister, "SystemFormattersRegister");

SystemFormattersRegister.prototype.$checkItem = function(item) { 
	// TODO: Implement checks when we get rid of the messy legacy formatters
	return true; 
}
SystemFormattersRegister.prototype.$checkKey = function(key) { 
	if (!BasicRegister.prototype.$checkKey(key)) return false;
	if (!/^[A-Za-z][A-Za-z0-9_\$]*$/.test(key)) return false;
	return true; 
}
Registers.addRegister(new SystemFormattersRegister()); // Other instances should not be needed
// TODO: We can add temporarily the legacy formatters into a separate tegister? Does it really worth the effort?