# Platform utility adaptation and usage

As mentioned elsewhere BindKraft is designed for primary usage with a specialized server. It can be run also with a minimal server in a manner very much similar to the SPA (Single Page Applications) in the end of the second decade of 21-st century.

The BindKraft packet servers (CoreKraft for example) are designed to cooperate with the Javascript part of the platform and simplify a wide range of operations. In most cases the BindKraft setup uses a single such server which is the default back end of the system - serves templates, essential core data, various resources and so forth.

You can think that usually there is at least one such server that supplies the pieces of the applications on the particular BindKraft setup. The work data the applications need can be spread among many servers and services which may or may not be based on BindKraft, but there still needs to be one (at least) from which the applications start and their pieces are loaded. Production installations will have a BindKRaft server for that purpose or at least a server that follows the principles.

This document will not dig deep into the way the packet servers work. Here we need only the basic rules that define entry points and how the Platform Utility makes it easy to address them without knowing the specifics of the URL construction. The benefit of basing your Javascript code on the Platform Utility is that this will make the Javascript part of your work portable across many different configurations and implementations of the server back end.

## Entry points - modules, nodesets and nodes

The BindKraft packet servers separate their assets in __modules__. On the server side they use some dependency definition mechanism to load them when the system starts.

BindKraft modules are way to group assets - all possible kinds. This would include Javascript files (for the client), templates (for the client), images (again mostly for the client), libraries that define plugins for the server side (if those are supported by the specific implementation), data directory for files and file based databases, nodesets definitions - e.g. definitions for entry points of services and so on. In other words this will be a container of all the possible BindKraft assets a project/subproject needs. There is no implicit relation between BK module and application - a single module may contain non or any number of applications that the user will be able to launch on the client, but it can also be just a library of assets other modules need to use.

In any particular module there are entry points defined in __nodeset__ definitions (usually JSON files in most implementations). The nodesets describe a tree of __nodes__ where each _node_ describes how the data corresponding to it is fetched and written back (it may be read only or even write only - this is up to the developer who constructs the particular definition for his/her needs), what parameters are expected and so on.

The nodesets define trees of nodes, because the basic idea of the BindKraft servers is to act as a state tracked entity object repositories. The trees describe relations between them e.g. a node for _person_ data with sub _nodes_ corresponding to data perceived as belonging to a person entity object, like _addresses_, _photos_, _posts_, _documents_ and so on. This way the client can request a person(s) with all those related entities together. Then the most popular nodeset definitions would allow the changes to be saved by simply posting back the same tree of data to the same entry point from which it originated. As the UI can be constructed in various ways the data can also be saved in pieces - the names under which the detail entities for the person are received are the same as the names of the nodes in the source nodeset. So, sending such a detail/details back to the node that produces it can save it, without the rest of the data.

This behavior makes it practical to think about a BindKraft server as a set of tree definitions (nodeset definitions) with certain node paths inside some or all of them leading to specific place in the tree described there. This way one considers the nodes to which he/she wants to send requests for reading or storing data. This makes it convenient to remember where (in which module) in what nodeset definition and where within it the node you want to address directly is (treating it as an entry point). This can alawys be represented by an URL, but the syntax of the URL may differ drastically from implementation to implementation, because various reasons. So, the platform utility enables the knowledge about the above menitoned location of the node of interest to be converted to usable URL for the specific platform setup.


## How to use

This section reviews the both sides of the usave - configuring/setup of the specific instance/platform on one hand and the usage of the API required to benefit of this functionality on the other.

### Configuring the system/BindKraft instance

This is a task that has to be performed by the administrator/creator of the environment, not by the programmers who use the platform utility.

BindKraft server that supports modules fully should include as one of its core and always required modules a module named __"PlatformUtility"__. It contains the system utilities, a very simple launcher and some utility methods. 

You should edit the module and add a JAvascript file that defines the default url generation method for requests to the server itself. In other words this method must construct a valid virtual URL back to a node on the main server from these parameters:
- module name
- nodeset name
- node path
- read/write operation

