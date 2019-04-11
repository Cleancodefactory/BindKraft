


// Thrown by elements to inform their parents that the user requested the default action to be performed.
// The default action is very subjective term and has meaning only under appropriate circumstances. For example a typical default action practice
// would be to perform submit/search or other operation with data entered in some fields in a form or part of it. So, the default action is usually
// related to the enter key, but it may vary a bit or occur only when enter is pressed in some places, but not others. 
// There are two ways to do this - by handling enter press and stopping propagation in those controls that do not want the action to be performed or
// to let them issue this query.
// NOT IMPLEMENTED YET
/*CLASS*/
function DefaultActionRequestQuery() {
	BaseObject.apply(this, arguments);
}
DefaultActionRequestQuery.Inherit(BaseObject,"DefaultActionRequestQuery");