function EnvironmentContext(parentEnv) {
	BaseObject.apply(this,arguments);
	if (BaseObject.is (parentEnv,"IEnvironmentContext")) {
		this.$parentEnvironment = parentEnv;
	}
};
EnvironmentContext.Inherit(BaseObject,"EnvironmentContext");
EnvironmentContext.Implement(IEnvironmentContext);
EnvironmentContext.prototype.$parentEnvironment = null;
EnvironmentContext.prototype.$envdata = new InitializeObject("holds the environment vars");
EnvironmentContext.prototype.getEnv = function(key,defval) {
	return BaseObject.getProperty(this.$envdata, key, defval);
};
EnvironmentContext.prototype.setEnv = function(key, val) {
	BaseObject.setProperty(this.$envdata, key, BaseObject.DeepCloneData(val));
	return this.getEnv(key);
};
EnvironmentContext.prototype.setEnvRaw = function(key, val) {
	BaseObject.setProperty(this.$envdata, key, val);
	return this.getEnv(key);
};
EnvironmentContext.prototype.cloneEnvironent = function() { 
	return BaseObject.DeepCloneData(this.$envdata);
};
EnvironmentContext.prototype.getEnvVarnames = function() {
	var arr = [];
	for (var i in this.$envdata) {
		arr.push(i);
	}
	return arr;
};
EnvironmentContext.prototype.unsetEnv = function(key) {
	if (arguments.length === 0) {// unset all
		var arr = this.getEnvVarnames();
		for (var i = 0; i < arr.length; i++) {
			delete this.$envdata[arr[i]];
		}
	} else {
		delete this.$envdata[key];
	}
};
EnvironmentContext.$Global = null;
EnvironmentContext.Global = function() {
	if (this.$Global == null) {
		this.$Global = new EnvironmentContext();
	}
	return this.$Global;
};