

// +Version 1.5
var ActionRuleRegisterScopeEnum = {
    any: null, // In the standard implementation this will be equal to app, but customized classes may change its behavior.
    first: "first", // Only the first register is asked for the rule(s)
    view: "view", // Any registers encompassing the starting point up to the view root will be asked.
    window: "window", // Any registers up to the containing window will be asked.
    app: "app" // Every register up to the app will be asked.
};