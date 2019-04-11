/*
	This class carries icon specification, in future versions it may also support different image paths for different image sizes.
	The class is accepted as parameter by components suitable for icon visualization: ImageX, SvgY?
*/
function IconSpec(modulename, respath, restype, servername) {
	BaseObject.apply(this, arguments);
	if (modulename != null) {
		this.set_modulename(modulename);
	}
	if (respath != null) {
		this.set_respath(respath);
	}
	if (restype != null) {
		this.set_restype(restype);
	}
	if (servername != null) {
		this.set_servername(servername);
	}
}
IconSpec.Description("This class is designed to carry a specification of an icon. For now it does not support multiple paths for different sizes - prefer vector icons.");
IconSpec.Inherit(BaseObject, "IconSpec");
IconSpec.ImplementProperty("modulename", new InitializeStringParameter("The module name", null));
IconSpec.ImplementProperty("servername", new InitializeStringParameter("The server name", null));
IconSpec.ImplementProperty("restype", new InitializeStringParameter("Type of the resource, by default $images", "$images"));
IconSpec.ImplementProperty("respath", new InitializeStringParameter("Resource path", null));
IconSpec.ImplementChainSetters();