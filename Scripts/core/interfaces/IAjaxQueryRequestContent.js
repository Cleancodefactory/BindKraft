/*
	We will leave this interface out in the new ajax implementation (2018), but it is not deprecated yet
*/


/*INTERFACE*/
/*
    Enables the ajax routines to ask their instance if the server response should include OOB content. The only method returns flags interpretted by the server.
    The implementation of this Interface should usually involve a cache management infrastructure that makes the actual decision which flags to set.
    Routine: 
        1) The implementor returns the relevant flags - describing the kinds of transferrable elements it needs in general. If unsure return STUFFRESULT.ALL (everything)
        2) (only) If the implementor does not require anything the caller executes the requests from the implementor with only the main data flag(s) set (currently STUFFRESULT.DATA)
        3) The flags required by the implementor are then passed to the cache manager which may unset many or even all of them if it has the corresponsing elements cached.
    Notes: The cache manager uses a class based (static methods) mechanism to determine the cacheable elements from the request URL. It will perform calls possibly even to the
        class of the implementor in order to obtain a valid analysis of the URL and determine which unique elements are already cached.
        The implementor can unset the flag(s) corresponding to the uncacheable data elements. This way the implementor can think of the requests it sends as requests related
        only with the work data and view the rest of the flags as a declaration. Therefore the implementor may have its own data cache for parts or whole work data or support
        data directly passed in some other manner without the need to call the server for it. Yet the general idea is that the cacheable elements are always obtained from the server
        when they are not in the cache and even if an implementor does not intend to ever receive any work data from the server it must initialize through a ajaxGetXml call to enable
        the system to load the cahceable elements.
*/
function IAjaxQueryRequestContent() { };
IAjaxQueryRequestContent.Interface("IAjaxQueryRequestContent");
IAjaxQueryRequestContent.prototype.getRequestContentFlags = function (settings) { return null; };
