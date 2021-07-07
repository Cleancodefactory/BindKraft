# LightFetchHttp class

Enables AJAX requests to be sent to the origin and other servers. It works with xmlHTTPRequest in the background and is designed for `reuse`. I.e. Instead of creating new instance for each new request that has to be sent an instance that is no longer needed for anything else should (when possible) be reused.

The reuse of the object can be achieved on different levels - from full reset and change of all parameters to keepint most of the parameters intact and making new requests passing only the specific components of the requests.

The class supports `plugins` that can impact the request preparation to some extent (_further development will extend further their options to apply changes_).

The class follows the philosophy of the "expected response type", which means the responses are expected to return the specified kind of response (see `get/set_expectedContent` property).

The class uses body encoders to encode the request body (for the methods that support bodies). They are both built-in and custom. The latter are set as callbacks (wither delegates or functions) - see `get/set_postDataEncode` property.

## Notes about usage and future development

`LightFetchHttp` class is intended as low level replacement for all other AJAX means of communication in BindKraft. While it is not forbidden or impossible to use other libraries or direct API calls for AJAX requests, LightFetchHttp is going to provide better integration with BindKraft in general and with specific features in particular.

In near future a communication pipeline based on this class will replace the old one - accessible through `ajaxGetXML/ajaxPostXML` methods of all classes. This will make dealing with it mostly indirect with very low number of cases in which the programmer will have to know anything about `LightFetchHttp` and the related classes. The ajax methods will be removed from [BaseObject](BaseObject.md) and will be put into easy to use `implementers` which can be included in any class that needs the feature.

This approach will make the legacy compatibility break very easy to fix and will allow new projects to avoid the old-fashioned ajaxGetXMl/ajaxPostXML in favor of more convenient new implementations or mix old and new together when needed.

Direct usage of the class is Ok, of course, but we aim at almost eliminating the need to do so. The direct usage can be a little cumbersome compared to the integrated pipelines (the mentioned implementers) or Connectors based on it, but it is still easier than raw usage of xmlHttpRequest and fetch, especially when integration with BindKraft features is needed (e.g. auto-using a Bearer token per URL, following result structure for direct use with other BK functions, auto-encoding of data for CoreKraft nodesets and so on.)

## Properties

### **httpuser**

### **httppass**

### **timelimit**

If set limits the total time needed to complete the request and if it is reached the request is cancelled. If not set the browser's behavior is the only limiting factor. The value cannot be greater than the `LightFetchHttp.$ultimateTimeLimit`, which is by default 600 seconds, _if a greater value is set, it will act as if not limit is set_! 

usage:
```Javascript
fetcher.set_timelimit(90); // Sets the timelimit to 90 seconds
```
The default is `null` - not set.

### **fillResponseHeaders**

It is `false` by default. When set to `true`, the response headers are included in the result data (see more details in the result description).

### **expectedContent**

Specifies what kind of content is expected in the response - i.e. how to process it into javascript result object. There are a small number of built-in (almost) trivial processing routines and a few BindKraft supplied processors for content often used with BindKraft. Additional and custom processors can be added by custom code by registering them in the `LightFetchHttp.$returnTypeProcessors` static map:

```Javascript
LightFetchHttp.$returnTypeProcessors[mycontent] = "MyContentHttpResponseProcessor";
```
This registers a processor for `mycontent` so that it can be used as a value for the `expectedContent` property. See [LightFetchHttp responses processors](LightFetchHttpResponses.md) for details on how to write one.


### **withCredentials**

### **queryBoolAsNumber**

### **queryMaxDepth**

### **postDataEncode**

Sets/gets the body encoder. 

postDataEncode can be set to:

- string: name of built-in encoding (see the list below)

- callback: Delegate, function that receives the following args: fetcher, xhr, bodydata

 		where
 			fetcher is the instance of this class that calls it
 			xhr is the xmlHTTPRequest object in opened state
 			bodydata is the data passed in by the caller, it needs to be encoded and returned in the encoded form
 		returns the encoded data
 
The callback (and the built-in encoders) can and most often should set some headers (Content-type most notably). More details in the BK docs.

The available built-in encoders are:

`json`

> encodes the bodydata to JSON and sets the content-type to `application/json` 
 
 `raw`

>Pass through. The caller should set headers if necessary. The [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData), [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) and `string` do not need explicit header - the needed headers will be included by the browser. [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)s also set the correct content type if their type property contains one. Note that `URLSearchParams` is not supported by older browsers and still may have some quirks in some browsers. Use `form` encoding to send traditional `application/x-www-form-urlencoded` form data.

`form`

> Encodes the data using the traditional URL encoding and sets the content type to `application/x-www-form-urlencoded`.

`multipart`

> Encodes the data into FormData, leaves the browser to process it further and set headers as necessary. These headers will NOT be available through `getHeader` method.

For `form` and `multipart` the property `queryMaxDepth` is important. If it is 0 the encoded data will not be traversed beyond first level (e.g. sub-objects or arrays will not be encoded.). If it is greater than 0 that much levels will be traversed and their names in encoded data will look like `l0_name.l1_name.l2_name`. E.g. `{ a: { b: { c: 1 }}}` will encode (in URL encoding) as `a.b.c=1`. The same applies to `multipart`.


Custom encoder {preparedBody: body, bodyData: bodydata, requestData: reqdata} TODO: Complete the description.


### **url**

### **method**

## Methods

**addPlugin(plugin)**

**removePlugin(plugin_ot_type)**

**removeAllPlugins()**

**set_bearerTokens**

**url(v)**

**setHeader(header, content)**

**getHeader(header)**

**releaseActiveResult()**

**isOpened()**

**isComplete()**

**getAllResponseHeaders()**

**getResponse()**

**get(url, requestDAta, expectedType)**

**post(url, data, enctype, expectedType)**

**postEx(url, requestData, data, enctype, expectedType)**

**reset(expectedType)**

## Events

**finished**

**done**

**sent**

**progressed**



