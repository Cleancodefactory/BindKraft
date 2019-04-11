

/*INTERFACE*/
/* Implement this to supply additional parameters to the query string whenever ajax requests are sent from your object */
function IAjaxQueryStringParams() { }
IAjaxQueryStringParams.Interface("IAjaxQueryStringParams");
IAjaxQueryStringParams.prototype.get_queryParameters = function () { return null; };
