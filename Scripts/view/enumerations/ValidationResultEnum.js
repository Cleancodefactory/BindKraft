


/*ENUM*/
var ValidationResultEnum = Enumeration('ValidationResultEnum',{
    pending: -2, // the validation is pending (asynch - wait a callback);
    uninitialized: -1,
    correct: 0,
    incorrect: 1,
    fail: 2, // 
    critical: 2
});