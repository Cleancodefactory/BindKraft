# Implementing a Connector

This document shows how to implement simple connectors - both synchronous and asynchronous.

## A couple of words about __connectors__ in general

We assume the reader of this document already knows what connectors are, so we will limit ourselves to a kind of "reminder" which summarizes the concept.

A Connector is a class inheriting the BindKraftJS __Connector__ class and implements the procedure of "fetching a resource" in some way - through some protocol(s) remotely, by calling certain functions (locally). The resource is to be identified by an __address__ string and may (depending on the specific connector) or may not use/require a __host__ to perform the fetching in a context derived from the __host__. Additionally the connector may support some of the __Connector__ options if any of them is appropriate.

So knowing the connector's __class__, __address__ and possibly __host__ one has all the components needed to find and obtain given resource through certain means.

__class__ - is the class of the specific connector class.
__address__ - is the string resource address in a format understood by the __class__ in question.
__host__ - is a reference to an object which may or may not change the meaning of the address depending on the specific connector.
__options__ - is a plain object with properties with certain values (speicific for the option) that can change the way the connector behaves if they are supported.

So in-code usage of a connector will look something like this:

```Javascript
var conn = new SomeConnector("some.address", this,{ singlelast: true });
conn.bind(function(result, status, error_info) {
    if (status == false) {
        // Error - support for error_info is recommended, but not required
        // We can test if it is there and perform some error handling
    } else {
        // Success - result contains the resource, the rest of the arguments are null
        // So, do something with the resource.
    }
})
```

Connectors are not universally interchangeable, one needs to know which of them return what in order to select one appropriate for certain communication. There are add-on interfaces and classes enabling recognition of the expected resource and work with it, but they are a subject of a separate document. The basic level of connectors usage leaves connector selection to the developer.

The above syntax works for both synchronous and asynchronous connectors. Synchronous ones also return the result as return value of bind, but it isn't recommended to write a code that depends on that.

Connectors enable easy usage of parameters and bindings in BindKraft templates markup. The connectors are configured most often through parameters of a class in data-class/data-parameters attributes and sometimes through data bindings (data-bind-someparameter="{ link an address for example}"). On the javascript side this will resolve to code creating the specified connector class and passing the address and host to it, then using it to obtain the resource thus specified through parameters.

Connectors are also often used as an easy-to-use replacement of lower-level communication mechanisms (even AJAX) in otherwise regular code.

## Implementing read-only connectors

Update functionality is not needed by all connectors, read (bind) is most often enough for practical usage, so we start with it.

### Synchronous connector

We will use an example that is fetching data from an in-memory array. 

Lets create the skeleton:

```Javascript
function MyArrayConnector(addr, host, options) {
    Connector.apply(this, arguments);
}
MyArrayConnector.Implement(Connector, "MyArrayConnector");
MyArrayConnector.prototype.resolve = function(callback) {
    // TODO 1: Here will come most of our code
}
```

We just inherit from __Connector__ and we have to override the method intended for typical Connector implementation - __resolve__.

We have to decide what our address means and what is the syntax. For simplicity lets assume our address is just the name of the field on the host object. If the host is not supplied we will assume a global variable - thats it.

Then a resolve implementation can look like this:

```Javascript
MyArrayConnector.prototype.resolve = function(callback) {
    var address = this.$data; // The address passed in the constructor goes into this.$data
    var theArray = null; // We are going to put here the addressed array
    if (address != null && address != "") {
        // array on the host
        if (this.host == null) {
            theArray = window[address];
        } else {
            theArray = BaseObject.getProperty(this.host, address, null);
            // Info: BaseObject.getProperty(o,p,d) - gets a property addressed by p on object o and returns d if not found. p's syntax is "field.field1.field2...". Each field name may be a field or an active property (get_somefield).
        }
    }
    // Now lets check what we got and continue if possible, if not we just will return null.
    if (BaseObject.is(theArray,"Array")) {
        // Lets do the simplest possible implementation for now, we will expand on it later.
        this.$resource = theArray;
        return true; // All ok synchronously
    }
    this.$resource = null; // Connectors should not throw exceptions when the resource is not there. Any error information should be set into the this.errorInfo:
    this.errorInfo = "The array is not found."
    // errorInfo can be anything - for detailed recognition there is additional layer which is not discussed in this document. The only requirement is a toString override that returns meaningful text message about the error.
    return false; 
}
```

