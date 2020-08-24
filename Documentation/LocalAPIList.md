# Local API List

This document lists all the known Local API with inline description or a link to the corresponding article.

## [IGenerateCommandUrl](IGenerateCommandUrl.md)

Generates an URL leading back to the system with the specified commands included.

Additionally enables querying the available aliases for apps that use more than one.

```Javascript
function IGenerateCommandUrl() {}
IGenerateCommandUrl.Interface("IGenerateCommandUrl", "IManagedInterface");
IGenerateCommandUrl.prototype.getAliasesForApp = function(appcls, id) { throw "not impl"; }
IGenerateCommandUrl.prototype.generateUrl = function(usealias, owncommands, options) { throw "not impl"; }
IGenerateCommandUrl.prototype.getCommandURLGenerator = function(usealias, options) { throw "not impl"; }
```

## [IAppDataApi](SystemClasses/IAppDataApi.md)

An API from which convenient tools for reading and managing the `app data` canbe obtained. These will extend in time, alternatively the `app data` cna be accessed with memory filesystem classes, but this API should be favored, because it is focused on simple and quick access to specific pieces of data commonly used for the same or at least similar purpose in all apps.


## [IShellApi](SystemClasses/IShellApi.md)

Access to a basic set of shell functions through LocalAPI.

```Javascript
function IShellApi() {}
IShellApi.Interface("IShellApi","IManagedInterface");

IShellApi.prototype.appstart = new InitializeEvent("Application started and initialized").Arguments(null);

IShellApi.prototype.appstop = new InitializeEvent("Application shutdown");

IShellApi.prototype.bindAppByClassName = function(className) { throw "not impl"; }.ReturnType(IManagedInterface);
IShellApi.prototype.bindAppByInstanceId = function(instanceId) { throw "not impl"; }.ReturnType(IManagedInterface);
IShellApi.prototype.activateApp = function(appproxy_orid) { throw "not impl"; }
IShellApi.prototype.bindAppsByClassNames = function(className1, className2, className3) { throw "not impl"; }.ReturnType(ILocalProxyCollection);
IShellApi.prototype.getRunningAppsClassNames = function() { throw "not impl"; }
```

## [IAppInfoApi](SystemClasses/IAppInfoApi.md)

## IHistoryTracker

## IQueryTokenStorage