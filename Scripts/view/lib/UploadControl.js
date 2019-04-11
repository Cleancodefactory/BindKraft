//TODOs
//1. Make possible to upload from different sources apart from my computer (dropbox, google drive..., etc.)
//2. Active property for the progress bar

function UploadControl() {
    Base.apply(this, arguments);
}

UploadControl.Inherit(Base, "UploadControl");

UploadControl.Implement(IUIControl);
UploadControl.Implement(IParameters);

UploadControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-uploadsimple"));
UploadControl.$defaults = {
	templateName: "bindkraft/control-uploadsimple"
};

//For Info Template
// UploadControl.ImplementProperty("isinfotemplate", new InitializeBooleanParameter("The types of files that the control will upload.", false));
UploadControl.ImplementProperty("infosection", new Initialize("The metainfo form that holds the metainfo for each file.", null));
UploadControl.ImplementProperty("infoitemtemplate", new Initialize("The metainfo item template.", null));
UploadControl.ImplementProperty("filesfield", new Initialize("The file upload input field injected from the template", null));
UploadControl.ImplementProperty("inputtext", new Initialize("Template's input button text description.", null));
UploadControl.ImplementProperty("submitbutton", new Initialize("Template's submit button", null));
UploadControl.ImplementIndexedProperty("filesinfo", new Initialize("Additional information to come with the upload file(s).", null));
UploadControl.ImplementIndexedProperty("parameters", new InitializeStringParameter("params.", ""));

//TODO
//For Form Template
UploadControl.ImplementProperty("templateForm", new InitializeStringParameter("This holds the form of the template", null));

//Common options
UploadControl.ImplementProperty("ismultiple", new InitializeBooleanParameter("Making available to upload multiple files.", false));
UploadControl.ImplementProperty("accept", new InitializeStringParameter("The types of files that the control will upload.", ""));
UploadControl.ImplementProperty("autostart", new InitializeBooleanParameter("Should the upload start immedietely after the file is selected", false));
UploadControl.ImplementProperty("autosubmitshow", new InitializeBooleanParameter("Should the upload submit button show only when files are selected", true));

//Url properties
UploadControl.ImplementProperty("moduleName", new InitializeStringParameter("", ""));
UploadControl.ImplementProperty("url", new InitializeStringParameter("", ""));

UploadControl.ImplementActiveProperty("uploadProgress", new InitializeNumericParameter("This prop is to be used in a progress bar to provide the upload progress.", 0));
UploadControl.ImplementActiveProperty("progressbar", new InitializeParameter("The progress bar of the current template", null));

// UploadControl.ImplementProperty("data", new Initialize("", null));


UploadControl.prototype.uploadfinished = new InitializeEvent("Fired every time when the upload is completed successfully.");
UploadControl.prototype.uploadfailed = new InitializeEvent("Fired every time when the upload is failed.");

UploadControl.prototype.set_filesinfo = function(key, value) {
    if(!this.$filesinfo) this.$filesinfo = {};
    if(!key) return;

    this.$filesinfo[key] = value;
}

UploadControl.prototype.get_filesinfo = function(key) {
    if(!key) return this.$filesinfo;

    return this.$filesinfo[key];
}

UploadControl.prototype.init = function () {
    $$(this.root).first().empty().append(this.get_template());
}

UploadControl.prototype.finalinit = function() {
    var filesField = $$(this.get_filesfield()).first();

    if(this.get_ismultiple()){
        filesField.attributes("multiple", "multiple");
    }

    if(this.get_autosubmitshow() && this.get_submitbutton()){
        $$(this.get_submitbutton()).first().hide();
    }

    if(this.get_inputtext()){
        $$(this.get_inputtext()).first().text(this.get_ismultiple() ? "Choose files..." : "Choose a file");
    }

    if(this.get_accept()){
        filesField.attributes("accept", this.get_accept());
    }

    if(this.get_infosection()){
        this.set_infoitemtemplate($$(this.get_template()).first().select("#itemTemplate").first().removeAttributes("id").clone());
        $$(this.get_infosection()).first().empty().attributes("display", "none");
    }

    if(this.get_progressbar()){
        $$(this.get_progressbar().root).first().hide();
    }
}

UploadControl.prototype.$mappedUrl = function() {
    var url = IPlatformUrlMapper.mapModuleUrl(this.get_url(), this.get_moduleName());

    return url;
}

//ToDo: review
UploadControl.prototype.OnFilesSelected = function () {
    //Functionality related
    if(this.get_autostart()){
        if(this.get_infosection()){
            this.LoadItemsInfoTemplate();
            this.SubmitFilesWithInfo();
        }else{
            this.SubmitForm();
        }
    }

    //Visual Related
    if(this.get_infosection()){
        this.LoadItemsInfoTemplate();
    }

    if(this.get_autosubmitshow() && this.get_submitbutton()){
        $$(this.get_submitbutton()).first().show();
    }

    if(this.get_progressbar()){
        $$(this.get_progressbar().root).first().hide();
    }
}

