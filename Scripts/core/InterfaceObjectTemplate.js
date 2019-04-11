/**
	Mandatory base class for classes designed for use with InterfaceObject. These are never constructed
*/
function InterfaceObjectTemplate() {
	BaseObject.apply(this,arguments);
	// Never constructed so no need to call parents
	// BaseObject.apply(this, arguments);
	// throw "InterfaceObjectTemplate and its inheritors cannot be really constructed, they are intended for use with InterfaceObject only";
}
InterfaceObjectTemplate.Inherit(BaseObject, "InterfaceObjectTemplate");