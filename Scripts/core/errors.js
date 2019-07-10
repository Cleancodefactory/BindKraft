var _Errors = {
	compose: function(success,facility,facility_args) {
		var code = this.$facilityCompose.apply(this,Array.createCopyOf(arguments,1));
		return (code | (success?GeneralCodesFlags.Ok:GeneralCodesFlags.Failure));
	},
	$facilityCompose: function(facility, args) {
		var _facility = 1;
		if (typeof facility == "number") _facility = facility;
		var fn = "f"+_facility;
		if (typeof this.facility[fn] == "function") {
			return this.facility[fn].apply(this, Array.createCopyOf(arguments,1));
		} else {
			return this.facility["f1"].apply(this, Array.createCopyOf(arguments,1));
		}
	},
	facility: {
		"f1": function(kind, code) {
			return (kind & GeneralCodesFlags.Kind_Mask) | (code & GeneralCodesFlags.Code_Mask) | GeneralCodesFlags.Facility_General;
		}
	}
};