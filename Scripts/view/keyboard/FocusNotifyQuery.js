/*QUERY*/
function FocusNotifyQuery(notify, direction, container) {
	BaseObject.apply(this, arguments);
	this.notify = notify;
	this.direction = direction;
	this.container = container;
};
FocusNotifyQuery.Description("Creates a query instance")
	.Param("notify","event from FocusNotifyEnum enum")
	.Param("direction","optional direction in which the event is happening")
	.Param("container", "the focus container sending the query");
FocusNotifyQuery.Inherit(BaseObject, "FocusNotifyQuery");
FocusNotifyQuery.prototype.container = 0; // The focus container sending the query
FocusNotifyQuery.prototype.notify = 0; // What is happening (value from FocusNotifyEnum)
FocusNotifyQuery.prototype.direction = 0; // In what direction (if applicable).
