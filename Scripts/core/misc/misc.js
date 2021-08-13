(function(){

    function MiscellaneousFunctionLibrary() {
        throw "This class cannot be instantiated.";
    }
    MiscellaneousFunctionLibrary.Inherit(BaseObject, "MiscellaneousFunctionLibrary");

    MiscellaneousFunctionLibrary.regExpFromWildcards = function(wc,fullstring) {
        var c,patt = "";
        for (var i = 0; i < wc.length; i++) {
            c = wc.charAt(i);
            if (c == "*") {
                patt += ".*?";
            } else if (c == "?") {
                patt += ".";
            } else {
                patt += "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
            }
        }
        if (fullstring) {
            return new RegExp("^" + patt + "$");
        } else {
            return new RegExp(patt);
        }
    }

})();