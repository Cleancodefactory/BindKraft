


/*CLASS*/
function HtmlIFrameElement() {
    Base.apply(this, arguments);
}
HtmlIFrameElement.inherit(Base, "HtmlIFrameElement");
HtmlIFrameElement.prototype.set_src = function(v) {
    if (v != $(this.root).attr("src")) {
        if (v!= null) $(this.root).attr("src", v);
    }
};
HtmlIFrameElement.prototype.get_src = function() {
    return $(this.root).attr("src");
};