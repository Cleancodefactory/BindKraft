# Local API List

This document lists all the known Local API with inline description or a link to the corresponding article.

## [IGenerateCommandUrl](IGenerateCommandUrl.md)

Generates an URL leading back to the system with the specified commands included.

Additionally enables querying the available aliases for apps that use more than one.

## [IAppDataApi](SystemClasses/IAppDataApi.md)

An API from which convenient tools for reading and managing the `app data` canbe obtained. These will extend in time, alternatively the `app data` cna be accessed with memory filesystem classes, but this API should be favored, because it is focused on simple and quick access to specific pieces of data commonly used for the same or at least similar purpose in all apps.
