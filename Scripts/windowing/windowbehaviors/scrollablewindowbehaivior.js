function ScrollableWindowBehaivior() {
    WindowBehaviorBase.apply(this, arguments);
}

ScrollableWindowBehaivior.Inherit(WindowBehaviorBase, "ScrollableWindowBehaivior");

ScrollableWindowBehaivior.prototype.on_ViewLoaded = function (msg) {
    var element = $$(msg.target.root).first().select("[data-key=_client]").first().getNative();
    var position = element.style.position;

    if (!position || position != "relative") {
        element.style.position = "relative";
    };

    var scrollableContainer = new PerfectScrollbar(element);

    element.addEventListener('mouseover', function() {
        scrollableContainer.update();
    });

    scrollableContainer.update();

    element.firstChild.activeClass.scrollbar = scrollableContainer;

}.Description("");
