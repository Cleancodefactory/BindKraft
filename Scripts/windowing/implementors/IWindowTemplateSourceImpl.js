
/*
	templateName - name of a template to fetch. The name has to follow certain rule so thaat we can support loading from different locations/sources using the same name but in different ways of parsing it.
	templateName :== <module_or_namespace>/<template_name>
		<module_or_namespace> :== a name of a logical unit containing the template. IT can be real - module name in CoreKraft, but it also can be imaginary/virtual.
		<template_name> :== the name of the specific template in the aforementioned logical unit, must bne unique in the unit.
	
	This searches both registers and if nothing is found - the DOM
	- in register it should be in the module's sub-branch under the <template_name>
	- in the DOM it should be under id or class named:
		<module_or_namespace>_<template_name>
		
	Example with legacy
	1: MuyClass.Implement(ITemplateSourceImpl, "moduleX/templatename", { legacy: true});
	2: MuyClass.Implement(ITemplateSourceImpl, new Default("templateName", "legacyname"), { legacy: new Default("legacytemplate",false)});
	MuyClass.$defaults = {
		templateName: "stylingmodule/templatename", // If styling module updated it, nothing if no stylingmodule is loaded
		legacytemplate: true // Styling modules should change this to false or delete the entry.
	}
*/


/*INTERFACE IMPL (BaseWindow)*/
function IWindowTemplateSourceImpl() {}
IWindowTemplateSourceImpl.InterfaceImpl(ITemplateSource);
IWindowTemplateSourceImpl.RequiredTypes("BaseWindow");
IWindowTemplateSourceImpl.classInitialize = function(cls, defaultTemplateSelectorOrConnector, options) {
	// For backward compatibility reasons we use this.templateName
	cls.ImplementProperty("templateName", new InitializeStringParameter("syntax module/templatename or Connector instance (it is used by clonning)",defaultTemplateSelectorOrConnector),"templateName");
	cls.prototype.get_template = function() {
		var tml = this.$template;
		// If a template has been set explicitly - use that one
		if (tml != null) return tml;
		// Check for connector Defaults of get_template
		var tmlName = this.get_templateName();
		if (BaseObject.is(tmlName, "Connector")) {
			return tmlName.createNewConnector();
		} else if (typeof tmlName == "string") {
			// Legacy search is by defaultTemplateSelector without parsing
			if (BaseObject.getProperty(options, "legacy", false)) {
				tml = $$(this.get_templateName()).first().innerHtml();
				if (tml != null && tml.length > 0) {
					return tml;
				}
				tml = null;
			}
			// Try global TemplateRegister and DOM
			var tn = ITemplateSourceImpl.ParseTemplateName(this.get_templateName());
			tml = ITemplateSourceImpl.GetGlobalTemplate(tn,options);
			if (tml != null) return tml;
		}
		// Future extensions will go here
		return null;
	}
	cls.prototype.set_template = function(v) {
		this.$template = v;
	}
}.Description("")
	.Param("defaultTemplateSelector", "")
	.Param("options", "A plain object containing various options: legacy - search globaly with the name as selector; nodom - search registers only");

