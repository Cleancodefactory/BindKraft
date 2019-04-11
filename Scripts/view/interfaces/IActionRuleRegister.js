


//+VERSION 1.5
/*INTERFACE*/
function IActionRuleRegister() {}
IActionRuleRegister.Interface("IActionRuleRegister");
IActionRuleRegister.ImplementProperty("defaultPurpose", new InitializeStringParameter("Default purpose of the registered rules (if not specified)",ActionRulePurposeEnum.unspecified));
IActionRuleRegister.prototype.registerActionRule = function(name, purpose, rule) {
}.Description("Registers a rule in the rule registry")
	.Param("The name under which to register the rule.")
	.Param("purpose","Optional, one of the ActionRulePurposeEnum values.")
	.Param("rule","The rule itself - must be function or delegate");
IActionRuleRegister.prototype.unregisterActionRule = function(name, purpose) {
}.Description("Unregisters the specified rule by name and (if specified) by purpose. If no purpose is specified all the rules for each purpose are unregistered.")
	.Param("name","The name under which the rule is registered.")
	.Param("The purpose for which the rule is registered. If omitted all the rules under the specified name are unregistered.")
	.Returns("Void.");
IActionRuleRegister.prototype.getActionRule = function(name, purpose) {
}.Description("Finds a rule by name and also by purpose (if specified). If purpose is not specified the rule for default purpose is returned (see defaultPurpose property)")
	.Param("name","The name under which the rule is registered.")
	.Param("purpose", "Optional purpose for which the rule must be registered (use ActionRulePurposeEnum values)")
	.Returns("Must return a rule (ref to a function or delegate) or null if not found.");
