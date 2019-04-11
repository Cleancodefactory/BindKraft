Sytem and application/service etc. related interfaces.
Some interfaces are still in the view branch because there is internal 
features that use them in other class - e.g. windows can interact with 
their app and provide some interesting features.
The dependency of framework classes to application related stuff will be kept 
minimal (little chance that any of these interfaces will need to go to the view)
and advanced features that need then will occupy new branch.
It is possible that we will move system closer to the core and avoid dependency 
difficulties, but it is not as easy as it looks - imagine how much help can be an
app base class or helper class that knows what a window is and so on. We are trying to
keep these things limited to interfaces, but sometimes is just too tempting to offer more 
than that.