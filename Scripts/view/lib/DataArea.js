


//// BEGIN DATA UTILITIES ////
/*
    Example how to use the preloaded mode (packetmode). In this mode the data area uses a TemplateSwitcher inside to display a view received in the response. Also
    it allows initial content to be present in the very view in which the data area is defined and the template switcher can contain it.
    In order this to work the following things happen:
        packetmode - the parameter if nonempty specifies a property name under the root of the received response under which the work data resides (the same data which will
                     be the only response in normal mode).
        setviewto - specifies a key path to the template switcher to which the received view will be injected. This can also be a binding to the template switcher. Multiple
                    template switchers (parent/child* key syntax) are supported and then the same view is set to all of them.
        viewpath  - the dottedpath to the view relative to the root of the response data. This will work even if packetmode is not set and the view is contained as string
                    somewhere in the data.
        #contentflags - can be a number containing the required flags or -1 to request everything from the server. This instructs the connector to request all kinds of content
                        from its source. Support depends on the connector, of course. If this is needed at all depends on how the view are returned and the need to override
                        cache management performed as part of the communication Interface implemented by the particular connector.
        countName - this is not related to this issue, but is also interesting - it specifies where the count can be obtained from the work data (not the root of the response - only
                    the data part!). Note that the count is read in two different scenarios - when request returns and when set_data of the data area is called. Which points us 
                    to the data-bind-$data binding that enables the initial data (loaded with the containing view) to enter the data area and act almost as data received in a 
                    response to a request through the connector. The difference is that no view is fetched (as the assumption is that the view may or may not be part of the work data 
                    this cannot be done transparently and this is why it is NOT done on set_data).
        $datachangedevent - This event should be used to trigger elements attached to the data area (pagers, sorting headers). Why? In this scenario we fill the data area in two 
                    different manners and handling the request-response related events will not cover the case when the data is attached from the initial datacontext of the
                    containing view.
    <div data-class="DataArea contentaddress='post:apps/pack.asp?$pread=testdataarea/init.tracks' packetmode='data' setviewto='./contentcontainer' viewpath='views.normal'"
			data-parameters="countName='count.value' #contentflags='-1'"
			data-key="tracksda"
			data-parameters="connectorType='AjaxXmlConnector'"
			data-bind-$limit="{read source=static number='10'}"
			data-bind-$offset="{read source=static number='1'}"
			data-on-$countsetevent="{bind source=./pager path=updatePager}"
			data-on-$datachangedevent="{bind source=self path=loadCount}"
			data-bind-$data="{read source=parentcontext path=tracks debug=viewroot:onDebug}"
	>
*/

function DataArea() {
    Base.apply(this, arguments);
}

