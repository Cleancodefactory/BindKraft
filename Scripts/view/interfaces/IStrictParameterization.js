/* A marker Interface that instructs the parametrizer to check if all the parameters match set_xxx properties or fields declared as intended for parametrization
    Usually you should keep this during development and remove the Interface after that. This feature is intended only for development and can be also turned on globally
    by setting JBCoreConstants.StrictParameters to true. Again this should be turned off in production because of the cumulative impact over the performance.

    Warning! We have to review this - too many wayus to do this are assumed to exist (it seems)
*/
/*INTERFACE*/
function IStrictParameterization() {}
IStrictParameterization.Interface("IStrictParameterization");
