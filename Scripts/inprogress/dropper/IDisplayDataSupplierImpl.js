function IDisplayDataSupplierImpl() {}
IDisplayDataSupplierImpl.InterfaceImpl(IDisplayDataSupplier);
IDisplayDataSupplierImpl.classInitialize = function(cls) {
	cls.prototype.$displaydata = null;
	// Call this method to change the display data
	cls.prototype.$set_displaydata = function(v) {
		this.$displaydata = v;
		this.displaydataevent.invoke(this, v);
	}
}
