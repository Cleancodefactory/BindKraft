

function DummyInterfaceProxyBuilder() {
	ProxyInterfaceBuilderBase.apply(this, arguments);
	// the Dummy ignores the transport
}
DummyInterfaceProxyBuilder.Inherit(ProxyInterfaceBuilderBase,"DummyInterfaceProxyBuilder");
DummyInterfaceProxyBuilder.Implement(IProxyInterfaceBuilder);
DummyInterfaceProxyBuilder.proxyMethodBody = function(key) { return new Function('return this.$instance.' + key + '.apply(this.$instance, arguments);'); }
DummyInterfaceProxyBuilder.prototype.buildProxy = function (instnce, interfaceDef) {
	this.LASTERROR().clear();
    if (BaseObject.is(instnce, interfaceDef)) {
		var instanceClass = Class.getClassDef(instnce);
		if (instanceClass == null) {
			this.LASTERROR(-1,"Instance class cannot be determined or is not BaseObject.");
		} else {
			var proxycls = ProxyStubBuildingRoutines.buildProxyClass(null, instanceClass, Class.getInterfaceDef(interfaceDef),DummyInterfaceProxyBuilder.proxyMethodBody);
			if (proxycls == null) {
				this.LASTERROR(-1,"Cannot create proxy class definition");
			} else {
				var prxy = new proxycls(instnce,null); // Null transport
				return prxy;
			}
		}
    } else {
		this.LASTERROR(-1,"The instance does not support the interface.");
    }
	return null;
};
DummyInterfaceProxyBuilder.Default = (function() {
	var pbinstance; 
	return function() {
		if (pbinstance == null) {
			pbinstance = new DummyInterfaceProxyBuilder();
		}
		return pbinstance;
	}
})();