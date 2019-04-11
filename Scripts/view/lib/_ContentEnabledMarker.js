


function ContentEnabledMarker() {
    Base.apply(this, arguments);
    // ContentEnabledMarker.initProtocols(this);
}

ContentEnabledMarker.Inherit(Base, "ContentEnabledMarker");
ContentEnabledMarker.Implement(IStylerContentAvailability);