


// The state is currently unused (no longer - it is now used). The query itself indicates a state change will happen when updating sources.
/*CLASS*/ /*QUERY*/
function DataStateQuery(state, binding) {
    this.state = state;
    this.binding = binding;
}
DataStateQuery.Inherit(BaseObject, "DataStateQuery");
DataStateQuery.registerStructuralQueryAlias("datastatechanged", function(param,data) {
	return new DataStateQuery(0,binding);
});