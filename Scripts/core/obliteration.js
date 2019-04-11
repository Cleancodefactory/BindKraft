

/*
    File: obliteration.js
    Contains obliteration related global and DOM attahed methods. Needs serious refactoring and probably needs to be split and moved elsewhere

*/
//// DOM obliteration ///////////////////////////////////

JBUtil.domrefproperties = "";
JBUtil.$obliterateDom = function (dom) { // obliterate single DOM element
    var el = $(dom);
    if (el.length > 0) {
        el = el.get(0);
    } else {
        el = null;
    }
    if (el != null) {
        var arr = JBUtil.domrefproperties.split(",");
        for (var i = 0; i < arr.length; i++) {
            BaseObject.obliterate(el[arr[i].trim()]);
        }
        if (JBUtil.domdestructors != null) {
            for (var k in JBUtil.domdestructors) {
                if (typeof JBUtil.domdestructors[k] == "function") {
                    JBUtil.domdestructors[k](el);
                }
            }
        }
    }
};
JBUtil.obliterateDom = function (dom, bAndSelf) { // Obliterate recursively
    $(dom).children().each(function () {
        JBUtil.obliterateDom(this, true);
    });
    if (bAndSelf) JBUtil.$obliterateDom(dom);
};

// Call this to register the DOM properties in which a reference to obliterable objects are saved (even potentially) by your class
//  Pass a string containing comma separated list of property names or a function(domEl) that will do the work.
Function.prototype.registerDOMDestructor = function (proc) {
    if (proc != null) {
        if (BaseObject.is(proc, "string")) {
            if (JBUtil.domrefproperties.length > 0) JBUtil.domrefproperties += ",";
            JBUtil.domrefproperties += proc;
        } else if (typeof proc == "function") {
            if (JBUtil.domdestructors == null) JBUtil.domdestructors = {};
            JBUtil.domdestructors[Class.fullClassType(this)] = proc;
        }
    } else {
        throw "registerDOMDestructor must be called with a valid function as parameter";
    }
}.Description("register the DOM properties in which a reference to obliterable objects are saved (even potentially) by your class")
 .Param("proc","...");