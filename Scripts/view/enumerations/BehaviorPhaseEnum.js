


/*ENUM*/
// Behavior phase 'enumeration'
var BehaviorPhaseEnum = {
    early: 0, // Early, before binding, should not be used (currently not implemented)
    materialize: 0,
	immediate: -1, // Used in calls for programmatic behaviour attachment only.
    bind: 1, // during binding as early as possible
    postbind: 2, // after the local DOM tree is bound.
    update: 5 // on data update
};