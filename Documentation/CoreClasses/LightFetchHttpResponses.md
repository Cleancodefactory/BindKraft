# LightFetchHttp responses processors

This page explains how to write a response processor for the `LightFetchHttp` class.

The response processor is a class that inherits from `LightFetchHttpResponseBase` and has to implement its methods. _Currently these are only two methods, but in future we can add a couple more._

## Writing the processor

The skeleton for a response processor will look like

```Javascript
(function() {
    // Imports will go here

    function LFHResponseMycommseparated(fetcher) {
        LightFetchHttpResponseBase.apply(this, arguments);
    }
    LFHResponseMycommseparated.Inherit(LightFetchHttpResponseBase, "LFHResponseMycommseparated");

    LFHResponseMycommseparated.prototype.adjustRequest = function(xhr) {
        // your code
    }
    LFHResponseMycommseparated.prototype.processResponse = function(xhr, result) {
        // your code
    }
})();

```

We assume that our class is named `LFHResponseMycommseparated` below, but the name you choose can be any. We recommend a naming scheme like this: `LFHResponse<contentName>` where contentName is a name for the response format being processed. E.g. if we process some comma separated format, let us name it `mycommaseparated`, then following the recommendation the name for the class will be `LFHResponseMycommseparated`. This is only a recommendation, but following it will make it easy for you and your colleagues to find the relevant classes.

### Implementing adjustRequest

This method can be left empty in some cases, but it is recommended to not do so. Its purpose is to prepare the `xmlHttpRequest` object for the response. This usually is just setting its `responseType` property. In our example:

```Javascript
LFHResponseMycommseparated.prototype.adjustRequest = function(xhr) {
    xhr.responseType = "";
}
```

will be enough - empty response type is fine if we expect textual response. See in MDN [XMLHttpRequest.responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) for more details.

**Potential confusion**

It is normal to wonder why we are not setting/adjusting both the request and the response together.




## Registering the processor.