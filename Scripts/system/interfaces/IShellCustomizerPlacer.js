(function() {
    function IShellCustomizerPlacer() {}
    IShellCustomizerPlacer.Interface("IShellCustomizerPlacer","IShellCustomizer");

    IShellCustomizerPlacer.prototype.placeWindow = function(wnd, options) { throw "not impl.";}
    IShellCustomizerPlacer.prototype.displaceWindow = function(wnd) { throw "not impl.";}
    
})();