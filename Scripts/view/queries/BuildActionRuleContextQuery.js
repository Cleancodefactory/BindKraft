


/*CLASS*/ /*QUERY*/
function BuildActionRuleContextQuery(purpose,scope) {
    BaseObject.apply(this,arguments);
    this.ruleContext =  IActionRuleContextConstructor.createEmptyContext(); // Create an empty context.
    this.purpose = purpose || ActionRulePurposeEnum.unspecified;
    this.scope = scope || "app";
}
BuildActionRuleContextQuery.Inherit(BaseObject,"BuildActionRuleContextQuery");
BuildActionRuleContextQuery.prototype.purpose = null;
BuildActionRuleContextQuery.prototype.scope = null;
BuildActionRuleContextQuery.prototype.ruleContext = null; // The created context goes here.
BuildActionRuleContextQuery.prototype.processContext = function(processor) {
    var result;
    if (BaseObject.is(processor,"IActionRuleContextConstructor")) {
        result = processor.prepareActionRuleContext(this.ruleContext,this.purpose);
    }
    if (result !== true) {
        switch (this.scope) {
            case ActionRuleRegisterScopeEnum.first:
                result = true;
                break;
            case ActionRuleRegisterScopeEnum.window:
                if (BaseObject.is(processor,"BaseWindow")) {
                    result = true;
                }
            break;
            case ActionRuleRegisterScopeEnum.view:
                if (BaseObject.is(processor,"ITemplateRoot")) {
                    result = true;
                }
            break;
            case ActionRuleRegisterScopeEnum.app:
            default:
                if (BaseObject.is(processor,"IApp")) {
                    result = true;
                }
        }
    }
    return result;
}.Description("Default implementation calling the IActionRuleContextConstructor.prepareActionRuleContext. Call this your onStructuralQuery or use automatic implementation that does.")
