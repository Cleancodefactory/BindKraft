function DataStateQuery(state,binding){this.state=state;this.binding=binding;}DataStateQuery.Inherit(BaseObject,"DataStateQuery");DataStateQuery.registerStructuralQueryAlias("datastatechanged",function(param,data){return new DataStateQuery(0,binding);});