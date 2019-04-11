//Possible Extend: 
//1. There could be an option for initial remove the style tag from the svg if such is contained

function SvgY() {
    Base.apply(this, arguments);
}

SvgY.Inherit(Base, "SvgY");

SvgY.Implement(IUIControl);
SvgY.Implement(ICustomParameterizationStdImpl, "svgpath", "usedefault", "width",  "height");
SvgY.Implement(IPlatformUrlMapperImpl);

SvgY.ImplementProperty("svgpath", new InitializeStringParameter("The path of the Svg image", ""), null, "LoadSvg");
SvgY.ImplementProperty("usedefault", new InitializeBooleanParameter("Should the control use default svg if the main one is not found", true));
SvgY.ImplementProperty("width", new InitializeStringParameter("Input for init width of the svg", undefined));
SvgY.ImplementProperty("height", new InitializeStringParameter("Input for init height of the svg", undefined));

SvgY.prototype.finalinit = function() {
    this.LoadSvg()
}

SvgY.prototype.RequestSvg = function (){
    var svgPath = this.get_svgpath();

    if(!svgPath){
        var useDefault = this.get_usedefault();

        if((typeof useDefault == 'boolean' && useDefault === true) || (typeof useDefault == 'string' && useDefault === 'true')) {
            var defaultSvg = $$(SvgY.svgStorage["defaultIcon"]).first().clone().getNative();
            $$(this.root).first().empty().append(defaultSvg);
        }

        return;
    }

    var svgSource;
    var self = this;

    svgPath = mapPath(this.mapResourceUrl(svgPath));

    var xhr = new XMLHttpRequest();

    xhr.open('GET', svgPath, true);
    xhr.onload = function(response){
        var svg = response.currentTarget.responseXML;
        
        if(svg == null){
            self.MountSvg("");
            return;
        }

        if($$(svg).first().getNative().tagName && 
            $$(svg).first().getNative().tagName.toLowerCase() === "svg"){
            svgSource = svg;
        }else if($$(svg.documentElement).first().getNative().tagName
            && $$(svg.documentElement).first().getNative().tagName.toLowerCase() === "svg"){
            svgSource = svg.documentElement;
        }

        self.MountSvg(svgSource);
    };

    xhr.send();
}

SvgY.prototype.MountSvg = function(svgSource){
    if(!svgSource || !(svgSource.tagName && svgSource.tagName.toLowerCase() === 'svg')){
        svgSource = $$(SvgY.svgStorage["defaultIcon"]).first().getNative();
    }

    var currentNode = $$(this.root).first();
    currentNode.empty();
    currentNode.append(svgSource);
    this.SetInitSize();

    SvgY.svgStorage[this.get_svgpath()] = svgSource;
}

SvgY.prototype.LoadSvg = function(){
    if(SvgY.svgStorage.hasOwnProperty(this.get_svgpath())){
        var currElement = $$(this.root).first();
        var storedSvg = $$(SvgY.svgStorage[this.get_svgpath()]).first().clone();
        
        if(this.get_width()) storedSvg.attributes("width", this.get_width());
        if(this.get_height()) storedSvg.attributes("height", this.get_height());

        currElement.empty();
        currElement.append(storedSvg.getNative());

        return;
    }

    this.RequestSvg();
}

SvgY.prototype.SetInitSize = function(){
    var currSvg = $$(this.root).first().select('svg').first();

    if(this.get_width()){
        currSvg.attributes("width", this.get_width());
    }

    if(this.get_height()){
        currSvg.attributes("height", this.get_height());
    }
}

//This static property is used to share all the loaded svg images through the all instances SvgY with purpose of caching
//In this way we won't need to load already put saved in the storage svg image
SvgY.svgStorage = {};
SvgY.svgStorage["defaultIcon"] = '<?xml version="1.0" encoding="utf-8"?>' +
'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0px" y="0px"' +
'viewBox="0 0 20 24" style="enable-background:new 0 0 20 24;" xml:space="preserve">' +
'<ellipse transform="matrix(0.708 -0.7062 0.7062 0.708 -0.3648 13.3378)"  cx="15.9" cy="7.1" rx="1.1" ry="1.1"/>' +
'<path  d="M18.5,0H1.5C0.7,0,0,0.7,0,1.5v20.9C0,23.3,0.7,24,1.5,24h16.9c0.8,0,1.5-0.7,1.5-1.5V1.5C20,0.7,19.3,0,18.5,0' +
'z M5.4,6.7c0-0.8,0.4-1.4,1.2-1.9c0.4-0.2,0.8-0.4,1.3-0.5c0.5-0.1,1-0.2,1.5-0.2h0.3v1.2c-0.2,0-0.3,0.1-0.4,0.1' +
'C9.1,5.5,9.1,5.6,9.1,5.7c0,0.1,0,0.2,0.1,0.3l0.1,0.3c0.1,0.2,0.1,0.3,0.1,0.5c0,0.5-0.2,0.9-0.6,1.3S7.9,8.7,7.4,8.7' +
'c-0.6,0-1-0.2-1.4-0.6S5.4,7.3,5.4,6.7z M10.3,19.3c-0.4,0.4-0.9,0.6-1.5,0.6c-0.6,0-1.1-0.2-1.5-0.6c-0.4-0.4-0.6-0.9-0.6-1.5' +
'c0-0.6,0.2-1.1,0.6-1.5c0.4-0.4,0.9-0.6,1.5-0.6c0.6,0,1.1,0.2,1.5,0.6c0.4,0.4,0.6,0.9,0.6,1.5C10.9,18.3,10.7,18.9,10.3,19.3z' +
'M14.3,10.2c-0.2,0.5-0.5,1-0.9,1.4c-0.4,0.5-0.9,0.9-1.6,1.2c-0.6,0.3-1.3,0.5-2.1,0.6c-0.3,0-0.6,0.1-0.7,0.2' +
'C9.1,13.7,9,13.9,9,14.2c0,0.2,0,0.4-0.1,0.5c-0.1,0.1-0.2,0.2-0.4,0.2c-0.4,0-0.6-0.2-0.6-0.7v-3.9c0-0.2,0-0.3,0-0.3' +
'c0,0,0.1-0.1,0.1-0.1c0.1-0.1,0.3-0.1,0.6-0.1c0.7,0,1.3-0.2,1.8-0.7c0.6-0.5,0.8-1.2,0.8-2c0-0.4-0.1-0.7-0.2-1s-0.3-0.5-0.5-0.7' +
'V4.1c0.7,0.1,1.3,0.3,1.8,0.6c0.7,0.4,1.3,1,1.7,1.7c0.4,0.7,0.6,1.4,0.6,2.2C14.6,9.1,14.5,9.7,14.3,10.2z"/>' +
'</svg>';