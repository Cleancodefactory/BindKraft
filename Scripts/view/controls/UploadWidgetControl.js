


// Upload control
function UploadWidgetControl() {
	Base.apply(this, arguments);
}
UploadWidgetControl.Inherit(Base, "UploadWidgetControl");
UploadWidgetControl.Implement(IUIControl);
UploadWidgetControl.Implement(InterfaceImplementer("IAmbientDefaultsConsumerImpl"));
UploadWidgetControl.ImplementIndexedProperty("parameters", new InitializeObject("Parameters to send to the server along with the file"));
UploadWidgetControl.ImplementProperty("block", new InitializeBooleanParameter("Blocks the uploads if set to true", false));
UploadWidgetControl.ImplementProperty("scale", new InitializeNumericParameter("Scale of progress", 100));
UploadWidgetControl.ImplementProperty("url", new InitializeStringParameter("App rooted URL to upload to","/apps/uimg.asp"));
UploadWidgetControl.ImplementProperty("permitsubmit", new Initialize("Callback that must return true if the submit process should continue.",null));
UploadWidgetControl.ImplementActiveProperty("progress", new InitializeNumericParameter("Individual progress",0));
UploadWidgetControl.ImplementActiveProperty("progressall", new InitializeNumericParameter("Overall progress",0));
UploadWidgetControl.ImplementActiveProperty("result", new InitializeObject("Result from server",null));
UploadWidgetControl.ImplementActiveProperty("statustext", new InitializeObject("Result from server",null));
UploadWidgetControl.ImplementActiveProperty("autoupload", new InitializeBooleanParameter("Auto uploading after file selection.",true));
UploadWidgetControl.ImplementProperty("templateName", new InitializeStringParameter("The id of the control template. Null denotes the standard built-in templates.", null));

UploadWidgetControl.ImplementActiveProperty("success", new InitializeObject("Last operation was successful",null));
UploadWidgetControl.ImplementActiveProperty("failure", new InitializeObject("Last operation was a failure",null));

UploadWidgetControl.prototype.doneevent = new InitializeEvent("Fired when finished successfully");
UploadWidgetControl.prototype.failevent = new InitializeEvent("Fired when finished unsuccessfully");
UploadWidgetControl.prototype.completeevent = new InitializeEvent("Fired when finished no matter how");
UploadWidgetControl.prototype.submitevent = new InitializeEvent("Fired before file is submitted");
UploadWidgetControl.prototype.sendevent = new InitializeEvent("Fired when file is submitted");
UploadWidgetControl.prototype.progressevent = new InitializeEvent("Fired on individual progress");
UploadWidgetControl.prototype.progressallevent = new InitializeEvent("Fired on overall progress");
UploadWidgetControl.prototype.dragevent = new InitializeEvent("Fired on drag over");
UploadWidgetControl.prototype.dropevent = new InitializeEvent("Fired on drag over");
UploadWidgetControl.prototype.dragoffevent = new InitializeEvent("Fired on drag leaving or cancelled");
UploadWidgetControl.prototype.fileselectedevent = new InitializeEvent("Fired when the user selects a file for upload no matter if autoupload is set or not.");
UploadWidgetControl.prototype.clearedevent = new InitializeEvent("Fired when the selection is cleared.");
UploadWidgetControl.prototype.$fileinput = null;

