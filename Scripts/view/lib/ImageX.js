/*
	[結ぶ手腕]
	
*/


/*CLASS*/
// The official img element class
function ImageX(viewRootElement) {
    Base.apply(this, arguments);
    this.$basePath = "";
}
ImageX.Inherit(Base, "ImageX");
ImageX.Implement(ICustomParameterizationStdImpl,"propname","parameter","staticsource","mappath","basePath","src");
ImageX.Implement(IPlatformUrlMapperImpl);

ImageX.prototype.obliterate = function() {
	if (this.$objectUrl != null) {
		URL.revokeObjectURL(this.$objectUrl);
		this.$objectUrl = null;
	}
	Base.prototype.obliterate.apply(this,arguments);
}

ImageX.ImplementProperty("propname", new Initialize("The property to set on the DOM element on which this class is attached (usually as data-class=...)","src"));
ImageX.ImplementIndexedProperty("parameter", new InitializeObject("Paremeters replaced in the url set through the src property. They must be marked with {paramname}."));
ImageX.ImplementProperty("staticsource", new InitializeStringParameter("Sets a static source for the image. It is set on init. The rest of the functionality still works and can change it later through bindings.",null));
ImageX.ImplementProperty("mappath", new InitializeBooleanParameter("Map the resulting path, default: true, youhave to disable this for data url.",true));
ImageX.prototype.$objectUrl = null;
ImageX.prototype.set_objecturl = function(v) {
	if (this.$objectUrl != null) {
		URL.revokeObjectURL(this.$objectUrl);
		this.$objectUrl = null;
	}
	if (v instanceof Blob) {
		this.$objectUrl = URL.createObjectURL(v);
		this.root[this.get_propname()] = this.$objectUrl;
	} else if (typeof v == "string") {
		this.root[this.get_propname()] = v;
	}
}
ImageX.prototype.get_objecturl = function() {
	return this.$objectUrl;
}

ImageX.prototype.$mapPath = function(v) {
	if (this.get_mappath()) {
		return mapPath(v);
	} else {
		return v;
	}
}
ImageX.prototype.$setOriginalProp = function(v) {
	this.root[this.get_propname()] = v;
}
ImageX.prototype.init = function() {
	var staticsrc = this.get_staticsource();
	if (BaseObject.is(staticsrc, "string") && staticsrc.length > 0) {
		this.root.src = this.$mapPath(this.mapResourceUrl(staticsrc));
	}
}
ImageX.prototype.get_basePath = function() { return this.$basePath;}
ImageX.prototype.set_basePath = function(v) { this.$basePath = v; }
ImageX.prototype.get_src = function () {
    return this.root[this.get_propname()];
}.Description("Returns the actual value of the property (usually src) on the DOM element.");
ImageX.prototype.set_src = function (vin) {
	var v = this.$basePath + (vin || "");
    if (this.$parameter != null) {
        for (var p in this.$parameter) {
            var pv = this.$parameter[p];
            v = v.replace("{" + p + "}", pv == null ? "" : pv);
        }
    }
    this.$setOriginalProp(this.$mapPath(this.mapResourceUrl(v)));
}.Description("Sets the property (usually src) on the DOM element after calcualating the actual value");