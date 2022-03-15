# URL usage conventions in BindKraft

While not absolutely mandatory these conventions correspond to the way certain BindKraft APIs work. Violating the conventions is possible, but requires good knowledge of the affected functionality.

## URL real estate separation.

_More information about the URL structure can be found in the documentation for BkUrl._

URL general structure

```
<bk-preffix>:<schema>://<authority>/<path>?<query parameters>#<fragment>
```

**bk-preffix**

Supported by some BindKraft API to enable option to specify post/get verb as part of the URL and avoid the need of additional argument. Basically this is necessary when the URL can be specified in the HTML markup.

**schema**

The standard URL schema. No special usage in BindKraft. It should be http or https. Pseudo-schema names could be introduced in future.

**authority**

Projects using sub-domains may use part of it, but this is typically a project specific implementation.

**path**

If we describe the path as prefixes and the rest of the path:

```
<prefix1>/<prefix2> ... <prefixN>/<rest of the path>
```

