function IActionRuleContextConstructor(){}IActionRuleContextConstructor.Interface("IActionRuleContextConstructor");IActionRuleContextConstructor.prototype.prepareActionRuleContext=function(context,purpose){}.Description("Sets/adds references and data to the rule context passed as parameter.").Param("context","The rule context to prepare, should not be null").Param("purpose","Optional, the purpose for which the context is built. This is a 'just in case' feature, you can ignore it for now.").Returns("Explicit true if the operation should stop after this call (establishes a scope)");IActionRuleContextConstructor.createEmptyContext=function(){return{subject:null,subjectElement:null,subjectDataContext:null,binding:null,visualContainer:null,visualContainerElement:null,visualDataContext:null,logicalContainer:null,logicalContainerDataContext:null,reportSink:function(success,message){}};};