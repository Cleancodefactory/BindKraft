

/*INTERFACE*/
function IItemTemplateSourceImpl() {}
IItemTemplateSourceImpl.InterfaceImpl(IItemTemplateSource, "IItemTemplateSourceImpl");
IItemTemplateSourceImpl.RequiredTypes("Base");
IItemTemplateSourceImpl.ForbiddenTypes("BaseWindow");
IItemTemplateSourceImpl.classInitialize = function(cls, autofill, _singleTemplate, _singleTemplateConsumerKey) {
	var singleTemplate = false; // Def closure set once (readonly)
	if (_singleTemplate === true || _singleTemplate == "single") {
		singleTemplate = true;
	}

	if (autofill) {
		if (singleTemplate) {
			cls.ImplementProperty("singletemplateconsumerkey", new InitializeStringParameter("...", _singleTemplateConsumerKey));
			ICustomParameterizationStdImpl.addParameters(cls, "singletemplateconsumerkey");
			cls.ExtendMethod("inspectTemplate", function() {
				var template = this.root.innerHTML;
				if (template != null && !/^\s*$/.test(template)) this.set_itemTemplate(template);
				DOMUtil.Empty(this.root);
			}, true);
		} else {
			cls.ExtendMethod("inspectTemplate", function() {
				var templates = IItemTemplateSource.collectItemTemplatesFromDom(this.root);
				if (templates != null) this.set_itemTemplate(templates);
				DOMUtil.Empty(this.root);
			},true);
		}
	}

	if (singleTemplate) {
		cls.prototype.$itemtemplate = null;
		cls.prototype.set_itemTemplate = function(template) {
			this.$itemtemplate = template;
		}
		cls.prototype.get_itemTemplate = function() {
			if (this.$itemtemplate != null)	return this.$itemtemplate;
			return IItemTemplateConsumer.ConsumeTemplate(this, this.get_singletemplateconsumerkey());
		}
	} else {
		cls.prototype.$itemtemplate = new InitializeObject("Object containing all item templates");
		cls.prototype.set_itemTemplate = function(index, template) {
			if (arguments.length > 1) {
				this.$itemtemplate[index] = template;
			} else {
				if (index == null) {
					this.$itemtemplate = {};
				} else {
					if (typeof index == "object") {
						this.$itemtemplate = BaseObject.CombineObjects(this.$itemtemplate, index);
					}
				}
			}
		}
		cls.prototype.get_itemTemplate = function(index) {
			if (index == null) return this.$itemtemplate;
			var tml = this.$itemtemplate[index];
			if (tml != null) return tml;
			return IItemTemplateConsumer.ConsumeTemplate(this, index);
		}
	}
}

