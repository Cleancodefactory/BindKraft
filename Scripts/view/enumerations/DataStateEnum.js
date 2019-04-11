

/*ENUM*/
// Entity states in this application
// Note that only the aliases in the first column are official, the rest are obsolete and are kept for compatibility reasons.
// This enumeration is intended for dual usage - for marking of data items and as an instruction to some functions that manage state.
// Check the comments to see which constants are applicable
var DataStateEnum = {
    Undefined: "-1", // [instruction - function arg only] For special use only, should not appear in the state property (ever ever never)
    Unchanged: "0",
    New: "1",       Insert: "1",
    Updated: "2",   Update: "2",
    Deleted: "3",   Delete: "3",
    Undeleted: "4", Undelete: "4" // [instruction - function arg only] For special use only. Normally you should not set this flag explicitly
};
// Helper Conditions
var DataStateConditionEnum = {
    notDeleted: function (idx, item) {
        if (item[Binding.entityStatePropertyName] == null || item[Binding.entityStatePropertyName] != DataStateEnum.Deleted) return item;
        return null;
    }
};