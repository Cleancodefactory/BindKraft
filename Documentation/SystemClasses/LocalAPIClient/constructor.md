# LocalAPIClient constructor

## Syntax

```Javascript
 new LocalAPIClient(requestedAPI[, apihub1[, apihub2 ...]])
 ```

## Parameters

`requestedAPI`

    An object listing all the API you want imported for further use. Example:

```Javascript
{
    IAPI1: null,
    IAPI2: null,
    IAPI3: "legacy"
}
```

The keys of the object are the names of the interfaces for the local API being requested. The values are either `null` for the default API variations or the name of the variation (see the notes for more info.)

`apihub1, apihub2, ...`

Optional API hubs - instances of the [LocalAPI](../LocalAPI) class.

If these are omitted (the recommended way for the most usages) the system default hub is used (see the notes). 

## Example

The example puts the LocalAPIClient instance in the context of a class that uses it - MyClass.

```Javascript
/*
The constructor is a good place to init the client, but this can be done also in the init() method of a class derived from Base, for instance.
*/
function MyClass() {
    MyParentClass.apply(this,arguments);
    this.local = new LocalAPIClient({
        "IAPI1": null,
        IAPI2: null
        IAPI3: "legacy"
    })
}
// Later in the code some usage in some method
MyClass.prototype.someMethod = function() {
    // One way of doing it
    this.local.getAPI("IAPI2").apiMethod(someargs);
    // Another way - a bit more syntactically pleasing.
    this.local.API.IAPI2.apiMethod(someargs);
}

```

The interfaces in the example are just an example, of course. The list of currently available local API provided by the system is described in [LocalAPIList](../LocalAPIList.md) article.

For API provided by apps and daemons check their documentation.

_What is the difference between the two example lines above?_

If the IAPI2 was not available when the `LocalAPIClient` was created (in the constructor in the example), then the `getAPI()` method will try to re-obtain it, while the `this.local.API.apiMethod` assumes the API was obtained successfully and will attempt call a method over the particular API, failing if the API was not obtained successfully in advance.

Apparently failure is possible and one can expect something can go wrong especially when the specific API is exposed by an app or a daemon and not by the system. The exposing app/daemon needs to be running in order the API it provides to be registered with the system and this may or may not be so. On the other hand with system provided API it is virtually guaranteed that the API will be found at the first try or not at all (if the system is somehow misconfigured or corrupt).

This dictates the ways to consume an API: 

* The system provided ones can be consumed with less care, because problems with them are likely correctable during the development and exceptions will be a sign to configure the system properly - a bug to correct.
* API provided by apps and daemons, on the other hand, may not always be available. Right now BindKraftJS does not provide an auto-start functionality tied directly to a request for a Local API and it is unlikely to have one in future. Starting an app/daemon on demand is possible for apps/daemons designed to act that way, but it can easily a subject of more conditions than just the need of an API provided by them. 

So, a better pattern of local API usage, mostly for app provided API would look more like this:

```Javascript
// Omitting the part that remains the same
MyClass.prototype.someMethof = function() {
    // One way of doing it
    var iapi2 = this.local.getAPI("IAPI2");
    if (iapi2 != null){
        iapi2.apiMethod(someargs);
    }
    // Or the other way
    if (!this.local.API.IAPI2) {
        // Attempt to request it again
        if (this.local.attachAPIConf("IAPI2")) {
            // we got it this time - call it
            this.local.API.IAPI2.apiMethod(someargs);
        } else {
            // Issue an error, tell the user to try another time, may be launch the app that provides it.
        }
    }
}
```

Surely most apps will pack the above pattern into more convenient to use wrappers, once their developers decide how exactly to deal with a missing API situation.

The calls to methods of LocalAPIClient can deal with both - names of interfaces and interface definitions alike. The calls used above can be used both ways:

```Javascript
var iapi2 = this.local.getAPI("IAPI2");
var iapi2 = this.local.getAPI(IAPI2);
//
this.local.attachAPIConf("IAPI2");
this.local.attachAPIConf(IAPI2);
```