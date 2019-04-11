# Apps overview

The __application__ (App) concept in the framework serves the need of explicit separation between projects/functionality etc. It basically matches the idea of an application we built while working with operating systems and programming environments. The most important difference is that the separation is much more shallower in here - because of the limitations of the environment.

Implementation wise the Apps just implement a set of application specific interfaces (IApp the critical one in each case) and behave in a well-known manner driven through some of these interfaces.

Having the concept wrapped in interfaces, separated and following well-known controllable life cycle we can provide more features - and we do. Thanks to the defined context we know to whom we can provide them, how and when and we can grow their number as new ideas got implemented.

Still, we have only the basics absolutely required (on framework level). From that point on it is up to the developer and their decision what kind of system they want to construct with the framework. A system designer may want to have features that absolutely depend on some of the extended system defined features and applications must support them in order to fit into the specific construct. Even in the hardest of these cases there is a clear path for gaining compatibility with such systems - it is defined in framework terms and they can be just extended to support them when such an app have to be used in a constructed system that makes some of the optional functions required.

For details on the features - required and optional see below.

For the moment most of the application interfaces are defined in the view branch of the framework and not in system as most people would expect them. The reason is that many other constructs provide very convenient features through knowledge about apps existence (most of them in windowing, but some exist in the view branch as well). We are going to clear this inconsistency in future versions, but it will require moving most or all of the system features to another lower level of dependency - closer to the core.

## Base App functionality

### IApp interface

There are ready to inherit base classes, but it is the interfaces they implement that tell the story. So, lets start with the core application interface - IApp

```Javascript
function IApp() { }
IApp.Description("App main Interface.");
IApp.Interface("IApp");
IApp.prototype.appinitialize = function (callback, args) {
    BaseObject.callCallback(callback, true);
    return true;
}
IApp.prototype.run = function (args_optionally) {
    // TODO: attach or override with the main application code.
    throw "The app is not implemented.";
}
IApp.prototype.appshutdown = function (callback) {
    BaseObject.callCallback(callback, true);
    return true;
}
IApp.ImplementProperty("instanceid", new Initialize("");
IApp.ImplementProperty("instancename", new InitializeStringParameter("");
IApp.prototype.placeWindow = function (w, options) { } //REPLACEABLE
IApp.prototype.displaceWindow = function (w, options) { } //REPLACEABLE
IApp.prototype.get_iconpath = function() {
}
IApp.prototype.get_caption = function() {
    return "Unnamed App";
}
IApp.prototype.get_approotwindow = function() {
    return null;
}.Description("Gets the app's hosting window (or sometimes the main app window). The implementation may vary depending on the system architecture. Usually this is the window created for the app by the Shell.");
IApp.prototype.ExitApp = function() { } //REPLACEABLE
```

The interface carries some default implementations where possible, but they are rarely useful in normal development process and the base classes will implement them accordingly. So, the default implementations are for usage mostly in low level framework programming and wont be seen by most developers ever. We left some to illustrate what is done there somewhat.

The members commented with //REPLACEABLE are supposed (a Javascript trick) to be replaced by the host that launches the App in the instance it creates. The reason is quite obvious - only the host knows how and where to place/displace the app's main window(s) and exiting the app cleanly is also process best done if controlled by its host.

So this interface represents a life cycle starting with appinitialize (called asynchronously) continued with synchronous call to run if the appinitialize finishes successfully and finished (no matter happened before) with appshutdown again called asynchronously. The rest are properties and methods the application or the outer world may need during its life-time.

The launching party (the host) has to take care about the args (whatever they might be) - pass them to appinitialize and run.

The base classes (like AppBase) provide basic implementation one can extend without bothering too much with the behavioral details by implementing directly over the interface, but it is doable with moderate effort and specific apps that do not want to follow the pattern enforced by the base classes are not so hard to create.