Example from KoreKraft .NET core based server

```Javascript
IPlatformUtility.moduleUrl = function (moduleName, readWrite, pack, nodePath) {
    var r = "/node/" + ((readWrite.charAt(0) == "w") ? "write/" : "");

    if (moduleName != null && moduleName.length > 0) {
        r += moduleName + "/" + pack;
    } else {
        r += pack;
    }
    if (BaseObject.is(nodePath, "string")) {
        r += "/" + nodePath
    } else if (BaseObject.is(nodePath, "Array")) {
        r += "/" + nodePath.join(".");
    }
    return r;
}
```

Here the URL looks like /node/modulename/pack/node1.node2

### Using the platform utility in your classes

The usage of the platform utility interfaces is done in a number of ways, depending on the purpose of the code where this is happening.

#### Your classes

In classes you create the main usage of the utility will be to help you create URL to nodes in nodesets in your module. To gain this you have to use the implementer like this:

```Javascript
MyClass.Implement(IPlatformUtilityImpl,"mymodule");
```

As a parameter you have to pass the name of your module. Then in your code wherever you need to create an URL to a specific entry point you can do this:

```Javascript
var url = this.moduleUrl("read","mynodeset1", "node1.node2");
// or
var url = this.moduleUrl("read","mynodeset1", ["node1","node2"]);
// or (if the target entry point is the root of the nodeset)
var url = this.moduleUrl("read","mynodeset1");
// or (for writting)
var url = this.moduleUrl("read","mynodeset1", "node1.node2");
// or
var url = this.moduleUrl("write","mynodeset1", ["node1","node2"]);
// or
var url = this.moduleUrl("read","mynodeset1");

```

The returned URL is a string ready for use in requests. For example if the class in question is an App and you want to open a simple view window with a view loaded from the server:

```Javascript
    var view1 = new SimpleViewWindow(        
        {
            url: this.moduleUrl("read","mynodeset","view");
        }
    );
    
```
_Of course the sample above does not finalize the creattion - the window will have to be placed somewhere and so on - this only demonstrates how to use the mapping function you got from the implementer._

This implementer can be used in any class that needs to programmatically create queries to nodes on the server. Most often these will be view and application classes.

#### Classes intended for reuse and parameterization

Using __IPlatformUtilityImpl__ is convenient when you have to programmatically construct the URL. Having all the parts in different arguments is handy wjile coding Javascript. However this approach is less convenient when one needs to supply a single parameter holding the same information.

When will this happen? One of the best examples is the DataArea class which requires an URL address passed to the configured Connector for the area. To deal with that there is an interface: __IPlatformUrlMapper__ which serves two purposes:

- it can process a standard __pseudo-URL__ syntax and pass it through the same __moduleUrl__ function and return the result
- it holds the module name in a property (_and the server name - but it is currently not fully supported - do not use in production_).

One can do with it is to read the pseudo URL and create a real one. Assumong you know the module you just need the static routine from the interface it will look like this:

```Javascript
 var url = IPlatformUrlMapper.mapModuleUrl("read:/mynodeset/node1.node2","mymodule");
```

However the more typical usage will be a bit different. If you want to get the URL as parameter, you probably want also the module to be passed as parameter as well. Then you should implement the interface first:

```Javascript
MyClass.Implement(IPlatformUrlMapper);
```

With this your class gets two pseudo-properties: __get/set_modulename__ and __get/set_servername__. As we mentioned before - do not use the servername yet, but the modulename is what you need. So, module name and the pseudo-URL now can be passed as parameters. If your class inherits from Base it can be used in views like this:

```html
<div data-class="MyClass modulename='somemodule' myurl='post:read:/nodeset1/node1.node2'"> ...</div>
```

The myurl property is imaginary here, depending on what you do this parameter may be named differently and you can even have more than one URL related parameter. The point is in your class you can read it and pas it through the mapping routine:

```Javascript
MyClass.prototype.someMethod = function() {
    ...
    var realUrl = this.mapModuleUrl(this.get_myurl());
    ...
}

```

