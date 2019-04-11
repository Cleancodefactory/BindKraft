


/*ENUM*/
// Used internally by the data-class parameterization routines
var ParameterTypeEnum = {
    string: 0,
    number: 1,
    binding: 2, // Not used, deprecation is considered. Use boundproperty instead
    boundproperty: 3,
	"boolean": 4,
	"date": 5 // Not yet fully supported.
};