
/* FOR DEPRECATION */
/*
	We should probably have an implementer like this, but only as a specialized version of the ITemplateSourceImpl)
*/


/*INTERFACE*/
function ITemplateSourceImpl() {}
ITemplateSourceImpl.InterfaceImpl(ITemplateSource);
ITemplateSourceImpl.classInitialize = function(cls, defaultTemplateSelector) {
	cls.ImplementProperty("templateName", new InitializeStringParameter("Template selector",defaultTemplateSelector));
	cls.prototype.get_template = function() {
		var tml = this.$template;
		// If a template has been set explicitly - use that one
		if (tml != null) return tml;
		// If we are ITemplateConsumer - try to consume from source
		if (this.is("ITemplateConsumer")) {
			var tmlSrc = this.get_templateSource();
			if (tmlSrc != null) {
				tml = tmlSrc.get_template();
				if (tml != null) return tml;
			}
		}
		// Try global DOM
		var tn =this.get_templateName();
		if (tn != null) {
			tml = $(tn);
			if (tml != null && tml.length > 0) return $(tml.children().get(0)).clone().get(0);
			tml = null;
		}
		return null;
	}
	cls.prototype.set_template = function(v) {
		this.$template = v;
	}
};