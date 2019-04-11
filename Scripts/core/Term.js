// Helper base class for argument polymorphism
function Term(k,v) {
    this.kind = t;
    this.value = v;
};
Term.Inherit(BaseObject, "Term");
// Creators
Term.Key = function (s) { return new Term("key", s); };
Term.Type = function (s) { return new Term("type", s); };
// Option setters
Term.prototype.child = function (v) { this.isChild = v; return this; };
Term.prototype.parent = function (v) { this.isParent = v; return this; };