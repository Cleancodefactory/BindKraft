# Typical communication with BindKraft packet servers (BKPS)

If you already know the basics you can skip to "Usage".

Here we call _packet servers_ a variety of WEB server applications that support BindKraft on conceptual level. Some standards exist, but they are too strict in order to enable easier portability of entire applications. On the other hand, support for BindKraft Javascript Platform (BKJP) on conceptual level is loosely defined set of formats, requests, expected responses and behavior that can be implemented (or already exist) with much less effort and provide most of the benefits a packet server provides, but do not include any guarantee for portability of the server side code and configurations to other packet server implementations. 

## Request-response conceptual structure

Ignoring the specific formats we can describe the logical structure and pieces of the requests and responses to/from a packet server and how the requests are processed in general to produce these responses.

In the BKJP there are a number of mechanisms for implicit collection of some requests parameters, but we are going to ignore them completely in this document so that we can concentrate on the basics and not digress to topics that deserve comprehensive documentation of their own. The implicit collection of parameters is a mechanism not necessarily relying on packet servers, but it was inspired by their wide internal usage and can be better understood if one has knowledge about the way packet servers work, thus we recommend the reader to pass through this document first.

### Request - general structure and considerations

The parts that are not listed here may be used, but there is nothing specific for them. E.g. a session cookie may be involved, but this has nothing to do with the fact that we are dealing with a packet server - it will probably use the session, but the same way any other server application on the same platform would do it.

__The following components__ form the request:

__url__ - a string containing the path to the packet and optionally specific node in it. May include some query string parameters pre-encoded in it (not a good style unless they are part of the fore mentioned path to the node)
__data__ - Javascript object with some properties. It can be __plain__ (no property contains another object or array) and __deep__ (single level) some properties contain sub-objects or arrays (which can in turn contain objects etc.).
__getparameters__ - rarely used - a __plain__ object (see above what plain means here)

In packet server oriented requests the following parts of an HTTP requests are used:

* Query string parameters (both in GET and POST cases)
* Post body

In GET requests __data__ is encoded as query string parameters and appended to the url for the actual request. __deep__ data will not be encoded and may cause error. An adapter configured in the BindKraft Javascript platform may encode them according ot the type of the value the individual properties contain. The __getparameters__ will also go into the query sting as separate values.

In POST requests __data__ will be encoded as JSON and placed in the body. The getparameters will go into the query string as in the case of GET requests.

In all the cases query string parameters should not contain more than one occurrence of any parameter. If this happen the packet server should take action that may differ in some implementation, but usually it will take the last value (i.e. if the same name parameter is met in the query string its value will replace the previous one). This practice evolved around the fact that the implicitly collected parameters were typically placed as getparameters to make debugging more straightforward - they usually have important meaning, may denote an user role under which to perform the server processing, user on behalf of whom to perform the task etc. Having them in the query string makes it easier to process support information requested from clients who have some problems. See the server processing for more information. No such limitation applies to the JSON encoded data in the body.

### Response - general structure

The response is much more complicated than the request. The response carries not only the requested data, but also other resources related to the data (this depends on the server side and its configuration)

Basically the packet servers consider the requests this way:

* the URL points to a "package" and (optionally) "node" in it;
* the Request can be treated as read or write (store) request, but not both at the same time (This is usually known from the URL).
* The packet servers are called "packet", because they return packets in their responses which contain heterogeneous pieces of data - usually the data (requested or updated), view template(s), lookup sets, textual resources and others.
* the additional pieces of data in this response packet are determined according to various rules (assume we talk about packet servers that do not follow the standards, but only the principles).

## Usage - different kids of usage patterns

For direct requests it is recommended to use a Connector. AjaxXmlConnector is the most frequently used one. A in-code request will look like this:

```Javascript
    var c = new AjaxXmlConnector("node/mynode", this, {packetMode: true});
    c.set_parameters("myparam", "myvalue")
    c.bind(function(result,issuccess,errinfo) {
        if (issuccess === false) {
            // Error handling
        } else {
            var data = result.data; // contains the data
            var view = result.views.normal; // typical view html
            var lookup = result.lookups.somelookup // Specific lookup
        }
    })
```

Assume that the relative URL "node/mynode" above leads to the packet processing definition and node we want to request in it (more about URL - see later) , the actual URL will differ on an actual implementation

The option _packetMode_ above instructs the connector to return the raw data packet returned by the server (will work on any other connector that normally filters out any side data/OOB data) and not only the data response requested. See the [Response - general structure] above for the typical packet structure.

When only the data is needed just do not send the option and the OOB (Out of band data) will not be returned to your callback - only the data itself - look in the data property otherwise.

Additional tricks are possible.For example: the address (the relative URL above) can be prefixed with "post:" and may look like this: "post:node/mynode" which will instruct the connector to use POST HTTP request instead of GET.

We mentioned getparameters, but they are not supported by connectors - the abstract scenario connectors present does not go deep enough for this. their usage can be seen on lower level.