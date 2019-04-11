


/*INTERFACE*/
function IActionRuleContextConstructor() {}
IActionRuleContextConstructor.Interface("IActionRuleContextConstructor");
IActionRuleContextConstructor.prototype.prepareActionRuleContext = function(context, purpose) {
}.Description("Sets/adds references and data to the rule context passed as parameter.")
	.Param("context","The rule context to prepare, should not be null")
	.Param("purpose","Optional, the purpose for which the context is built. This is a 'just in case' feature, you can ignore it for now.")
	.Returns("Explicit true if the operation should stop after this call (establishes a scope)");


/* RULE CONTEXT */
// Each property in the context can be null (or simply undefined).
// The properties create only a basis for creation of a convention in the bounds of a specific application/project,
// the example values give you a hint how to define such a convention.
IActionRuleContextConstructor.createEmptyContext = function() {
	return {
		subject: null,  // the subject of the rule if determinable - for instance the field to which the rule applies 
						//or the fields (then it can be array). The subject should be a framework object (usually Base derived - i.e. the data-class of the field (if any)).
		subjectElement: null, // the DOM element associated with the subject (if any)
		subjectDataContext: null, // Data associated with the subject (if any, if determinable)
		binding: null, // A Binding that triggered/is related to the rule execution.
		
		visualContainer: null, // The view or other similar object - the CBAse derived class. This must be the root of the UI that forms an independent/semi-independent UI unit/form.
		visualContainerElement: null, // DOM elment associated with the visualContainer (if any).
		visualDataContext: null, // Data context in which the rule is executed. This must be chosen for each type of rule defined in the given application/project. The same criteria as for the visualContainer
		
		logicalContainer: null, // The object that forms the logical container of the whole application - usually AppBase derived.
		logicalContainerDataContext: null, // The data of the lgical container - if such thing exists/is defineable.
		
		reportSink: function(success, message) {}
	};
}