UploadWidgetControl.prototype.$init = function() {
	var container = $('<div style="width: 100%; height: 100%; position: relative; cursor: pointer; border: none; display: inline-block; vertical-align: middle; overflow: hidden;"></div>'),
		inputFile = $('<input type="file" name="file" data-key="file" style="z-index: 1000; position: absolute; width: 100%; height: 100%; top: 0; left: 0; margin: 0; padding: 0; cursor: pointer; -ms-opacity: 0.01; opacity: 0.01; -webkit-filter: alpha(opacity=1);-moz-filter: alpha(opacity=1); -o-filter: alpha(opacity=1); filter: alpha(opacity=1);"/>'),
		el = $(this.root),
		template = null;

	if (el.children().length > 0) {
		template = el.children().clone();
	} else {
		if (this.get_templateName() != null) {
			template = $(this.get_templateName()).children().clone();
		} else {
			template = $(".j_framework_control_file_upload").children().clone();
		}
	}
	
	el.Empty();

	el.append(container);
	container.append(template);
	container.append(inputFile);
	
	this.$fileinput = this.child("file");
	
	Base.prototype.$init.apply(this,arguments);
};
UploadWidgetControl.prototype.init = function() {
	var self = this;
	
	this.child("file").fileupload({
		url: mapPath(this.get_url()), // mapPath("/apps/uimg.asp"),
		dataType: "json",
		sequentialUploads: true,
		dropZone: $(this.root),
		pasteZone: $(this.root),
		singleFileUploads: true,
		progressInterval: 500,
		forceIframeTransport: true,
		done: Delegate.createWrapper(this, this.onSuccess),
		fail: Delegate.createWrapper(this, this.onFail),
		submit: Delegate.createWrapper(this, this.onSubmit),
		always: Delegate.createWrapper(this, this.onComplete), 
		send: Delegate.createWrapper(this, this.onSend), 
		progress: function(e, data) {
			self.set_progress(parseInt(data.loaded / data.total * self.get_scale(), 10));
			self.progressevent.invoke(this, data);
		},
		progressall: function(e, data) {
			self.set_progressall(parseInt(data.loaded / data.total * self.get_scale(), 10));
			self.progressallevent.invoke(this, data);
		},
		add: Delegate.createWrapper(this, this.onAdd),
		dragover: Delegate.createWrapper(this, this.onDrag),
		drop: Delegate.createWrapper(this, this.onDrop)
	}).bind("drageleave", Delegate.createWrapper(this, this.onDragOff));
	this.set_success(false);
	this.set_failure(false);
};
UploadWidgetControl.prototype.Upload = function() {
	if (this.$lastJQUData != null && typeof this.$lastJQUData.submit == "function") {
		this.$lastJQUData.submit();
	} else {
		jbTrace.log("No upload data prepared");
	}
};
UploadWidgetControl.prototype.$lastJQUData = null;
UploadWidgetControl.prototype.get_selectedfile = function() {
	return BaseObject.getProperty(this.$lastJQUData, "files.0.name", null);
};
UploadWidgetControl.prototype.onAdd = function(e, data) {
	data.url = mapPath(this.get_url());		// Override the url.
	this.$lastJQUData = data;
	this.updateTargets();
	this.fileselectedevent.invoke(this, data);
	if (this.get_autoupload()) {
		data.submit();
	}
};
UploadWidgetControl.prototype.Clear = function() {
	this.set_progress(0);
	this.set_progressall(0);
	this.set_result(null);
	this.set_statustext(null);
	this.set_success(false);
	this.set_failure(false);
	this.$lastJQUData = null;
	this.clearedevent.invoke(this, null);
	this.updateTargets();
};
UploadWidgetControl.prototype.onDragOff = function(e, data) {
	this.dragoffevent.invoke(this, data);
};
UploadWidgetControl.prototype.onDrag = function(e, data) {
	this.dragevent.invoke(this, data);
	e.preventDefault();
};
UploadWidgetControl.prototype.onDrop = function(e, data) {
	this.dropevent.invoke(this, data);
};
UploadWidgetControl.prototype.onSuccess = function(e, data) {
	this.set_result(data.result);
	this.set_statustext(null);
	this.set_success(true);
	this.set_failure(false);
	this.doneevent.invoke(this, data);
};
UploadWidgetControl.prototype.onFail = function(e, data) {
	this.set_result(null);
	this.set_statustext(data.textStatus);
	this.set_success(false);
	this.set_failure(true);
	this.failevent.invoke(this, data);
};

UploadWidgetControl.prototype.onComplete = function(e, data) {
	this.completeevent.invoke(this, data);
	this.updateTargets();
};
UploadWidgetControl.prototype.onSend = function(e, data) {
	this.sendevent.invoke(this, data);
};
UploadWidgetControl.prototype.onSubmit = function(e, data) {
	if (BaseObject.isCallback(this.get_permitsubmit())) {
		if (BaseObject.callCallback(this.get_permitsubmit(), this) === false) {
			return false;
		}
	}
	
	this.Clear();
	// Attach the form data
	this.submitevent.invoke(this, data);
	if (this.get_block()) return false;
	if (this.$parameters != null && typeof this.$parameters == "object") {
		var p = [];
		for (var k in this.$parameters) {
			p.push({ name: k, value: this.$parameters[k]});
		}
		if (p.length > 0) {
			data.formData = p;
		}
	}
};