The code above is trivial. The __bind__ method will call resolve and react depending on the returned result - true will be treated as success, false as failure. By default the class inheriting __Connector__ will be assumed to be synchronous. If you are writing asynchronous Connector, you have to set this.isAsync = true in the constructor and change the way the resolve is implemented (we will come to that later).

The next step is to make our code a bit more useful. We continue changing the resolve method further:

```Javascript
MyArrayConnector.prototype.resolve = function(callback) {
    var address = this.$data;
    var theArray = null;
    if (address != null && address != "") {
        if (this.host == null) {
            theArray = window[address];
        } else {
            theArray = BaseObject.getProperty(this.host, address, null);
        }
    }

    if (BaseObject.is(theArray,"Array")) {
        // We are going to use the connector's parameters and return a slice of the array 
        var params = this.get_parameters(); // The standard parameters set of a connector.
        if (params != null) { // it is better to check if any parameters are set at all
            // We have some
            if ((params.startrowindex != null && params.startrowindex > 0) || params.numrows != null) {
                // startrowindex is the standard default parameter name for offset/starting record/item in BindKraftJS. In Base derived classes other names may require passing an additional parameter to the object that is using it. Connectors do not have to worry about being capable to use other names - their role is similar to a database engine, so a translation should be done outside of the connector. Thus the startrowindex and numrows are reserved parameter names.
                var start = (params.startrowindex != null?this.startrowindex:1);
                this.$resource = theArray.slice(start-1,params.numrows?params.numrows:theArray.length);
                // numrows is the standard default parameter name for offset/starting record/item
                // startrowindes is 1 based not 0 based (tradition - it can be implemented as 0 based, but the defaults of some classes using connectors will not work and will need to be set)
                return true; // Well - lets finish.
            }
        }
        this.$resource = theArray;
        return true; 
    }
    this.$resource = null; 
    this.errorInfo = "The array is not found."
    return true; 
}
```

Slices of an array can be useful if we implement something scrolling through a huge array and we cannot afford to render all its elements at once. Instead we want to move an "window" of several items through the array and show at any given moment only them.

To do something more meaningful we can implement filtering - inour example all other parameters (not startrowindex and numrows will be treated as simple filters for fields with the same name). We will change the implementation a little to keep it brief. It will not be the best implementation, but it will be short:

```Javascript
MyArrayConnector.prototype.resolve = function(callback) {
    var address = this.$data;
    var theArray = null;
    if (address != null && address != "") {
        if (this.host == null) {
            theArray = window[address];
        } else {
            theArray = BaseObject.getProperty(this.host, address, null);
        }
    }

    if (BaseObject.is(theArray,"Array")) {
        var params = this.get_parameters();
        // Make it easy for later
        var start = ((typeof params.startrowindex == "number")?params.startrowindex-1:0);
        var numrows = ((typeof params.startrowindex == "number")?params.numrows:0);
        if (params != null) {
            var current = 0;
            this.$resource = this.$resource.Select(function (idx, item) {
                for (var k in params) {
                    if (k != "numrows" && k != "startrowindex") {
                        if (params[k] == null || params[k] == item[k]) continue;
                        return null; // Even if one filter does not match - this item does not qualify
                    }
                }
                if (numrows == 0 || current < numrows) {
                    current++;
                    return item;
                } else {
                    return null;
                }
            });
            return true; // All done
        }
        this.$resource = theArray;
        return true; 
    }
    this.$resource = null; 
    this.errorInfo = "The array is not found."
    return true; 
}

```

Array.prototype.Select iterates through an array and calls a provided callback (function or delegate) with two arguments - index and element (item). Returning null from the callback skips the item, returning anything else - adds it to the resulting array.

Now this is slow (for the sake of the example this is not the  most productive implementation), but it gives something more useful than just a slice of an array - it returns only those elements (assumed to be objects in the example) that have fields without corresponding parameter or those that match its value. If we presume this cannot be optimized enough we may want to make it asynchronous and split the operation into small pieces of work so that the main thread remains responsive. Of course we can use WebWorkers on new browsers, but we can't in older ones, but still in use. So, we can use the cooperative multitasking features of BindKraft to do so. This will also be the case if the operation somehow is using information from the DOM or other data inaccessible from a worker thread.

### Make it an asynchronous

This will demonstrate not only using tasks (AsyncResults, but also implementation of async connectors.):

First we need to change the declaration a little:

