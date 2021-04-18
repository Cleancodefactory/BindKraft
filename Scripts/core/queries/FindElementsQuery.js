(function(){
    /**
     * Despite the similarities with FindServiceQuery this one is not used as often and the need of it will
     * depend on the architectural choices in the app. Most notably the app or parts of it can be designed to depend
     * on specific IElementsLocator capable nodes that are directly found through findService technique and then
     * this query is not needed. However apps consisting of multiple parts my require (sometimes) to collect all elements
     * of certain kind outside of the constrains of the IElementsLocator they directly use. 
     * 
     * Unlike most queries this one is handled continuously to the possible maximum root node and false is returned always, so
     * that the handling will not stop anywhere. In fact returning true stops the search and this can be used by some apps to 
     * partition themselves, but is not recommended.
     * 
     * @param {*} iface 
     * @param {*} condition 
     */
    function FindElementsQuery(iface, condition) {
        this.Interface = iface;
        this.condition = condition;
        this.result = [];
    }
    FindElementsQuery.Inherit(BaseObject, "FindElementsQuery");
    // Helpers
    // Client helper - use in implementation of findServices
    FindElementsQuery.collectLocatableElements = function (el, iface, condition) {
        var p = new FindElementsQuery(iface, condition);
        if (BaseObject.is(el, "IStructuralQueryEmiter")) {
            if (el.throwStructuralQuery(p)) return p.result;    
        } else {
            if (JBUtil.throwStructuralQuery(el, p)) return p.result;    
        }
        return p.result;
    };
    // Handler helper - use in processStructuralQuery
    FindElementsQuery.handle = function(_this, query) {
        if (BaseObject.is(query, "FindElementsQuery")) {
            var r = null;
            if (BaseObject.is(_this, "IElementsLocator")) {
                r = _this.locateElements(query.Interface, query.condition);
                if (r != null && r.length > 0) {
                    query.result = query.result.concat(r);
                }
            }
        }
        return false;
    }
    
})();