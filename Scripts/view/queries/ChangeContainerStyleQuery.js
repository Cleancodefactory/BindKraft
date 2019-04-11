



/*CLASS*/

// queries
// style changes request from a view to the card container
/*CLASS*/ /*QUERY*/
function ChangeContainerStyleQuery(o) {
	BaseObject.apply(this, arguments);
    if (o != null) {
        for (var i in o) {
            this[i] = o[i];
        }
    }
}
ChangeContainerStyleQuery.Inherit(BaseObject, "ChangeContainerStyleQuery");
ChangeContainerStyleQuery.prototype.scrollable = false;