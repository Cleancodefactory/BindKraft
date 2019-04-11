# System settings

This article describes the system settings. These are settings potentially consumable by any code running in a client BindKraftJS session. Thus they are not application specific, but some of them can serve as application defaults where feasible.

**Which settings are "system" and which aren't?**






This document is updated to list all the known system settings defined by BindKraftJS. See the conventions below if you need to find the best placing for a setting defined outside of the BindKraftJS library code.

# Where the settings are?

The system settings are nothing else, but a Javascript in-memory data - objects and arrays forming a structure. It is exposed directly (unsafe) with accessors through which it is more safe to access the same data.

```Javascript
// The location of the settings (direct, unsafe access)
System.Default().settings

// The 
```

TODO: Continue the article
