# Settings, Persistence, State and shared data pieces

This is a hub article that will direct the reader to a variety of BindKRaftJS features related to usage and management of: 

- settings (of an app for example), persistence of settings; 
- state or other similarly behaving data
- share management or usage of data pieces serving some common purpose.

This is a very wide topic and finding the right solutions van benefit any project with added ready to use functionality that is offered by the platform.

## Structure of the article

The brief overview of the various techniques and API you can find further below after the list of functionalities and API with references to their main articles.

If you lack enough knowledge about any of the features mentioned in the list, you can start by scrolling down to its short overview and then go to the main article after determining if it is really something you need.

## List of features, API and techniques

* `BindKraftJS structural/compile settings` - almost exclusively for developers. Require a javascript file included before the framework with the values one wants to change. Tune some details of the core behavior of the platform, enable or disable error checking and code validation. Customization is usually limited to the development process and not the production enviroments.

* `System settings` - Settings tunning the core parameters of a platform instance. Best idea what these settings cover is that among them there are the localization parameters, defaults for the data formatting in ajax requests and other similar ones that tune the platform to the environment where it will run.

* `Platform utility` - These are not exactly settings. This is a special module intended to hold the javascript implementations of a few special functions that will synchronize the BindKraftJS with the server back end. For instance an instance working with NET.Core server using CoreKraft will most likely differ from a back end based on node.js not so much because of the server platform, but mostly because of little things like the URL routing scheme implemented for example. The functions that translate this to a common representation for the rest of the code have to be written in this module. This is almost always one time job for a project or even a group of projects with common setup - the chosen client/server software and its general configuration. Anyone who uses BindKraft may expect to need to do this once and not need to change it for years. Pre-build `PlatformUtility` modules are available for the server platforms supplied by us.

* [In-Mempory "files" in general](MemoryFS.md) - this feature is basis for multiple other solution and is described on its own. It is recommended to read about it before going to any of the features based on `"memory files"`. The term `"memory files"` is convenient, but not technically correct - files opened and closed, read as streams and everything one expects from a regular file in an operating system will certainly be wasteful and extremely inconvenient for a javascript platform working in a WEB page in the browser. The term took traction because of the structural implications it has when programmers deal with pieces of data spread in a tree of storages (directories) along specialized "file systems" - i.e. a kind of spatial awareness that is natural for a developer who deals with directory trees every day. The `"memory files"` are actually instances of certain classes designed to hold conveniently certain commonly used pieces of data at easy to understand and remember "file system" locations. The added benefit comes from the fact that these "files" actually offer also easy to use local and remote persistence mechanisms which makes them not only in-memory structures, but also structures representing interface to something that is completely or almost automatically fetched and stored somewhere else.

* `Property set "memory files"` - These memory files hold simple set of named properties that can contain nothing more than simple values or lists of simple values. This makes them easy to both accommodate in any storage and use for small pieces of state or configuration data. Many system features also use them.

* `Shell shortcuts` - These are extended version of a CL script memory files, enriched with an icon and description. There is a whole "file system" (shellfs) dedicated for them (and a few other types of files). Placing them into convention defined places in that "file system" they feed the Shell UI of the system instance with content. It can be also used by your apps when they need to offer to the user sets of actions that will start/activate other apps (shell-like UI). There are special `BKInit` functions that allow the developer to conveniently fill the top menus when an instance desktop is constructed from BindKraft modules.

## About settings in general

Further in this document different kinds of settings and mechanisms for dealing with them are described among some related ones. So, it is a good idea to synchronize the understanding of the author and the reader about what settings and configuration can be.

For example, one can consider a wide variety of settings to be system ones and this would be both correct and incorrect depending on how do we agree to split them. One can consider a setting something that has global impact over the instance, but also something that affects only a very specific functionality or even a particular app. On another plane one can consider some data to be or not a setting depending on how often and why it changes - e.g. imagine there is data that configures the behavior of an app, but these if "settings" are changed (programmatically) by another app and it starts and stops the first changing them each time the name "setting" will be considered correct by some and incorrect by others. Some people will prefer to consider such settings as arguments/parameters for the app being started and stopped, while the others will prefer to view absolutely the same process as dynamic change of configuration. Well, both will be right and wrong and while this is just a semantic problem it can ruin your day. If you consider the consequences - what will people do next depending on how the view the nature of the process this can have undeservedly deep impact over the evolution of the project.

This makes it important to clearly split the settings we can from the start and provide mechanisms that form convenient abstractions for the rest. In some cases this will not bring any visible technical advantage, but even then there will be the benefit of less misunderstandings and the potential for implementation of common functionality for common problems with developers who all see them the same way leaving only the selection of the mechanism vulnerable to arguments ( something that no one can hope to eliminate with a framework?). Once chosen - the API, the base classes, interfaces and abstraction are defined and the work should go more smoothly.

To address such a philosophy BindKraftJS channels tasks of these kinds into a few mechanisms and also provides goodies for them - based on the mechanisms. For example the "memory files" put a common denominator that enables general pre-built persistence mechanisms to be used with the file(s) leaving the developer to do what's needed with the file's content. As long as usage of such a file-like abstraction fits the way this would be done the rest comes almost for free. Thus during the project development the programmers have to choose the abstraction balancing the technical benefits with the way they prefer to see the data.

Finding the right place and mechanism for all cases is obviously too ambitious a task. We can only hope to offer enough and make space for further abstractions and mechanisms - both in the platform itself and for the people who build projects over it. The specific mechanisms you can check below are inspired by recognition of these facts, some are simple and walk closely to what the WEB browser and Javascript offers, some are elaborate abstractions that may require a bit more time to adopt, but can offer consequent extras that one will have to build from scratch without them.

TODO: review the next texts and recompose them according to the article's concept (they were written with a bit different idea about the structure of the presentation - one we rejected)

So, here is how this goes in BindKraftJS.

_Something to consider first_: Having a good level of understanding of the platform would pose an interesting question before you - many "things" use something like settings/configuration in some way or another. For the most part each such occasion looks logical enough, but if consider them all together this can paint a confusing picture. The problem comes from the fact that not all settings have the same importance or the same scope, or the same stability through the life of a given system. Some settings are accessed directly and openly used even in application code, others are consumed only behind the scenes by different parts of the platform, but not all parts are equal - some are core 
functionality that impacts almost everything, others are specific to rarely used API. To make somebody's life difficult their pattern of usage can also differ a lot - imagine settings that are there to serve as initial defaults for some tasks or classes, but customized instances of them are created as part of the normal work. Basically a confusion will be born each time one tries to combine everything together under one umbrella. In a platform like BindKraft apps, system features, daemons and other elements live together and serve each other and the best way to put order into chaos is to consider each separate API, app or anything else separately and its settings/configuration too. Then the mountain of settings is reduced to small sets that are easy to grasp and only very few of them are of any interest in any particular situation.

So, what remains are a small set of settings that are so widely used and important for the system that we call them "`system settings`". All the rest are specific parameters/settings for a specific API, app or another element.

BindKraftJS implements a rather strange (at first look) functionality that allows anybody who needs settings or anything alike to use it - "memory files".