DataArea.Inherit(Base, "DataArea");
DataArea.Implement(IFreezable);
DataArea.Implement(IParameters);
DataArea.Implement(IPlatformUrlMapperImpl);
DataArea.prototype.init = function() {
    if (this.root != null) this.root.hasDataContext = true;
};
DataArea.prototype.obliterate = function() {
    // It is risky to obliterate the connectors. They should be ok.
    delete this.$contentConnector;
    delete this.$countConnector;
    Base.prototype.obliterate.call(this);
};
// Parameters
DataArea.ImplementProperty("lastCallProcessing", new InitializeBooleanParameter("Set this to true to instruct the area to use connector in last call mode - concurrent calls are ignored, only the last is actually processed.", false));
DataArea.prototype.reloadOnChange = new InitializeBooleanParameter("Reload the data area on order change (only with the dedicated methods - not the properties!!!)", true);
DataArea.ImplementProperty("resetdironneworder",new InitializeBooleanParameter("Reset the order direction to ASC if a new column is set for ordering", false) , "resetDirOnNewOrder");
DataArea.prototype.limitName = new InitializeStringParameter("The name of the limit parameter sent to the server", "numrows");
DataArea.prototype.offsetName = new InitializeStringParameter("The name of the limit parameter sent to the server", "startrowindex");
DataArea.prototype.reportedOffsetName = new InitializeStringParameter("The name of the field in which the server may set the actual offset returned. If not null the DataArea will check this and synch its position accordingly. If the count is determined with separate request this field is expected in the response of that request and not as part of the data!", "startrowindex");
DataArea.prototype.orderName = new InitializeStringParameter("The name of the sort field parameter sent to the server", "fieldtosort");
DataArea.prototype.orderDirName = new InitializeStringParameter("The name of the order direction parameter sent to the server", "sortdirection");
DataArea.prototype.connectorType = new InitializeStringParameter("The type of connector to create when a string is passed instead of connector to the address parameters.", "AjaxXmlConnector");
DataArea.prototype.countName = new InitializeStringParameter("The name of the count in the returned data by the count connector (itemscountaddress).", "count");
DataArea.ImplementProperty("contentaddress", new Initialize("URL/address or connector from/to which to fetch/store data.", null));
DataArea.ImplementProperty("itemscountaddress", new Initialize("URL/address or connector from which to fetch data items count (if paging is a concern).", null));
DataArea.ImplementProperty("limit", new InitializeNumericParameter("Page size", 10));
DataArea.ImplementProperty("offset", new InitializeNumericParameter("Start record", 1));
DataArea.ImplementProperty("order", new InitializeStringParameter("Field name or list of names by which to order the fetched data.", null));
DataArea.ImplementProperty("direction", new InitializeNumericParameter("Sort direction.", 0));
DataArea.ImplementProperty("bindhost", new Initialize("Binding host for the connector. If null the DataArea will set itself as host.", null));
DataArea.ImplementProperty("contentflags", new Initialize("Specific option for some connectors. Override content request flags. -1 will set this to STUFFRESULT.ALL", null));
DataArea.ImplementProperty("packetmode", new Initialize("If this is nonempty string the content connector will be instructed to return the packet root - i.e. all the data with views, resources and so on. The value specified must be the property under data returned by the connector where the actual data resides (usually 'data'). If not specified or empty only the data will be reported back. Note that this is supported only by some connectors and will cause unexpected data structure results with others.", null));
DataArea.ImplementProperty("setviewto", new InitializeStringParameter("Address to a template switcher inside the DataArea to which the returned view (normal) is set. Usable only together with packetmode = true and suitable connector.",null));
DataArea.ImplementProperty("viewpath", new InitializeStringParameter("String that specifies dotted path to the view in the result. The path is from the received data root no matter the packetmode.",null));

// Events
DataArea.prototype.preloadevent = new InitializeEvent("Fired before any load operation starts - both for data and count. Use this event in bindings setting parameters on the data area.");
DataArea.prototype.dataloadedevent = new InitializeEvent("Fired whenever data has been loaded. prototype: handler(sender_dataarea,loaded_data)");
DataArea.prototype.dataappliedevent = new InitializeEvent("Fired whenever data has been applied after loading. prototype: handler(sender_dataarea,loaded_data)");
DataArea.prototype.loaderrorevent = new InitializeEvent("Fired whenever error has occurred during data loading. prototype: handler(sender_dataarea,error_info)");
DataArea.prototype.loadfinishedevent = new InitializeEvent("Fired whenever data load operation finishes (after the success and error events). prototype: handler(sender_dataarea,succes_failure_boolean)");
DataArea.prototype.loadstartedevent = new InitializeEvent("Fired whenever data load operation starts. prototype: handler(sender_dataarea,connector)");
DataArea.prototype.countsetevent = new InitializeEvent("Fired whenever the item count is set.");

DataArea.ImplementReadProperty("isloading", new InitializeBooleanParameter("Rised only while data is loading (not count)", false));

