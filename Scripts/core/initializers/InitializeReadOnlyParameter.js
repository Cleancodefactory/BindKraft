
// Deprecated: do not use
/*CLASS*/
function InitializeReadOnlyProperty(desc,defval) {
    Initialize.apply(this, arguments);
    this.type = "ReadOnlyProperty";
};
InitializeReadOnlyProperty.Inherit(Initialize, "InitializeReadOnlyProperty");