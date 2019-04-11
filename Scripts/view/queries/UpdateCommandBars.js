


// update of the containers indications for the state of the view
/*CLASS*/ /*QUERY*/
function UpdateCommandBars() { 
	BaseObject.apply(this, arguments);
}
UpdateCommandBars.Inherit(BaseObject, "UpdateCommandBars");
UpdateCommandBars.registerStructuralQueryAlias("updatecommands", function(param,binding,data) {
	return new UpdateCommandBars();
});