function OperationDescription() {
	BaseObject.apply(this, arguments);
}
OperationDescription.Inherit(BaseObject,"OperationDescription");
OperationDescription.Implement(IOperationDescription);
OperationDescription.ImplementProperty("name", new InitializeStringParameter("The name of the operation (optional)", null));
OperationDescription.ImplementProperty("role", new InitializeStringParameter("The role of the operation (optional)", null));
OperationDescription.ImplementProperty("resulttype", new InitializeStringParameter("type name of the result - without role reported by the task, with role depends on the role see the comments in the IOperationDescription", null));
OperationDescription.ImplementProperty("description", new InitializeStringParameter("description - optional, recommended - will help the debugging and tracing", null));
