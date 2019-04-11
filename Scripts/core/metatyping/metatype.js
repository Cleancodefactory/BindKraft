Class.dataSchemaVocabulary = {
	any: {
		typename: "any",
		nullable: true
	},
	number: {
		typename: "number"
	},
	bool: {
		typename: "bool"
	},
	"null": {
		typename: "null"
	},
	"string": {
		typename: "string"
	},
	"array": {
		typename: "string"
	}	
};	


function IDataSchemaElement() {}
IDataSchemaElement.Interface("IDataSchemaElement");
IDataSchemaElement.prototype.get_schemaelementname = function() { throw "not impl"; }
// Structurals ==========
/**
	helper for implementation of MetTypes - not directly used
*/
function MetaStructural() {
	BaseObject.apply(this,arguments);
}
MetaStructural.Inherit(BaseObject,"MetaStructural");
MetaStructural.Implement(IDataSchemaElement);
MetaStructural.prototype.get_schemaelementname = function() {
	return this.get_structuralname();
}
MetaStructural.prototype.get_structuralname = function() { return "structural"; };
// Keyvalue pair
function MetaStructuralKeyPair() {
	MetaStructural.apply(this,arguments);
}
MetaStructuralKeyPair.Inherit(MetaStructural,"MetaStructuralKeyPair");
MetaStructuralKeyPair.prototype.get_structuralname = function() { return "keypair"; }
MetaStructuralKeyPair.prototype.keyname = null;
MetaStructuralKeyPair.prototype.get_keyname = function() {return this.name; }
MetaStructuralKeyPair.prototype.set_keyname = function(v) {
	if (BaseObject.is(v,"IDataSchemaElement")) {
		this.name = v; 
	} else if (typeof v == "string") {
		this.name = v; 
	} else {
		throw "keyname must be string or IDataSchemaElement"
	}
	
}


//Sequence
function MetaStructuralSequence() {
	MetaStructural.apply(this,arguments);
}
MetaStructuralSequence.Inherit(MetaStructural,"MetaStructuralSequence");
MetaStructuralSequence.prototype.get_structuralname = function() { return "sequence"; }
MetaStructuralSequence.prototype.elements = new InitializeArray("Set of IDataSchemaElement");
MetaStructuralSequence.prototype.get_elementcount = function() { return this.elements.length; }
MetaStructuralSequence.prototype.get_element = function(n) { return this.elements[n]; }
MetaStructuralSequence.prototype.set_element = function(n,e) { 
	if (BaseObject.is(e,"IDataSchemaElement")) {
		this.elements[n] = e;
	} else {
		throw "the element must be IDataSchemaElement";
	}
}
MetaStructuralSequence.prototype.add = function(e) {
	if (BaseObject.is(e,"IDataSchemaElement")) {
		this.elements.push(e);
	} else {
		throw "the element must be IDataSchemaElement";
	}
}
MetaStructuralSequence.prototype.clear = function() {
	if (this.elements.length > 0) {
		this.elements.splice(0,this.elements.length);
	}
	
	
}

//Repetition
function MetaStructuralRepetition() {
	MetaStructural.apply(this,arguments);
}
MetaStructuralRepetition.Inherit(MetaStructural,"MetaStructuralRepetition");
MetaStructuralRepetition.prototype.get_structuralname = function() { return "repetition"; }
MetaStructuralRepetition.prototype.elementtype = null;
MetaStructuralRepetition.prototype.get_elementtype = function() { return this.elementtype; }
MetaStructuralRepetition.prototype.set_elementtype = function(v) { 
	if (BaseObject.is(v, "IDataSchemaElement")) {
		this.elementtype = v; 
	} else {
		throw "Attempt to set invalid elementtype";
	}
}
MetaStructuralRepetition.prototype.elementtype = null;
MetaStructuralRepetition.prototype.get_elementtype = function() { return this.elementtype; }
MetaStructuralRepetition.prototype.set_elementtype = function(v) { 
	if (BaseObject.is(v, "IDataSchemaElement")) {
		this.elementtype = v; 
	} else {
		throw "Attempt to set invalid elementtype";
	}
}
MetaStructuralRepetition.prototype.min = null;
MetaStructuralRepetition.prototype.get_min = function() {return this.min;}
MetaStructuralRepetition.prototype.set_min = function(v) {
	if (typeof v == "number" || v == null) {
		this.min = v;
	} else {
		throw "Minimal number of repetitions can be number or null only";
	}
}

// Types ==========
function MetaType() {
	BaseObject.apply(this,arguments);
}
MetaType.Inherit(BaseObject,"MetaType");
MetaType.Implement(IDataSchemaElement);
MetaType.prototype.get_typename = function() { return "any"; }
MetaType.prototype.get_schemaelementname = function() {
	return this.get_typename();
}
MetaType.prototype.get_structuralname = function() { return "type";};


	function MetaSelect() {
		MetaType.apply(this, arguments);
	}
	MetaSelect.Inherit(MetaType,"MetaSelect");
	MetaSelect.prototype.get_typename = function() { return "select"; }
	
	
	function MetaArray() {
		MetaType.apply(this, arguments);
	}
	MetaArray.Inherit(MetaType,"MetaArray");
	MetaArray.prototype.get_typename = function() { return "array"; }
	MetaArray.prototype.elementtype = null;
	MetaArray.prototype.get_elementtype = function() { return this.elementtype;}
	MetaArray.prototype.set_elementtype = function(v) { 
		if (BaseObject.is(v,MetaType)) {
			this.elementtype = v;
		} else {
			throw "elementtype must be MetaType";
		}
	}
	
	
	function MetaValue() {
		MetaType.apply(this, arguments);
	}
	MetaValue.Inherit(BaseObject,"MetaValue");
	MetaValue.prototype.get_typename = function() { return "anyvalue"; }

		function MetaNumber() {
			MetaValue.apply(this, arguments);
		}
		MetaNumber.Inherit(BaseObject, "MetaNumber");
		MetaNumber.prototype.get_typename = function() { return "number"; }

		function MetaString() {
			MetaValue.apply(this, arguments);
		}
		MetaString.Inherit(BaseObject, "MetaString");
		MetaString.prototype.get_typename = function() { return "string"; }

		
		function MetaBool() {
			MetaValue.apply(this, arguments);
		}
		MetaBool.Inherit(BaseObject, "MetaBool");
		MetaBool.prototype.get_typename = function() { return "bool"; }
		
		function MetaNull() {
			MetaValue.apply(this, arguments);
		}
		MetaNull.Inherit(BaseObject, "MetaNull");
		MetaNull.prototype.get_typename = function() { return "null"; }
		

/*
	Syntax
	identifier :== alpha(alphanumeric)*;
	space :== \s\n\r
	// object definitions
	<anytype> := (<number>|<null>|<bool>|<string>|<object>|<array>)
	<object>  := ({}|{ 
	{  }
		<key>:<value>*
		<key> := (<string>|<regexp>)
		<value> := <type>
		
		
	
	
	object :== (
		"{", space*, "}"
	);
	
	
	
*/		