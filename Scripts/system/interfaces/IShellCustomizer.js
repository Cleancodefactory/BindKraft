(function() {
    function IShellCustomizer() {}
    IShellCustomizer.Interface("IShellCustomizer");

    IShellCustomizer.prototype.initialize = function() { throw "not impl"; }
    IShellCustomizer.prototype.get_shell = function() { throw "not impl";}
    IShellCustomizer.prototype.set_shell = function(v) { throw "not impl";}
    IShellCustomizer.prototype.get_workspacewindow = function() { throw "not impl";}    
    IShellCustomizer.prototype.set_workspacewindow = function(v) { throw "not impl";}    

    
})();