// Note: Count can be set directly or fetched through the itemscount specified address/connector
DataArea.prototype.$count = null;
DataArea.prototype.get_count = function() {
    return this.$count;
};
DataArea.prototype.set_count = function(v) {
    this.$count = v;
    this.$iscountdirty = false;
    this.countsetevent.invoke(this, v);
};
DataArea.ImplementIndexedProperty("parameters", new InitializeObject("Random parameters for binding access: data-bind-parameters[<someparam>]."));
DataArea.prototype.$genParameters = function() { // Generates a parameters collection ready for the connector's parameters
    var params = this.get_parameters();
    if (params == null) params = { };
    var v = this.get_limit();
    if (v != null) v = parseInt(v, 10);
    if (!isNaN(v)) params[this.limitName] = v;
    v = this.get_offset();
    if (v != null) v = parseInt(v, 10);
    if (!isNaN(v)) params[this.offsetName] = v;
    v = this.get_order();
    if (v != null && typeof v == "string" && v.length > 0) {
        params[this.orderName] = v;
        v = this.get_direction();
        if (v != null) {
            v = parseInt(v, 10);
            if (!isNaN(v)) {
                v = (v < 0) ? "DESC" : "ASC";
                params[this.orderDirName] = v;
            }
        }
    }
    return params;
};
DataArea.prototype.$prepareConnector = function() {
	if (this.__obliterated) return;
    var m = this.get_contentaddress();
    if (m != null) {
        if (BaseObject.is(m, "Connector")) {
            this.$contentConnector = m;
            m.set_parameters(this.$genParameters());
            return true;
        } else if (BaseObject.is(m, "string")) {
            if (this.connectorType != null && Function.classes[this.connectorType] != null) {
                if (!BaseObject.is(this.$contentConnector, this.connectorType)) {
                    // Different connector - replace it
                    var host = this.get_bindhost();
                    var opts = { moduleName: this.get_modulename() };
                    if (this.get_lastCallProcessing()) opts.last = true;
					if (this.get_packetmode() != null && this.get_packetmode() != "") opts.packetMode = true;
					if (this.get_contentflags() != null) {
						if (this.get_contentflags() == -1) {
							opts.contentFlags = STUFFRESULT.ALL;
						} else {
							opts.contentFlags = this.get_contentflags();
						}
					}
                    if (host == null) {
                        this.$contentConnector = new Function.classes[this.connectorType](m, this, opts);
                    } else {
                        this.$contentConnector = new Function.classes[this.connectorType](m, host, opts);
                    }
                } else {
                    this.$contentConnector.resetState(m);
                }
                this.$contentConnector.set_parameters(this.$genParameters());
                return true;
            }
        }
    }
    return false; // helps the comm methods to bail out
};
DataArea.prototype.$contentConnector = null;
// Helper resolving the setviewto parameter
DataArea.prototype.$setViewToTarget = function(view) {
	var r = this.get_setviewto();
	var obj = null;
	if (BaseObject.is(r, "TemplateSwitcher")) {
		r.set_template(view);
	} else if (typeof r == "string") {
		obj = JBUtil.getRelatedElements(this.root, r);
		if (obj != null && obj.length > 0) {
			for (var i = 0; i < obj.length; i++) {
				if (BaseObject.is($(obj[i]).activeclass(), "TemplateSwitcher")) {
					$(obj[i]).activeclass().set_template(view);
				}
			}
		}
	}
}
// Created on first use
DataArea.prototype.$contentLoaded = function (result, success, err_info) {
    this.$isloading = false;
	if (this.__obliterated) return;
    if (success === false) {
        if (!this.get_lastCallProcessing()) this.loaderrorevent.invoke(this, err_info);
        this.loadfinishedevent.invoke(this, false);
    } else {
		var resource = result;
		if (this.get_packetmode() != null && this.get_packetmode() != "") {
			resource = result[this.get_packetmode()];
		}
        this.root.dataContext = resource;
		if (this.get_viewpath() != null) {
			var v = BaseObject.getProperty(result, this.get_viewpath());
			if (v != null) {
				this.$setViewToTarget(v);
			}
		}
        this.dataloadedevent.invoke(this, resource);
        this.set_data(resource);
		this.dataappliedevent.invoke(this, resource);
        this.loadfinishedevent.invoke(this, true);
    }
};
DataArea.prototype.$callbackContent = new InitializeMethodDelegate("Revive the newly loaded data and perform the necessary steps for the inner content", DataArea.prototype.$contentLoaded);
DataArea.prototype.OnBeforeDataContextChanged = function() {
	Base.prototype.OnBeforeDataContextChanged.apply(this, arguments);
	var resource = this.get_data();
	if (this.get_itemscountaddress() == null || this.get_itemscountaddress() == "") {
		var count;
		if (BaseObject.is(resource, "Array") && resource.length > 0) {
			count = BaseObject.getProperty(resource[0], this.countName, null);
		} else {
			count = BaseObject.getProperty(resource, this.countName, null);
		}
		if (!IsNull(count)) {
			this.set_count(count);
		} else if (this.countName != null && this.countName.length > 0) {
			this.set_count(0);
			this.$iscountdirty = true;
		}
	} else {
		this.$iscountdirty = true;
	}
	// Base.prototype.OnBeforeDataContextChanged.apply(this, arguments);
}
// Outlets
DataArea.prototype.resetDataContext = function() {
    this.set_data(null);
    this.set_count(0);
};
DataArea.prototype.loadContent = function() { // No arguments - everything is collected from parameters and bindings
	if (this.__obliterated) return;
	this.preloadevent.invoke(this, this.get_parameters());
    if (this.$prepareConnector()) {
        this.$isloading = true;
        this.loadstartedevent.invoke(this, this.$contentConnector);
        this.$contentConnector.bind(this.$callbackContent);
    } else {
        jbTrace.log("Error: The loadContent failed to prepare connector for fetching the data. Check your parameters, look for missed quotes and so on.");
    }
};
DataArea.prototype.loadNewContent = function() {
    this.set_offset(DataArea.DefaultValueOf("$offset", this));
    this.loadContent();
};
// Initiator through data binding - writing to this property a convertable to true value will start the action
DataArea.prototype.set_startloading = function(v) {
    if (v) this.loadContent();
};
DataArea.prototype.get_startloading = function() {
    return null;
};
// Count loading
DataArea.prototype.$countConnector = null;
// Created on first use

