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
 * Enables you to indicate which entries are in the configured states. Use like:
 * format=DataStateIndicator(new unchanged updated)
 * The example returns true for the new unchanged updated items but not for the deleted items and those without state.
 */
function DataStateIndicator() {
	SystemFormatterBase.apply(this,arguments);
}
DataStateIndicator.Inherit(SystemFormatterBase,"DataStateIndicator");
DataStateIndicator.Implement(IArgumentListParserStdImpl,"spaced");

DataStateIndicator.prototype.Read = function(val, bind, params) {
    if (typeof val == "object") {
        return params.Any(function(idx, s) { return (statevalues[s] == val[statename]); });
    }
    return false;
    
}
DataStateIndicator.prototype.Write = function(val, bind, params) {
    throw "The DataStateIndicator is readonly";
}

})();