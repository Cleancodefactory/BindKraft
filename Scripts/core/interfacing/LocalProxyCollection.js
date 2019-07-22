function LocalProxyCollection(arr) {
	BaseObject.apply(this, arguments);
	this.$collection = arr || [];
}
LocalProxyCollection.Inherit(BaseObject, "LocalProxyCollection");
LocalProxyCollection.Implement(ILocalProxyCollection);
// ILocalProxyCollection
LocalProxyCollection.prototype.count = function() {
	return this.$collection.length;
}
LocalProxyCollection.prototype.item = function(index) {
	if (index >= 0 && index < this.$collection.length) {
		return this.$collection[index];
	}
	return null;
}
// Util (local use only)
LocalProxyCollection.prototype.put = function(args) {
	this.LASTERROR().clear();
	var cnt = 0;
	for (var i = 0; i < arguments.length; i++) {
		if (BaseObject.is(arguments[i], "IManagedInterface")) {
			this.$collection.push(arguments[i]);
			cnt ++;
		} else {
			this.LASTERROR(_Errors.compose(), "The items in the LocalProxyCollection have to support IManagedInterface at least", "put");
		}
	}
	return cnt;
}
LocalProxyCollection.prototype.remove = function() {
	var args = Array.createCopyOf(arguments);
	for (var i = this.$collection.length - 1; i >= 0; i++) {
		if (args.Any(Predicates.Equals(this.$collection[i]))) {
			this.$collection.splice(i,1);
		}
	}
}
LocalProxyCollection.prototype.clear = function() {
	this.$collection = [];
}