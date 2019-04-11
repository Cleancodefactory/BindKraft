


/*INTERFACE*/ /*IMPL*/
function IActionRuleContextConstructorImpl () {}
IActionRuleContextConstructorImpl.InterfaceImpl(IActionRuleContextConstructor);
IActionRuleContextConstructorImpl.classInitialize = function(cls, customContextBuilder,finishOperation) {
	// Common
	cls.onStructuralQuery("BuildActionRuleContextQuery", function (query, procInst) {
		if (query.processContext(this) === true) return true;
		// TODO: We need some more scoping here
	});
	
	// Choose implementation for the context preparation
	if (Class.is(cls, "IApp")) {
		cls.prototype.prepareActionRuleContext = function(context, purpose) {
			context.logicalContainer = this;
			if (Class.is(cls,"IDataHolder")) {
				context.logicalContainerDataContext = this.get_data();
			}
			if (customContextBuilder != null && typeof customContextBuilder == "function") {
				customContextBuilder.call(this, context, purpose);
			}
			if (finishOperation === true) return true;
		}.CopyDocFrom(IActionRuleContextConstructor.prepareActionRuleContext);
	} else if (Class.is(cls, "BaseWindow")) { // window logic first because of the inheritance
		cls.prototype.prepareActionRuleContext = function(context, purpose) {
			// Set itself as logical container in case there is no app. The app will replace this if available. Attaching this to windows is not recommended!
			context.logicalContainer = this;
			context.logicalContainerDataContext = this.get_data();
			if (customContextBuilder != null && typeof customContextBuilder == "function") {
				customContextBuilder.call(this, context, purpose);
			}
			if (finishOperation === true) return true;
		}.CopyDocFrom(IActionRuleContextConstructor.prepareActionRuleContext);
	} else if (Class.is(cls, "Base") && !Class.is(cls, ITemplateRoot)) { // local
		cls.prototype.prepareActionRuleContext = function(context, purpose) {
			// Local context inside a view
			var view = this.getRelatedElements("__view");
			if (view != null && view.length > 0) {
				context.visualContainerElement = view.get(0);
				context.visualContainer = view.activeclass();
				if (BaseObject.is(context.visualContainer,"Base")) {
					context.visualDataContext = context.visualContainer.get_data();
				}
			}
			if (customContextBuilder != null && typeof customContextBuilder == "function") {
				customContextBuilder.call(this, context, purpose);
			}
			if (finishOperation === true) return true;
		}.CopyDocFrom(IActionRuleContextConstructor.prepareActionRuleContext);
	} else if (Class.is(cls, "ITemplateRoot"))  {
		if (Class.is(cls,"Base")) {
			cls.prototype.prepareActionRuleContext = function(context, purpose) {
				context.visualContainer = this;
				context.visualContainerElement = this.root;
				context.visualDataContext = this.get_data();
				if (customContextBuilder != null && typeof customContextBuilder == "function") {
					customContextBuilder.call(this, context, purpose);
				}
				if (finishOperation === true) return true;
			}.CopyDocFrom(IActionRuleContextConstructor.prepareActionRuleContext);
		} else {
			return; // This should not happen?
		}
	} else {
		if (customContextBuilder != null && typeof customContextBuilder == "function") {
			cls.prototype.prepareActionRuleContext = customContextBuilder;
			cls.prototype.prepareActionRuleContext.CopyDocFrom(IActionRuleContextConstructor.prepareActionRuleContext);
		}
	}
}