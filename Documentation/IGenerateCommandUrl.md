# IGenerateCommandUrl

Available as [Local API]() exposed by the system.

Generates an URL leading back to the system with the specified commands included.

Additionally enables querying the available aliases for apps that use more than one.

```Javascript
function IGenerateCommandUrl() {}
IGenerateCommandUrl.Interface("IGenerateCommandUrl");
/* Returns a plain object with all the aliases matching the appcls/id conditions.
   example: 
   {
       sys: {
           app: "SysToolsApp",
           dependencies: [
               "script:systools",
               "cl:alert 'hello'"
           ]
       }
   }
*/
IGenerateCommandUrl.prototype.getAliasesForApp(appcls, id);
/* Generates a single URL using the specified
    usealias - string, alias name
    owncommands - string, commands to include in the URL
    options - ignored for the moment.
*/
IGenerateCommandUrl.prototype.generateUrl(usealias, owncommands, options);
/* Gets a generator delegate that can be called each time an URL has to be generated with the same alias.
    usealias - string, alias name
    options - ignored for the moment.
    usage:
    var g = api.getCommandURLGenerator(usealias, options);
    // then g can be used
    x = g.invoke(owncommands);
    owncommands - string, commands to include
*/
IGenerateCommandUrl.prototype.getCommandURLGenerator(usealias, options);
```

The generator returned by the **getCommandURLGenerator** is a `delegate` that can be called each time URL needs generation.