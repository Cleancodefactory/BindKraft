

/*CLASS*/ /*ABSTRACT*/

function BaseAdapter(loadsettings) {
	this.init(loadsettings);
}
BaseAdapter.inherit(BaseObject,"BaseAdapter");

BaseAdapter.prototype.init = function(loadsettings) {
	throw "Init must be implemented in all adapters explcitly."
}
BaseAdapter.prototype.processBlock = function(block) {
}