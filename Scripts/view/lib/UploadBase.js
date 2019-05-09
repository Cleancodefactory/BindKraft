function UploadBase() {
    Base.apply(this, arguments);
}

UploadBase.Inherit(Base, "UploadBase");
UploadBase.Implement(IUIControl);
UploadBase.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraftstyles/control-uploadbase"));
UploadBase.$defaults = {
	templateName: "bindkraftstyles/control-uploadbase"
};

//Template physical items
UploadBase.ImplementProperty("filesfield", new Initialize("The file upload input field injected from the template", null));
UploadBase.ImplementProperty("submitbutton", new Initialize("Template's submit button", null));

//Common options
UploadBase.ImplementProperty("ismultiple", new InitializeBooleanParameter("Making available to upload multiple files.", false));
UploadBase.ImplementProperty("accept", new InitializeStringParameter("The types of files that the control will upload.", ""));
UploadBase.ImplementProperty("autosubmit", new InitializeBooleanParameter("Should the upload start immedietely after the file is selected", true));
UploadBase.ImplementProperty("maxsize", new InitializeNumericParameter("The max possible upload file size(in MB).", 20));

//Url properties
UploadBase.ImplementProperty("moduleName", new InitializeStringParameter("", ""));
UploadBase.ImplementProperty("url", new InitializeStringParameter("", ""));

//Events
UploadBase.prototype.uploadstarted = new InitializeEvent("Fires when the upload starts.");
UploadBase.prototype.uploadonprogress = new InitializeEvent("Fires constantly while the upload is uploading.");
UploadBase.prototype.uploadsuccess = new InitializeEvent("Fired every time when the upload is completed successfully.");
UploadBase.prototype.uploadfailed = new InitializeEvent("Fired every time when the upload is failed.");
UploadBase.prototype.onerror = new InitializeEvent("");


UploadBase.prototype.init = function () {
    if ($$(this.root).first().getChildren().length = 0) {
        $$(this.root).first().empty().append(this.get_template());
    }else{
        // $$(this.root).first().select("input['file']").first()
        //     .attributes("data-on-change", "{bind source=__control path=OnFilesSelected}")
        //     .attributes("data-on-pluginto", "{bind source=__control path=$filesfield}");

        // if ($$(this.root).first().select("input['button']").length > 0) {
        //     $$(this.root).first().select("input['button']").first()
        //     .attributes("data-on-click", "{bind source=__control path=SubmitFiles}");
        // }
    }
}

UploadBase.prototype.finalinit = function() {
    if (this.get_filesfield() == null || this.get_filesfield() == undefined) return;

    var filesField = $$(this.get_filesfield()).first();

    if(this.get_ismultiple()){
        filesField.attributes("multiple", "multiple");
    }

    if(this.get_accept()){
        filesField.attributes("accept", this.get_accept());
    }
}

UploadBase.prototype.$mappedUrl = function() {
    var url = IPlatformUrlMapper.mapModuleUrl(this.get_url(), this.get_moduleName());

    return url;
}

UploadBase.prototype.OnFilesSelected = function () {
    if(this.get_autosubmit()){
        this.SubmitFiles();
    }
}

UploadBase.prototype.SubmitFiles = function () {
    var files = this.get_filesfield().files;
    var formData = new FormData();

    for (var i = 0; i < files.length; i++){
        var currFile = files[i];
        if (this.get_maxsize() < currFile.size / 1000000) {
            this.onerror.invoke("The file " + currFile.name + " exceeds the size limit of " + this.$maxsize + "MB.");
            continue;
        }

        var simplifiedName = this.SimplifyFileName(currFile.name);
        var fileName = i + "file" + simplifiedName;
        formData.append(fileName, currFile);
    }

    this.SendRequest(formData);
}

UploadBase.prototype.SendRequest = function(formData){
    if(formData == null || formData == undefined) return;
    if(!this.get_filesfield().value) return;

    var request = new XMLHttpRequest();
    var self = this;
    //var uploadTarget = window.location.origin + this.$mappedUrl();
	var uploadTarget = mapPath(this.$mappedUrl());
    request.responseType = 'document';
    request.open("POST", uploadTarget, true);

    request.upload.onloadstart = function () {
        self.uploadstarted.invoke(this);
    }

    request.upload.onprogress = function(event){
        var progress = Math.ceil((event.loaded / event.total) * 100)
        self.uploadonprogress.invoke(this, progress);
    }

    request.onload = function() {
        if(request.status === 200){
            if (request.response.getElementsByTagName("data").length == 0) {
                self.uploadsuccess.invoke(self, request.response);
                return;
            }

            var data = JSON.parse(request.response.getElementsByTagName("data")[0].childNodes[0].data);
            self.uploadsuccess.invoke(self, data);
        }else{
            self.uploadfailed.invoke(self, request.response);
        }

        self.get_filesfield().value = "";
    };
    
    request.send(formData);
}

UploadBase.prototype.SimplifyFileName = function(fileName) {
    var regexPattern = /[1-9a-zA-Z]+/gi;
    var matchesArray = fileName.match(regexPattern);

    return matchesArray.join("");
}