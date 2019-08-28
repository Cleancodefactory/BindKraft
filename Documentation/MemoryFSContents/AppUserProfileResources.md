# User profile maintained App resources

## User profile configuration entries

Location:

infofs:/appinfo/`{applicationname}`

The file layout is like in this example:

```Javascript
{ caption: "A human readable app name",
  entries: [
      { name: "Main background", type: "imageurl"}
      { name: "Main sound", type: "wavsound"}
  ]

}

```
**How to create an entry?**

Use 

```Javascript
BkInit.AppInfo(appClassName, function(info){
  info.object("userprofileentries",{ "see the examples" })
})
```
**appClassName** - is the name of the app for which the entry is created.

The name of the file must be "`userprofileentries`" - the UserProfile managers will look for these settings under that name (exactly).

This is usually done in the `init.js` file of the module in which resides the application implementation.


## User profile custom app data

TODO: (write me)