


// Items description
/*INTERFACE*/
function IItemKeyPropertiesDescriptor() {}
IItemKeyPropertiesDescriptor.Interface("IItemKeyPropertiesDescriptor");
IItemKeyPropertiesDescriptor.ImplementProperty("keyproperty", new InitializeStringParameter("The name of the property that will be used as unique key to distinguish between the items.", "lookupkey"));
IItemKeyPropertiesDescriptor.ImplementProperty("descproperty", new InitializeStringParameter("The name of the property that will be used as display name for the items (this is what is visible for the user).", "lookupdescription"));
IItemKeyPropertiesDescriptor.ImplementProperty("titleproperty", new InitializeStringParameter("The name of the property that will be used as title for the items (this is what is visible for the user).", "title"));
IItemKeyPropertiesDescriptor.ImplementProperty("originalitemkey", new InitializeStringParameter("The name of the key under which to link the original property.","__original"));
/*INTERFACE*/ /*IMPL*/
function IItemKeyPropertiesDescriptorImpl() {}
IItemKeyPropertiesDescriptorImpl.InterfaceImpl(IItemKeyPropertiesDescriptor, "IItemKeyPropertiesDescriptorImpl");
IItemKeyPropertiesDescriptorImpl.prototype.StandardListConvertor = {
	ToTarget: function(v,b) {
		if (BaseObject.is(v,"Array")) {
			var args = FormatterBase.getFormatterParameter(arguments,"key,display,title");
			var arr = args.split(",");
			return v.ProjectAs([this.get_keyproperty(),this.get_descproperty(),this.get_titleproperty()],arr,this.get_originalitemkey());
		}
		return null;
	},
	FromTarget: function(v,b,args) {
		if (BaseObject.is(v,"Array") && this.get_originalitemkey() != null) {
			var k = this.get_originalitemkey();
			return v.Select(function(idx, itm) {
				return itm[k];
			});
		}
		return null;
	}
};