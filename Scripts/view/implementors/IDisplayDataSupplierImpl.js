/*
	The de
*/
function IDisplayDataSupplierImpl() {}
IDisplayDataSupplierImpl.InterfaceImpl(IDisplayDataSupplier, "IDisplayDataSupplierImpl");
IDisplayDataSupplierImpl.classInitialize = function(cls) {
	cls.prototype.$displaydata = null;
	// Call this method to change the display data
	
	cls.prototype.$set_displaydata = function(v) {
		this.$displaydata = v;
		this.displaydataevent.invoke(this, this.get_displaydata());
	}
	cls.prototype.get_displaydata = function() {
		return this.$displaydata;
		
	}
	cls.prototype.get_shortdisplaydata = function() {
		return this.get_displaydata();
		
	}
	
	
}
