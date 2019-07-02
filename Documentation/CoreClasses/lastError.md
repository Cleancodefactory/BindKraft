# Using lastError

The **last error** feature in BindKraftJS is like its counterparts in many API, libraries and frameworks. It enables methods to use simple failure indication - returning null or false for example, but fill the lastError with more detailed information. This way the calling code can easily ignore the details when possible, but still check them sometimes if necessary.

The last **error feature** is a work in progress. The feature is there, but its usage is for the moment very limited. The BK code will gradually implement it in new and existing API during the next versions, making it the main method to deal with errors and failures in methods that return results synchronously (the rest mostly depend on Operation).

In the near future the feature will also log into the run-time diagnostics.

