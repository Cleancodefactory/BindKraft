


function IDataItemsConnectorImpl() {}
IDataItemsConnectorImpl.InterfaceImpl(IDataItems, "IDataItemsConnectorImpl");
IDataItemsConnectorImpl.RequiredTypes("IConnectorToItemsContent,IConnectorToItemsCount,IItemKeyPropertiesDescriptor");
IDataItemsConnectorImpl.prototype.$filterfields = null;
IDataItemsConnectorImpl.prototype.$idfields = null;
IDataItemsConnectorImpl.prototype.get_filterfields = function() {
	if (BaseObject.is(this.$filterfields, "Array")) return this.$filterfields.join(",");
	return null;
}
IDataItemsConnectorImpl.prototype.set_filterfields = function(v) {
	this.$filterfields = null;
	if (BaseObject.is(v,"string")) {
		this.$filterfields = v.split(",");
	} else if (BaseObject.is(v, "Array")) {
		this.$filterfields = v;
	}
}
IDataItemsConnectorImpl.prototype.get_idfields = function() {
	if (BaseObject.is(this.$idfields, "Array")) return this.$idfields.join(",");
	return null;
}
IDataItemsConnectorImpl.prototype.set_idfields = function(v) {
	this.$idfields = null;
	if (BaseObject.is(v,"string")) {
		this.$idfields = v.split(",");
	} else if (BaseObject.is(v, "Array")) {
		this.$idfields = v;
	}
}
IDataItemsConnectorImpl.prototype.supplyPagedItems = function(start, end, params) {
	var result = null;
	var self = this;
	if (start == "length") {
		return (BaseObject.is(this.$items, "Array")?this.$items.length:0);
	} else {
		if (BaseObject.is(this.$items, "Array")) {
			if (start == null || start < 0) start = 1;
			var $items = this.$items;
			var j;
			if (this.$idfields != null && this.$idfields.length > 0 && params != null && params.id != null) {
				$items = $items.Select(function(idx, itm) {
					for(j =0;j<self.$idfields.length;j++) {
						if (itm[self.$idfields[j]] != null && itm[self.$idfields[j]] == params.id) {
							return itm;
						}
					}
					return null;
				});
			} else  if (this.$filterfields != null && this.$filterfields.length > 0 && params != null && params.filter != null && typeof params.filter == "string") {
				if (params.filter.length > 0) {
					$items = $items.Select(function(idx, itm) {
						for(j =0;j<self.$filterfields.length;j++) {
							if (itm[self.$filterfields[j]] != null && typeof itm[self.$filterfields[j]] == "string") {
								if (itm[self.$filterfields[j]].indexOf(params.filter) >= 0) return itm;
							}
						}
						return null;
					});
				}
			}
			if (start > 0) {
				if (end > 0) {
					result = $items.slice(start - 1, start - 1 + end);
				} else {
					result = $items.slice(start - 1);
				}
			} else {
				result = $items;
			}
		} else {
			result = this.$items; // All of them
		}
	}
	// if (BaseObject.is(result, "Array")) {
	
	// 	result = result.Select(function(idx , item) {
	// 		return {
	// 			key: item[self.get_keyproperty()],
	// 			display: item[self.get_descproperty()],
	// 			title: item[self.get_titleproperty()]
	// 		};
	// 	});
	// }
	return result;	
}
IDataItemsConnectorImpl.prototype.get_items = function() { return this.$items; }
IDataItemsConnectorImpl.prototype.set_items = function(v) {
	this.$items = v;
	if (BaseObject.is(this.$items,"Array")) {
		this.set_contentaddress("supplyPagedItems");
		this.set_itemscountaddress("supplyPagedItems.length");
		this.set_connectorType("FastProcConnector");
		this.set_bindhost(this);
		this.$prepareContentConnector();
		this.$prepareCountConnector();
		//
	} else {
		this.set_contentconnector(null);
		this.set_countconnector(null);
	}
}
