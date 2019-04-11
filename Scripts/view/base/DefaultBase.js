


/*CLASS*/
function DefaultBase() {
	Base.apply(this,arguments);
};
DefaultBase.Description("A Base simple derivate (no additions) for scenarios where you need only standard Base characteristics. The point is to remind the developers why the class is there - that it is intentional and to avoid functionality breakdowns in future versions of the framework.");
DefaultBase.Inherit(Base,"DefaultBase");
