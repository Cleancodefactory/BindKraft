# URL module mapping

The URL mapping/construction are concerns that come to mind when you develop something that will go into a BindKraft module as a component that will be used either by other code in the same module or by code from other modules.

By "component" one can consider different things - from components/controls for usage in templates to whole apps. The question poses different concerns depending on what we talk about. For instance:

- Apps are by definition well-separated entities, encompassing certain functionality and holding their own resources. One can say apps are often associated with a BindKraft module - not literally correct, but close.

- View components for inclusion in templates on the other hand rise the question about their resources and data once you recognize that in order to use them in code or template in another module, they should stay in touch with their original module for part of the resources or data they use.

The resources and data these components use are either cached in advance or dynamically requested which involves usage of URL. This brings the question "how to stay in touch with the resources and data in your origin module on the server".

BindKraftJS does not specify exactly how the modules should be supported on the server except the requirement their Javascript to be loaded in order of BK modules dependency. Yet there is a BK module, usually called PlatformUtility (the name is not mandatory), that is expected to implement a couple of functions that translate BK module name and module specific path/parameters into URL - the implementation of `IPlatformUtility.moduleUrl` and `IPlatformUtility.resourceUrl` static methods.

While it is possible to call these methods directly, there are used internally for more convenient ways to perform the mapping through them. See the scenarios described further below for more info.

## Abstract BindKraft module URL construction

Basically the parameters that define an URL targetting BK module resource/request are:

**server** - In case the project is using more than one origin servers (not typical - in most cases not used)

**moduleName** - The name of the BK module

**readWrite** - The kind of operation to perform

**nodeset/handler** - The end-point on the server (more about it later)

**nodePath** - path specific for the nodeset/handler

Through `IPlatformUtilityImpl` interface implementor BindKraft enables classes that will make requests to the server to simplify the URL construction in their code. E.g.

```Javascript
// The class implements the IPlatfromUtilityImpl, we use the typical one-server scenario, so no server is specified
MyClass.Implement(IPlatformUtilityImpl, "MyModuleName");

// Then in any method of the class we can get an url like this
    var url = this.moduleUrl("read", "mynode", "path1.path2");
```

The resulting URL will, of course, differ depending on the implementation of IPlatformUtility.moduleUrl in the project and that implementation will reflect the way the server side works/is organized.

For CoreKraft for example the above URL will look like



[post:|get:][read|write]/<pack_name>[/<nodepath>]

Example: post:read/mydefinition/node1.node2

	post:write/mydef2/node1?param1=v1&param2=v2

	read/def3
