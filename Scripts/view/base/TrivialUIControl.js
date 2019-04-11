


/*CLASS*/
function TrivialUIControl() {
    Base.apply(this, arguments);
}
TrivialUIControl.Description("A Base plus IUIControl for testing purposes.");
TrivialUIControl.Inherit(Base,"TrivialUIControl");
TrivialUIControl.Implement(IUIControl);
