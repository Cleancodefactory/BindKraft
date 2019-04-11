function DockerWindow() {
	BaseWindow.apply(this, arguments);
}
DockerWindow.Inherit(BaseWindow, "DockerWindow");
DockerWindow.Defaults({
	templateName: new StringConnector("<div class=\"f_windowframe\" data-key=\"_window\" style=\"position: absolute;\" data-wintype=\"Docker window\"></div>")
});