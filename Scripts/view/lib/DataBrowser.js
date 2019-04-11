function DataBrowser() {
	Base.apply(this, arguments);
}
DataBrowser.Description("A simple template switcher driver for showing data. The template must contain the sub-templates for the different types (see TemplateSelector method for details)");
DataBrowser.Inherit(Base, "DataBrowser");
DataBrowser.Implement(IUIControl);
DataBrowser.ImplementProperty("onlydata", new InitializeBooleanParameter("Filter out functions and other stuff.", false));
DataBrowser.ImplementProperty("detailed", new InitializeBooleanParameter("Filter out functions and other stuff.", false));
DataBrowser.ImplementProperty("item", new Initialize("Data"));
DataBrowser.ImplementProperty("expanded", new InitializeBooleanParameter("Expanded visualization of the data.", false));

DataBrowser.prototype.TemplateSelector = function(switcher) {
	var data = switcher.get_item();
    if (data != null) {
        if (BaseObject.is(data, "Array")) {
            return switcher.getTemplateByKey("array");
        } else if (typeof data == "object") {
			if (this.get_detailed()) {
				if (BaseObject.is(data, "BaseObject")) {
					return switcher.getTemplateByKey("BaseObject");
				} else if (BaseObject.is(data,"Date")) {
					return switcher.getTemplateByKey("date");
				} else {
					return switcher.getTemplateByKey("object");
				}
			} else {
				return switcher.getTemplateByKey("object");
			}
        } else if (typeof data == "string") {
            return switcher.getTemplateByKey("string");
        } else if (typeof data == "number") {
            return switcher.getTemplateByKey("number");
        } else if (typeof data == "boolean") {
            return switcher.getTemplateByKey("boolean");
        } else if (typeof data == "function") {
			if (this.get_onlydata()) return null;
            return switcher.getTemplateByKey("function");
        } else if (typeof data == "undefined") {
            return switcher.getTemplateByKey("undefined");
        } else {
			return switcher.getTemplateByKey("null");
		}
    } else {
        return switcher.getTemplateByKey("null");
    }
}
DataBrowser.prototype.FormatObjectBriefInfo = {
	ToTarget: function(v) {
		return BaseObject.typeOf(v);
	},
	FromTarget: function(v) { return null;}
};