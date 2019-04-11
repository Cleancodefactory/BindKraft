


/*CLASS*/
function IFrameElementImpl() {
    Base.apply(this, arguments);
}
IFrameElementImpl.Inherit(Base, "IFrameElementImpl");
IFrameElementImpl.prototype.set_src = function(v) {
    if (v != $(this.root).attr("src")) {
        if (v!= null) $(this.root).attr("src", v);
    }
};
IFrameElementImpl.prototype.get_src = function() {
    return $(this.root).attr("src");
};