This will produce a real url directly from the one in the parameter using the module specified in the modulename property.

Another technique is to pass the pseudo-URL and the module name to another class that uses the same Interface in some form (_calling the static method or implementing the interface_). How are you going to pass these parameters of course depends on that other class, but there is a specific rule for Connectors.

Connectors support set of options and the module name can be specified as an option:

```Javascript
var conn = new AjaxXmlConnector('post:read:/nodeset1/node1.node2', this, { moduleName: "somemodule"});
```

Now if the connector you create knows what to do with such an option it will automatically determine by its existence that the URL has to be passed through the __IPlatformUrlMapper.mapModuleUrl__ we described above. DataArea does exactly that and transfers the __modulename__ property as an option to the connector, passes the __contentaddress__ property as an address (URL) without changes and if the connector understands the role of the moduleName option it takes care to create the real URL.

At this moment only the __AjaxXmlConnector__ does that, but you do not need to check for support - you just pass the option. It is responsibility of the one who specifies the parameters to determine if they make sense or not.

#### The syntax of the pseudo-url

The full syntax of the psudo-URL supported by the __IPlatformUrlMapper.mapModuleUrl__ and its instance equivalent __IPlatformUrlMapper.prototype.mapModuleUrl__ is:

```Javascript
[get:|post:][read|write/]<nodeset_name>[/node1[.node2[...nodeN]]]
```

- If get and post are missing, get is assumed
- if read and write are missing - read is assumed

#### Low level routines

As it was mentioned above the only configuration one needs to make when setting up an instance of BindKraft is to specify __IPlatformUtility.moduleUrl__ static method that creates a real URL from the parts discussed in this document. Then the rest of the supplied routines will call it at certain point to do the conversion.

```Javascript
IPlatformUtility.moduleUrl = function (moduleName, readWrite, pack, nodePath) 
```
Supplied when setting up a BindKraft environment. If necessary can becalled directly. Generates real URL (without performing mapPath on it). 

```Javascript
IPlatformUtility.standardModuleUrlParse = function(pseudoUrl, moduleName)
```

Parses the pseudo-URL into object:

```Javascript
var r = {
            // In case different composition is needed
            action: "write" | "read",
            method: "post" | "get",
            pack: "nodesetname",
            nodepath: "nodepath_as_string",
            server: "reserved_currently_null",
            module: "module_name",
            start: integer, // where in the string the URL starts - should be 0
            length: integer, // the length og the URL
            // URL with replaced beginning and mapped id module is supplied, otherwise these will be null.
            // Without the post:/get:
            mappedRaw: string, // The resulting URL
            mapped: string // Like mappedRaw, but preffixed with post: if the method is post.
        };
```

Most low level methods and structures in BindKraft that take URL recognize the "post:" preffix if they have the freedom to decide the HTTP method.


```Javascript
IPlatformUtility.standardModuleUrlMap = function(originalUrl, parsedURL, bWithMethod)
```

Converts the uriginal string URL into real one. parsedURL must be the result from standardModuleUrlParse above. If bWithMethod is true-like value post: prefix is included if necessary.

This routine is rarely called directly, becuase IPlatformUtility.standardModuleUrlParse is calling it internally and populates the returned structure with the calculated URL (mappedRaw without prefix, mapped with prefix).

The most important detail here is that the translation takes effect up to the recognized part of hte URL and the rest is preserved "as is". This means that URL containing some parameters can be translated without losing the parameters e.g.

post:mynodeset/nodex?a=abcd&b=1234
will turn into something like this for exampe (we assume a sample conversion similar to typical KoreKraft routing):

post:/node/mynodeset/nodex?a=abcd&b=1234

_Real life URL conversion will likely differ, but the parameters will remain. The actual conversion is supplied with the IPlatformUtility.moduleUrl defined as part of the setup of the instance/environment_

```Javascript
IPlatformUrlMapper.mapModuleUrl = function(url, module, server)
```

We already described this one in the sections above.