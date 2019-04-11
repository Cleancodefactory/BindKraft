# Creating AppBaseEx derived app

AppBaseEx is thin layer over AppBase, but the async parts are based on Operations and this makes them a little easier to deal with. It is recommended to use AppBaseEx for new projects. While new features will be available for both AppBase and AppBaseEx in future we will treat AppBase mostly as internal lower level class and everything will be exposed more conveniently in AppBaseEx.

## Overriding with explanations and details.

This article will start extending the AppBaseEx and show variety of tasks the developer may want to implement. By all means, no one needs to do everything shown here - each part of the overriding process shows certain technique and may or may not be needed in any particular project - we just demonstrate how and what can be implemented in an app - (the most frequent techniques only).

## Basic declarations - class to inherit, interfaces to implement, shell command, declare provided services.

```Javascript
// Constructor
function MyApp() {
	AppBaseEx.apply(this,arguments);
}
// Inherit  the parent
MyApp.Inherit(AppBaseEx, "LifeGameApp");
// Implement services
MyApp.Implement(IMyService);
MyApp.Implement(IMyOtherServiceImpl);
// Register a command with the global command processor
LifeGameApp.registerShellCommand("ma","MyApp",function() {
		Shell.launchAppWindow("MyApp");
	},
	 "Short description of the command");
// Provide types as service
LifeGameApp.prototype.provideAsServices = ["MyApp"];
```

### Constructor
### Inherit
### Implement
### Register command
### Provide some services

## Implement the 3 AppBaseEx methods

