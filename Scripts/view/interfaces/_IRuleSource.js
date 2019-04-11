

/* IRuleSource*/
/*INTERFACE*/ /*DEPRECATED*/
// Will be removed from the framework soon! It was never used and the related features were never finished, so it is unlikely that someone have used it ever.
function IRuleSource() { }
IRuleSource.Interface("IRuleSource");
IRuleSource.prototype.getRuleByName = function (ruleName, usage) {
    // usage enables the source to maintain same names for different purposes or prevent wrong usage.
    // return function or null if the rule is not found.
    return null;
};