DataArea.prototype.$prepareCountConnector = function() {
	if (this.__obliterated) return;
    var m = this.get_itemscountaddress();
    if (m != null) {
        if (BaseObject.is(m, "Connector")) {
            this.$countConnector = m;
            m.set_parameters(this.$genParameters());
            return true;
        } else if (BaseObject.is(m, "string")) {
            if (this.connectorType != null && Function.classes[this.connectorType] != null) {
                if (!BaseObject.is(this.$countConnector, this.connectorType)) {
                    // Different connector - replace it
					var opts = { moduleName: this.get_modulename() };
                    var host = this.get_bindhost();
                    if (host == null) {
                        this.$countConnector = new Function.classes[this.connectorType](m, this, opts);
                    } else {
                        this.$countConnector = new Function.classes[this.connectorType](m, host, opts);
                    }
                } else {
                    this.$countConnector.resetState(m);
                }
                this.$countConnector.set_parameters(this.$genParameters());
                return true;
            }
        }
    }
    return false; // helps the comm methods to bail out
};

DataArea.prototype.$countLoaded = function (resource, success, err_info) {
	if (this.__obliterated) return;
    if (success === false) {
        // Nothing
    } else {
        if (resource != null) {
		   if (this.reportedOffsetName != null && typeof resource == "object" && resource[this.reportedOffsetName] != null) {
                var offset = parseInt(resource[this.reportedOffsetName], 10);
                if (!isNaN(offset) && offset > 0) this.set_offset(offset);
            }
            if (typeof resource == "number") {
                this.set_count(resource);
            } else if (resource[this.countName] != null) {
                this.set_count(resource[this.countName]);
            }
        } else {
            this.set_count(0);
        }
    }
};
DataArea.prototype.$callbackCount = new InitializeMethodDelegate("Revive the newly loaded data and perform the necessary steps for the inner count", DataArea.prototype.$countLoaded);
DataArea.ImplementReadProperty("iscountdirty", new InitializeBooleanParameter("Indicates if the count has not been refreshed after the last data load"));
DataArea.prototype.loadCount = function() { // No arguments - everything is collected from parameters and bindings
	this.preloadevent.invoke(this, this.get_parameters());
    if (this.$prepareCountConnector()) {
        this.$countConnector.bind(this.$callbackCount);
    } else {
        jbTrace.log("Error: The loadCount failed to prepare connector for fetching the data");
    }
};
DataArea.prototype.loadCountIfDirty = function () { // No arguments - everything is collected from parameters and bindings
    if (!this.$iscountdirty) return;
    if (this.$prepareCountConnector()) {
        this.preloadevent.invoke(this, this.get_parameters());
        this.$countConnector.bind(this.$callbackCount);
    } else {
        jbTrace.log("Error: The loadCount failed to prepare connector for fetching the data");
    }
};
// Initiator through data binding - writing to this property a convertable to true value will start the action
DataArea.prototype.set_startloadingcount = function(v) {
    if (v) this.loadCount();
};
DataArea.prototype.get_startloadingcount = function() {
    return null;
};
DataArea.prototype.setOrderColumn = function(e_src, dc, binding, bparam) {
    var p = bparam;
    if (BaseObject.is(p, "string") && p.trim().length == 0) p = null;
    var oldcolumn = this.get_order();
    this.set_order(p);
    if (oldcolumn != p) {
        if (this.resetDirOnNewOrder) this.set_direction(0);
        if (this.reloadOnChange) {
            //this.loadContent();
            this.gotoFirstPage();
        }
    }
};
DataArea.prototype.setOrderColumnAndDirection = function (e_src, dc, bninding, bparam) {
    var p = bparam;
    var dir = null;
    if (BaseObject.is(p, "string") && p.trim().length == 0) p = null;
    if (p != null) {
        var arr = p.split(/\s+/i);
        if (arr != null && arr.length > 1) {
            p = arr[0].trim();
            dir = arr[1].trim().toLowerCase();
        }
    }
    var oldcolumn = this.get_order();
    this.set_order(p);
    if (oldcolumn != p || dir != null) {
        if (dir != null) {
            switch (dir) {
                case "asc":
                    this.set_direction(1);
                    break;
                case "desc":
                    this.set_direction(-1);
                    break;
                default:
                    this.set_direction(0);
            }
        } else {
            if (this.resetDirOnNewOrder) this.set_direction(0);
        }
        if (this.reloadOnChange) {
            //this.loadContent();
            this.gotoFirstPage();
        }
    }
};
DataArea.prototype.setOrderDirection = function(e_src, dc, binding, bparam) {
    var d = this.get_direction();
    if (bparam != null && BaseObject.is(bparam, "string")) {
        switch (bparam.trim()) {
        case "asc":
            this.set_direction(1);
            break;
        case "desc":
            this.set_direction(-1);
            break;
        case "toggle":
            this.set_direction((d < 0) ? 1 : -1);
            break;
        }
    } else {
        this.set_direction((d < 0) ? 1 : -1);
    }
    if (d != this.get_direction()) {
        if (this.reloadOnChange) {
            //this.loadContent();
            this.gotoFirstPage();
        }
    }
};
// Virtual code
DataArea.prototype.gotoOffset = function (n) {
    var oldoffset = this.get_offset();
    if (n != oldoffset) {
        this.set_offset(n);
        if (this.reloadOnChange) {
            this.loadContent();
        }
    }
}
// Paging code
DataArea.prototype.get_totalpages = function() {
    var ic = this.get_count();
    if (ic == null) return null;
    var ps = this.get_limit();
    if (ps == null || ps == 0) return null;
    var count = ic / ps;
    if ((ic % ps) == 0) return count;
    return Math.floor(count) + 1;
};
DataArea.prototype.get_page = function() {
    if (this.get_offset() == null || this.get_offset() < 0) return null;
    return Math.floor((this.get_offset() - 1) / this.get_limit()) + 1;
};
DataArea.prototype.set_page = function(v) {
    var tp = this.get_totalpages();
    var p = v;
    if (tp != null) {
        // Pages are known
        if (p > tp) p = ((tp > 0)?tp:1);
    }
	if (p < 1) p = 1;
	var newOffset = (p - 1) * this.get_limit() + 1;
	if (newOffset != this.get_offset()) {
		this.set_offset(newOffset);
		if (this.reloadOnChange) {
			this.loadContent();
		};
	}
    
    
};
DataArea.prototype.gotoPrevPage = function() {
    var o = parseInt(this.get_offset(), 10) - parseInt(this.get_limit(), 10);
    if (o < 1) o = 1;
    this.set_offset(o);
    this.loadContent();
};
DataArea.prototype.get_hasprevpage = function() {
    var count = this.get_count();
    if (count == null) {
        return true;
    } else {
        var cnt = this.get_totalpages();
        if (cnt != null && cnt > 0) {
            if (this.get_page() > 1) return true;
        }
    }
    return false;
};
DataArea.prototype.get_hasnextpage = function() {
    var count = this.get_count();
    if (count == null) {
        return true;
    } else {
        var cnt = this.get_totalpages();
        if (cnt != null && cnt > 0) {
            if (this.get_page() < cnt) return true;
        }
    }
    return false;
};
DataArea.prototype.get_haslastpage = function() {
    if (this.get_count() != null) {
        var cnt = this.get_totalpages();
        if (cnt != null && cnt > 0) {
            if (this.get_page() < cnt) return true;
        }
    }
    return false;
};

DataArea.prototype.gotoNextPage = function() {
    if (this.get_hasnextpage()) {
        var o = parseInt(this.get_offset(), 10) + parseInt(this.get_limit(), 10);
        this.set_offset(o);
        this.loadContent();
    }
};
DataArea.prototype.gotoFirstPage = function() {
    this.set_offset(1);
    this.loadContent();
};
DataArea.prototype.gotoLastPage = function() {
    if (this.get_totalpages() != null) {
        this.set_page(this.get_totalpages());
    }
};