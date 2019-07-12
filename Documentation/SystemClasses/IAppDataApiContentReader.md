# IAppDataApiContentReader interface

To obtain an object implementing this interface use [IAppDataApi](IAppDataApi.md) local API and call its `getContentReader()` method.

```Javascript
function IAppDataApiContentReader() {}
IAppDataApiContentReader.Interface("IAppDataApiContentReader", "IManagedInterface");
IAppDataApiContentReader.prototype.content(filename, requiredContentType);
IAppDataApiContentReader.prototype.contentTypeOf = function(filename);
IAppDataApiContentReader.prototype.isAvailable = function(filename);
IAppDataApiContentReader.prototype.restore = function(filename);
```