```Javascript
function MyArrayConnector(addr, host, options) {
    Connector.apply(this, arguments);
}
MyArrayConnector.Implement(Connector, "MyArrayConnector");
MyArrayConnector.prototype.isAsync = true;
MyArrayConnector.prototype.pieceSize = 100;
```

isAsync is now true. The resolve will change considerably:

We also added a field pieceSize for the number of items we want to process on each async operation.

```Javascript
MyArrayConnector.prototype.resolve = function(callback) {
    var address = this.$data;
    var theArray = null;
    if (address != null && address != "") {
        if (this.host == null) {
            theArray = window[address];
        } else {
            theArray = BaseObject.getProperty(this.host, address, null);
        }
    }

    if (BaseObject.is(theArray,"Array")) {
        var params = this.get_parameters();
        // Make it easy for later
        var start = ((typeof params.startrowindex == "number")?params.startrowindex-1:0);
        var numrows = ((typeof params.startrowindex == "number")?params.numrows:0);
        if (params != null) {
            var current = 0; // This is the number of the current item in the filtered output
            var pos = 0; // This will be the working position in the array - 0 to length-1
            var result = []; // Create empty result - we will fill it
            var worker = function() { 
                if (pos >= theArray.length) {
                    // REPORT THE RESULT
                    // THIS WILL FINALIZE THE OPERATION
                    this.$reportResult(true, result, null, callback);
                } else {
                    var chunk = theArray.slice(pos, this.pieceSize); // Get a chunk of the array
                    pos += this.pieceSize;
                    // We will push the result directly into the result - no need of Select in this case
                    chunk.Each(function (idx, item) {
                        for (var k in params) {
                            if (k != "numrows" && k != "startrowindex") {
                                if (params[k] == null || params[k] == item[k]) continue;
                                return; // This one does not match
                            }
                        }
                        if (numrows == 0 || current < numrows) {
                            current++;
                            result.push(item);
                            this.callAsync(worker);
                        } else {
                            // No more items we will skip the optimization here to keep code simpler
                        }
                        // Now schedule the next operation
                    });
                }
            };
            this.callAsync(worker);
            return; // No need to return anything
        }
        // In the trivial case - just report the whole array and be done with it.
        this.$reportResult(true, theArray, null, callback);
        return; // No need to return anything
    }

    this.$reportResult(false, null, "The array is not found.", callback);
}

```

__What changed?__

First of all the return result does not matter, we have to call this.$reportResult for both success and error:

```Javascript
this.$reportResult = function(success, data, errorinfo, thecallback);
```

- success - true or false to indicate success or failure
- data - the resulting data, should be null for failure
- errorinfo - see earlier in this document. Should be null on success
- thecallback - the same callback resolve got as parameter. It needs to be passed along, because the connector may execute more than one tasks at once - we cannot afford to save it in a property.

It is obviously safer to create new instance of the connector for each bind operation - in case the implementation is not capable of running multiple requests with the same settings (it may use intermediate cache or something else that will break in such a scenario). This, obviously, is a mistake in the implementation of a connector, but if your logic wouldn't break if you use a new instance each time, some deficiencies in a particular connector will not be critical for your code and you can save yourself some headaches.

_Some usage concerns you should know:_

The connectors "know" they are bound to the resource once a success is reported. Normally consequent calls will just return the resource already obtained. Changes in the address, parameters and other details will not reset the __isBound__ state. When using a connector and changing some parameters and/or address one needs to call:

```Javascript
// Declaration
Connector.prototype.resetState = function (newData);
// Usage
 var c = new SomeConnector(myaddr, myhost,myoptions);
 c.bind(myhandler);
 // We cannot wait and we call it with another address
 c.resetState(myotheraddress);
 c.bind(myhandler);
 // Or change only a parameter, but not the address
 c.set_parameters("someparam", "somenewvalue");
 c.resetState(); // Resets isBound, hasFailed and errorInfo, but nothing else.
```

We can reset the status automatically, at least to some extent, but we want to avoid this happening by mistake and this makes exclusive resetState a better option in general. Why by mistake? Once bound a connector may serve as a reference to the returned data and the code that uses the connector may call it repeatedly counting on this, while preparing parameters.

This example async connector is certainly not the usual case. It can be adjusted to do its job quite unobtrusively, but it will become even slower and there are not that much scenarios where this approach will do any good. The typical asynchronous connector will probably deal with network communication instead.