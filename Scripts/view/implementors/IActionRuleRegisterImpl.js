


/*INTERFACE*/ /*IMPL*/
function IActionRuleRegisterImpl() {}
IActionRuleRegisterImpl.InterfaceImpl(IActionRuleRegister);
IActionRuleRegisterImpl.classInitialize = function (cls) {
	// example: { rule1: { unspecified: ruleproc1, view: ruleproc2}, rule2: {app: ruleproc3 }}
	cls.prototype.$actionRuleRegister = new InitializeObject("An object of objects which in turn contain the purpose as name and the actual rule in these properties.");
	cls.prototype.registerActionRule = function (name, purpose, rule) {
		if (!(name in this.$actionRuleRegister)) {
			this.$actionRuleRegister[name] = {};
		}
		var p = purpose || this.get_defaultPurpose();
		if (this.$actionRuleRegister[name][p] != null) {
			// TODO: We probably have to do something when an existing rule is replaced.
		}
		this.$actionRuleRegister[name][p] = rule;
	}.CopyDocFrom(IActionRuleRegisterImpl.registerActionRule);
	cls.prototype.unregisterActionRule = function(name, purpose) {
		if (name in this.$actionRuleRegister) {
			if (purpose == null) { // Remove all rules with that name
				delete this.$actionRuleRegister[name];
			} else { // Remove only the rule for the specific purpose
				if (this.$actionRuleRegister[name][purpose] != null) {
					delete this.$actionRuleRegister[name][purpose];
				}
			}
		}
	}.CopyDocFrom(IActionRuleRegisterImpl.unregisterActionRule);
	cls.prototype.getActionRule = function(name,purpose) {
		var p = purpose || this.get_defaultPurpose();
		if (name in this.$actionRuleRegister) {
			return this.$actionRuleRegister[name][p]; // Will return null or undefined which we treat the same way.
		}
		return null;
	}.CopyDocFrom(IActionRuleRegisterImpl.getActionRule);
	cls.onStructuralQuery("ActionRuleQuery", function (query, procInst) {
		query.obtainRulesFromRegister(this);
		if (query.shouldComplete(this)) return true;
		// TODO: We need some more scoping here
	});
};