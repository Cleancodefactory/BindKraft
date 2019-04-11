

// +Version: 1.5
var ActionRulePurposeEnum = {
    unspecified: "unspecified", // Unspecified purpose - any rule will match
    field: "field", // Field level rules will match only
    multifield: "multifield", // Rule for multiple separate fields.
    local: "local", // Local rules - covering a subarea of a view
    view: "view", // View level rules (limited by template root)
    window: "window", // Views for window contexts (non-view specialized.)
    app: "app" // App-wide rules
};