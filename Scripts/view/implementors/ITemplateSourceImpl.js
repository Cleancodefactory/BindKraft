
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


/*INTERFACE*/
function ITemplateSourceImpl() {}
ITemplateSourceImpl.InterfaceImpl(ITemplateSource, "ITemplateSourceImpl");
ITemplateSourceImpl.RequiredTypes("Base");
ITemplateSourceImpl.ForbiddenTypes("BaseWindow");
ITemplateSourceImpl.classInitialize = function(cls, defaultTemplateSelector, options) {
	// For backward compatibility reasons we use this.templateName
	cls.ImplementProperty("templateName", new InitializeStringParameter("module/templatename",defaultTemplateSelector),"templateName");
	ICustomParameterizationStdImpl.addParameters(cls, "templateName");
	cls.prototype.get_template = function() {
		var tml = this.$template;
		// If a template has been set explicitly - use that one
		if (tml != null) return tml;
		// If we are ITemplateConsumer - try to consume from source
		tml = ITemplateConsumer.ConsumeTemplate(this);
		if (tml != null) return tml;
		tml = IItemTemplateConsumer.ConsumeTemplate(this, this.get_templateName());
		if (tml != null) return tml;
		// Legacy search is by defaultTemplateSelector without parsing
		if (BaseObject.getProperty(options, "legacy", false)) {
			tml = DOMUtil.queryOne(tmlName);
			
			if (tml !=null) return tml.innerHTML;
			tml = null;
		}
		// Try global TemplateRegister and DOM
		var tn = ITemplateSourceImpl.ParseTemplateName(this.get_templateName());
		tml = ITemplateSourceImpl.GetGlobalTemplate(tn,options);
		if (tml != null) return tml;
		// Future extensions will go here
		return null;
	}
	cls.prototype.set_template = function(v) {
		this.$template = v;
	}
}.Description("")
	.Param("defaultTemplateSelector", "")
	.Param("options", "A plain object containing various options: legacy - search globaly with the name as selector; nodom - search registers only");

ITemplateSourceImpl.GetGlobalTemplate = function (tn, options) {
	var tml;
	if (typeof tn == "string") tn = ITemplateSourceImpl.ParseTemplateName(tn);
	if (tn.name != null) {
		var regtmls = Registers.getRegister("module_templates");
		if (BaseObject.is(regtmls, "TemplateRegister")) {
            var regname = (tn.module || "default") + "/" + tn.name;
			tml = regtmls.item(regname);
            if (tml != null) {
                return tml; // found in the register
            }
		}
		if (!BaseObject.getProperty(options, "nodom", false)) {
			tml = ITemplateSourceImpl.GetTemplateFromDom(tn.module, tn.name, options);
            if (tml != null) return tml;
			tml = null; // Set to null for further methods (if any)
		}
		// Further methods can be put here. Please do not overdo it!
	}
	return null;
}
	
ITemplateSourceImpl.GetTemplateFromDom = function(module, name, options) {
	var sel = "";
	if (typeof module == "string") {
		sel += module;
	}
	if (typeof name != "string") {
		// TODO: Decide how to deal with that
		jbTrace.log("The template name has to be a string.");
	} else {
		sel += ((sel.length > 0)?("_" + name):name);
	}
	var tml = DOMUtil.queryOne("#" + sel);
	if (tml == null) tml = DOMUtil.queryOne("." + sel);
	if (tml != null) {
		return tml.innerHTML;
	}
	return null;
}

ITemplateSourceImpl.ParseTemplateName = function( tname) {
	var r = {};
	if (typeof tname == "string") {
		var arr = tname.split("/");
		if (arr != null && arr.length > 0) {
			if (arr.length > 1) {
				r.module = arr[0];
				r.name = arr[1];
			} else {
				r.module = null;
				r.name = arr[0];
			}
		}
	}
	return r;
}
/**
 * Should be called in init or $init in simple components
 */
ITemplateSourceImpl.InstantiateTemplate = function(/*Base*/ comp) {
	if (BaseObject.is(comp, "Base") && BaseObject.is(comp, "ITemplateSource")) {
		var el = new DOMUtilElement(comp.root);
        var tml = comp.get_template();
        if (tml != null) {
            el.Empty();
            el.append(tml);
        }
	}
}