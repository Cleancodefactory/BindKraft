/* Interface for syntax convenience. Adds an
	easy way to create APIs where mehtods return both value and this to allow both - easy value access and chaining.
	
	example:
	
	def:
	MyClass.prototype.MyMethod1 = function() {
		......
		return this.$chainresult(returnvalue);
	}
	USing the method somewhere:
	var m = new MyClass();
	m.MyMethod1().then.MyMethod1()
	or 
	var v = m.MyMethod1().value;
	
	You have to know that the method(s) in question are designed that way - it is a syntax sugar, usable when available and not a feature that needs detection. It is an interface only as means 
	to bring the utility method intto a class definition.
*/

function IChainedResultAndValue() {}
IChainedResultAndValue.Interface("IChainedResultAndValue");
IChainedResultAndValue.prototype.$chainresult = function(v,err) {
	var r = {
		value: v,
		then: this,
	};
	if (err) {
		r.err = err;
	}
	return r;
}