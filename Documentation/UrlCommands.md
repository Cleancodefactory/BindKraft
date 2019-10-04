# URL Commands

URL with commands example(s):

```
http://server.tld/project?param=val&param2=val2&prefapp1=launchone%20me

```
`param1`, `param2` are some random query string parameters for some other unknown purpose that is not our concern.

`prefapp1` is an example of URL commands for an app that have registered an alias for itself called "`app1`". The "`pref`" part is system wide and is configured for the project like this for instance:

```Javascript
    // Init.js - usually in the main project's module
    BkInit.commandUrlGlobal(function(g){
        g.prefix("pref");
    });
```

The prefix registered this way is one for the entire WebSite/Project - the collection of Bk modules that forms the site/project.

Each app that wants to use URL commands has to register alias for itself. The combination of the gloabal prefix concatenated with an app alias will be the name of the query string parameter that holds the value (containing CL script) intended for that app.

> Before continuing we have to remember that URL are precious commodity and the space for data in an URL is very limited. Furthermore BindKraft is a platform that would put many apps together on the same workspace page and many of them may compete for a piece of the URL for themselves. The system also supports services that use the URL and these features will grow in time. Thus any URL related features are created with special considerations for the space they require in the URL. This will usually add a little more complexity to the process, but in return the resulting URL will be noticeably shorter than what they would be otherwise.

So the _global prefix_ and the _app aliases_ are joined by additional features aimed at shortening the data that has to be recorded in URL.


