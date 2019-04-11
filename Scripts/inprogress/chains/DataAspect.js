/*

DataAspect:
	* Defined by three distinct parts - the vocabulary, the format and the data structure;	
	
*/

/* Constructor has two overloads:
	* DataAspect(aspect {DataAspect});
	* DataAspect(aspect {string}, vocabulary {Vocabulary});
*/
function DataAspect(aspect, vocabulary) {
	
    // We are not too paranoic, may be we should
    BaseObject.apply(this, arguments);	
	var vocabargset= BaseObject.is(vocabulary, Vocabulary);
	
    if (BaseObject.is(aspect, "DataAspect")) {
		this.$datatag= aspect.get_datatag();
        this.$aspectname = aspect.get_aspectname();
		
		if(vocabargset)
			this.$aspectvocabulary = vocabulary;
		else
			this.$aspectvocabulary = aspect.get_aspectvocabulary();
		return;
    }

	if(!BaseObject.is(aspect, "string")) throw "Incorrect aspect name provided upon DataAspect construction.";
	
	this.$aspectname = aspect;
	if(vocabargset) this.$aspectvocabulary = vocabulary;
};

DataAspect.Inherit(BaseObject, "DataAspect");

DataAspect.prototype.$aspectvocabulary = null;
DataAspect.prototype.get_aspectvocabulary = function () { return this.$aspectvocabulary; };

DataAspect.prototype.$aspectname;
DataAspect.prototype.get_aspectname = function () { return this.$aspectname; };

//aspect name decomposition
DataAspect.prototype.get_type = function() {
	var slsind= this.$aspectname.indexOf("/");
	if(slsind==-1) return undefined;
	return this.$aspectname.substring(0, slsind);	
};

DataAspect.prototype.get_identity = function() {
	var slsind= this.$aspectname.indexOf("/");
	if(slsind==-1) return this.$aspectname;
	slsind+= 1;
	return this.$aspectname.substring(slsind, this.$aspectname.length-slsind);
};

DataAspect.prototype.$datatag = null;
DataAspect.prototype.get_datatag = function () { return this.$datatag; };
DataAspect.prototype.set_datatag = function (v) { this.$datatag = v; }.Description("Custom tag which usually hints at the purpose of the data piece. Especially if multiple items of data of the same aspect is used for different purposes.");

DataAspect.prototype.equals = function (a2) {
    var _a2 = a2;
    if (BaseObject.is(a2, "string")) {
        _a2 = new DataAspect(a2);
    }
	
    if (BaseObject.is(a2, "DataAspect")) {
        if (this.$aspectvocabulary === a2.$aspectvocabulary && this.$aspectname === a2.$aspectname) return true;
    }
	
    return false;
};