/**
 * Forms the request and send it.
 * @param {*} formData Data which will be sended with this request
 */
UploadControl.prototype.SendRequest = function(formData){
    if(!formData) return;
    if(!this.get_filesfield().value) return;

    if(this.get_progressbar()){
        $$(this.get_progressbar().root).first().show();
    }

    this.ResetForm();

    var request = new XMLHttpRequest();
    var self = this;
    //var uploadTarget = window.location.origin + this.$mappedUrl();
	var uploadTarget = mapPath(this.$mappedUrl());
    request.responseType = 'document';
    request.open("POST", uploadTarget, true);

    request.upload.onprogress = function(event){
        self.onProgress(event);
    }

    request.onload = function() {
        if(request.status === 200){
            var data = JSON.parse(request.response.getElementsByTagName("data")[0].childNodes[0].data);

            self.uploadfinished.invoke(self, data);
        }else{
            self.uploadfailed.invoke(self, request.response);
        }
    };

    // temporary test
    if(this.get_data()){
        function parseData(obj, parentKey) {
            for (var key in obj) {
                var uniqueKey = parentKey === null ? key : parentKey + '.' + key; 
                var currentValue = obj[key];
    
                if (typeof currentValue === "number" || 
                    typeof currentValue === "string" || 
                    typeof currentValue === "boolean") {
                    formData.append(uniqueKey, currentValue);
                } else if (typeof currentValue === "object" && !Array.isArray(currentValue)) {
                    parseData(currentValue, uniqueKey);
                }
            }
        }
        
        var data = this.get_data();
        parseData(data, null);
        
        //formData.append("data", this.get_data());
		//formData.append("upload.state", "1");
    }
    // end temporary test
    
    request.send(formData);
}

/**
 * When the form is templated itself - This submit is to be used when the template is a form
 */
UploadControl.prototype.SubmitForm = function(){
    var currForm = this.get_templateForm();
    var formData = new FormData(currForm);

    return this.SendRequest(formData);
}

/**
 * Filesinfo Template - Creates parameter template for every choosen file
 */
UploadControl.prototype.LoadItemsInfoTemplate = function(){
    var files = this.get_filesfield().files;
    var itemTemplateSource = $$(this.get_infoitemtemplate()).first().clone();
    $$(this.get_infosection()).first().empty();

    for (var i = 0; i < files.length; i++){
        var currFile = files[i];
        var itemTemplate = itemTemplateSource.clone();
        var simplifiedName = this.SimplifyFileName(currFile.name);

        //$$(itemTemplate).first().select("#templateInput").first().getNative().files = [currFile];
        $$(itemTemplate).first().select("#templateFileName").first().text(currFile.name);
        $$(itemTemplate).first().select("#templateFileName").first().removeAttributes("id");
        $$(itemTemplate).first().select("#templateInfo").first().id(i + "file" + simplifiedName);

        this.set_filesinfo(i + "file" + simplifiedName, "");

        $$(this.get_infosection()).first().append(itemTemplate);
    }
}

UploadControl.prototype.GetInfoFieldsValues = function(){
    var files = this.get_filesfield().files;

    for (var i = 0; i < files.length; i++){
        var currFile = files[i];
        var simplifiedName = this.SimplifyFileName(currFile.name);

        var fileKey = i + "file" + simplifiedName;
        var fileMetaInfo = $$(this.get_infosection()).first().select("#" + fileKey).first().getNative().value;
        var valueObj = {"metainfo" : fileMetaInfo}

        this.set_filesinfo(fileKey, valueObj);
    }
}

UploadControl.prototype.SimplifyFileName = function(fileName) {
    var regexPattern = /[1-9a-zA-Z]+/gi;
    var matches_array = fileName.match(regexPattern);

    return matches_array.join("");
}

UploadControl.prototype.SubmitFilesWithInfo = function () {
    this.GetInfoFieldsValues()
    var files = this.get_filesfield().files;
    var formData = new FormData();

    for (var i = 0; i < files.length; i++){
        var currFile = files[i];
        var simplifiedName = this.SimplifyFileName(currFile.name);
        var fileKey = i + "file" + simplifiedName;
        var info = this.get_filesinfo()[fileKey].metainfo;
        formData.append(info, currFile);
    }

    this.SendRequest(formData);
}

/**
 * Visual representation of progress of the uploading file
 * @param {*} event onProgress event
 */
UploadControl.prototype.onProgress = function(event){
    this.set_uploadProgress(Math.ceil((event.loaded / event.total) * 100));
    this.updateTargets();
    this.updateSources();
}

UploadControl.prototype.ResetForm = function(){
    if(this.get_infosection()){
        $$(this.get_infosection()).first().empty();
    }
    
    if(this.get_autosubmitshow() && this.get_submitbutton()){
        $$(this.get_submitbutton()).first().hide();
    }
    
    this.set_filesinfo();
    this.get_filesfield().value = "";
}