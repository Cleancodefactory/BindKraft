/*

Vocabulary:
	* Holds a collection of data aspects;

*/

/*Constructor*/
function Vocabulary(name){
	BaseObject.apply(this, arguments);
	this.$name= name;
	this.$aspects= {};
};

Vocabulary.DeclarationBlock({
	//properties
	name: "r string * The name of the vocabulary",
	
	//aspects
    aspects: "r object * An array of data aspects, which define the vocabulary",	
});

Vocabulary.Inherit(BaseObject, "Vocabulary");

Vocabulary.prototype.addAspect= function(aspect){
	//this.aspects.addElement(new DataAspect(aspect, this));
	var asp= new DataAspect(aspect, this);
	if(this.$aspects.hasOwnProperty(asp.get_aspectname())) 
		throw "This vocabulary already contains an aspect with the name \""+aspect.get_aspectname()+"\".";
	this.$aspects[asp.get_aspectname()]= asp;
};

Vocabulary.prototype.getAspect= function(aspectname){
	return this.$aspects[aspectname];
};

Vocabulary.prototype.containsAspect= function(aspectname){
	return this.$aspects.hasOwnProperty(aspectname);//(!(!this.getAspect(aspectname)==true));
};

Vocabulary.prototype.removeAspect= function(aspectname){
	delete this.$aspects[aspectname];
};