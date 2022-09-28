(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");
    var DataStateEnum = Enumeration("DataStateEnum");
    var statename = window.JBCoreConstants.entityStatePropertyName;
    var statevalues = {
        "unchanged": DataStateEnum.Unchanged,
        "new": DataStateEnum.New,
        "updated": DataStateEnum.Updated,
        "deleted": DataStateEnum.Deleted
    }

/**
 * Enables you to filter entries are in the configured states. Use like:
 * format=DataStateFilter(new unchanged updated)
 * If fed with array it will return an array that contains only the items with the specified states,
 * if fed with object will return the object if it is in one of the specified states and null otherwise
 * in all other cases will return the value without changes.
 */
function DataStateFilter() {
	SystemFormatterBase.apply(this,arguments);
}
DataStateFilter.Inherit(SystemFormatterBase,"DataStateFilter");
DataStateFilter.Implement(IArgumentListParserStdImpl,"spaced");

DataStateFilter.prototype.Read = function(val, bind, _params) {
    var params = _params;
    if (params.Any(function(idx, s) { return s == "nondeleted"})) {
        params = ["unchanged", "new", "updated"]
    }
    if (Array.isArray(val)) {
        return val.Select(function(idx, item) { 
            if (params.Any(function(idx, s) { return (statevalues[s] == item[statename]); })) return item;
            return null;
        })    
    } else if (typeof val == "object") {
        if (params.Any(function(idx, s) { return (statevalues[s] == val[statename]); })) return val;
        return null;
    }
    return val;
    
}
DataStateFilter.prototype.Write = function(val, bind, params) {
    throw "The DataStateFilter is readonly";
}

})();