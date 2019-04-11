# BindKraftJS ROADMAP

## General features



## Individual features

Concrete features - interesting mostly for programmers working actively with BindKraftJS

# 2019

`AJAX layer full replacement`. While these communications can skip any BindKraft support the integrated AJAX support offers benefits that are a full degree more convenient for most applications. Historically the current version is still using a JQuery based implementation designed for very specific response formats and bound to the current CoreKraft implementations. The implementation has its merits, but initially it was planned to serve narrow scenarios and most importantly - business projects, each implemented as set of apps working with roughly the same backbone. This is in the queue for some time and should gain main focus in Q2 and be complete no later then Q3.

`Removing most of the JQuery dependent code`. We wanted to do this earlier, but active projects and needs to continue the platform development prevented the attempt to make this in a single move. Now a more gradual approach is in progress and its first phase is expected to finish at the end of Q2, with its second phase planned for Q3 (full removal of JQuery)

`URL commands, navigation history and SEO support`. This feature consists of several pieces and is expected to be fully complete at the end of the year. The separate details:

* **URL commands** - Generation of URLs that contain command line pieces that are complemented with pre-configured parts and executed when such an URL is directly loaded in the browser. Example scenarios: Invitations to certain app (URL clicked in email, notification, chat program etc.). As you may guess each workspace is configured with a number of apps that the user can use. One of them wants to generate URL that somebody will send to another party and that other party will be invited to join (register) for this workspace and needs to be led to the specific app, which needs to further put that party automatically into the role in which it is invited. This is done in Q1 and is in testing and experimental use, will be opened for general usage shortly.

* **Navigation history** - one of the features adapting BindKraft projects for more typical WEB use. This involves roughly:  `a)` notifying the user when they go back too much and are about to leave the workspace (unload the page and shut down the desktop in the process); `b)` Support minimal history tracking (optional - depends on configuration) by tracking the active app - history switches between apps in the remembered order. `c)` Support apps that want **deeper** history support, by allowing them to push their states into the history tracker and then notify them to change to the remembered state when the user travels through the history. This involves state encapsulation feature (**TreeStates**) and various small features making it easier to build apps in such a fashion. This feature is well in progress and should be fully completed in May.

* **SEO support** - Further extended **TreeStates** support by apps gives them an unique state identification that can be included in an URL. Among the other options these states have to be able to fit in the path part of the URL and thus form a routing abstraction that corresponds to the state of the app that has to be indexed by search machines. Connected with that unique state identifier each app will be able to post to a server content and meta information that can be supplied to indexing user agents when requests with the corresponding URL-s, containing those identification pieces are made. Only apps that want some of their content indexable need to be designed in **TreeStates** fashion. The unique state can be included in URL in different configurable manners - in the path, in one or more query string parameters as a minimum (some additional options may or may not be included in the final release). Enumeration of the available states is another feature that is needed for SEO support and will be started some time in Q3 - there are some preliminary plans to use it also for the testing support (app automated testing). Because of the number of separate features needed and the wish to employ some of them in other scenarios as well this work is expected to reach completion in Q4.

* **Launch for commands, Launch for embedding** In relation to the needs of some of the other planned features and in general creating convention and signaling that informs a launched app for its purpose (this time) is a necessity for the apps that have to support for instance: "automation" - execution of "pushed" commands from outside with effect over the overal state of the app (even the UI); embedding - apps that are capable to work alone and as part of another app have to adjust to the situation. It is not yet decided, but the implementation may support abstract purposes - ability to define purposes beyound the _for commands_ and _for embedding_.
