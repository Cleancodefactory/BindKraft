


/// <reference path="~/Scripts/jquery-vsdoc.js"/>


function ReportError(message, url, lineNumber) {
    // HideProgressAfterAjax();
	alert("Error:" + message + "\n" + url + "\n" + lineNumber);// HideProgressAfterAjax();
}


window.onerror = function (msg, url, linenumber) {
	ReportError(msg,url,linenumber);
        //alert("Error:" + message + "\n" + url + "\n" + lineNumber);// HideProgressAfterAjax();
    return true;
};
// Usage IsNull(arg), IsNull("!all", arg, arg ...)
// If the first arg is a string and starts with "?" or "!" it is a command
//  ! - means check for null, ? - means check for null or empty, all - means all args must be null (or empty), one - means at least one must be null (or empty).
//  Default command (if omitted) is "!one". However, it is not recommended to call the function with more than one arguments to check without an explicit command.
function IsNull(el_or_cmd) {
    var st = 0, op = "one", subcmd = "!";
    if (arguments.length > 1 && typeof el_or_cmd == "string") {
        subcmd = el_or_cmd.charAt(0);
        if (subcmd == "!" || subcmd == "?") {
            op = el_or_cmd.slice(1);
            st = 1;
        } else {
            subcmd = "!";
        }
    }
    if (op == "one") {
        for (var i = st; i < arguments.length; i++) {
            if (arguments[i] == null || (subcmd == "?" && typeof arguments[i] == "string" && arguments[i].length == 0)) return true;
        }
        return false;
    } else if (op == "all") {
        for (var i = st; i < arguments.length; i++) {
            if (arguments[i] != null && (subcmd != "?" || (typeof arguments[i] == "string" && arguments[i].length == 0))) return false;
        }
        return true;
    }
    return null;
}

function GetViewportSize() {
    var viewportwidth;
    var viewportheight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = parseFloat(window.innerWidth);
        viewportheight = parseFloat(window.innerHeight);
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = parseFloat(document.documentElement.clientWidth);
        viewportheight = parseFloat(document.documentElement.clientHeight);
    }
    // older versions of IE
    else {
        viewportwidth = parseFloat(document.getElementsByTagName('body')[0].clientWidth);
        viewportheight = parseFloat(document.getElementsByTagName('body')[0].clientHeight);
    }
    return [viewportwidth, viewportheight];
}

//
var HideProgressAfterAjax_Counter = 0;
function HideProgressAfterAjax() {
    HideProgressAfterAjax_Counter--;
    if (HideProgressAfterAjax_Counter <= 0) {
        $('#loading').hide();
        $('#loading_cover').hide();
        HideProgressAfterAjax_Counter = 0;
    }
	$('#loading_count').text("" + HideProgressAfterAjax_Counter);
    $('#loading').elementtitle("Requests in progress: " + HideProgressAfterAjax_Counter);
}

function ShowProgressBeforeAjax() {
    if (HideProgressAfterAjax_Counter <= 0) HideProgressAfterAjax_Counter = 0;
    HideProgressAfterAjax_Counter++;
    $('#loading').show();
    $('#loading_cover').show();
	$('#loading_count').text("" + HideProgressAfterAjax_Counter);
    $('#loading').elementtitle("Requests in progress: " + HideProgressAfterAjax_Counter);
}

//GUID//
function Guid(options) {
    this.options = options || {};
    this.chars = this.options.chars || Guid.constants.alphanumerics;
    this.epoch = this.options.epoch || Guid.constants.epoch1970;
    this.counterSequenceLength = this.options.counterSequenceLength || 1;
    this.randomSequenceLength = this.options.randomSequenceLength || 2;
}

Guid.prototype.generate = function () {
    var now = (new Date()).getTime() - this.epoch;
    var guid = this.baseN(now);

    this.counterSeq = (now == this.lastTimestampUsed ? this.counterSeq + 1 : 1);
    guid += this.counterSeq;

    for (var i = 0; i < this.randomSequenceLength; i++) {
        guid += this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    this.lastTimestampUsed = now;

    return guid;
};
Guid.prototype.baseN = function (val) {
    if (val == 0) return "";
    var rightMost = val % this.chars.length;
    var rightMostChar = this.chars[rightMost];
    var remaining = Math.floor(val / this.chars.length);
    return this.baseN(remaining) + rightMostChar;
};
Guid.constants = {};
Guid.constants.alphanumerics = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
Guid.constants.epoch1970 = (new Date(0));
Guid.constants.epoch = function (year) { return (new Date("Jan 1 " + year)).getTime(); };
//End GUID//

function LoadScriptRunTime(filename) {
    if (filename == null || filename.length == 0) return false;
    var sid = filename.replace(/\/|\.|\\/, "_");
    var script = document.getElementById(sid);
    if (script != null) return true;
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = mapPath("/Scripts/" + filename) + "?" + g_SessionScriptGuid;
    script.id = sid;
    document.body.appendChild(script);
    return true;
}


function disableSelection(target) {
    if (IsNull(target)) {
        target = document.body;
    }
    if (typeof target.onselectstart != "undefined") //IE route
        target.onselectstart = function () { return false; };
    else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
        target.style.MozUserSelect = "none";
    else //All other route (ie: Opera)
        target.onmousedown = function () { return false; };
    target.style.cursor = "default";
}

function enableSelection(target) {
    if (IsNull(target)) {
        target = document.body;
    }
    if (typeof target.onselectstart != "undefined") //IE route
        target.onselectstart = function () { return true; };
    else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
        target.style.MozUserSelect = "all";
    else //All other route (ie: Opera)
        target.onmousedown = function () { return true; };
    target.style.cursor = "default";
}


// Callback function to sort objects
// sortBy("name") - sort descending a-z
// sortBy("-name") - sort ascending z-a

function sortBy(prop) {
    var sortOrder = 1;
    if (prop[0] === "-") {
        sortOrder = -1;
        prop = prop.substr(1, prop.length - 1);
    }
    return function (a, b) {
        var x = a[prop].toLowerCase(), y = b[prop].toLowerCase();
        var result = (x < y) ? -1 : (x > y) ? 1 : 0;
        return result * sortOrder;
    }
}

// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function (window, document) {

    var prefix = "", _addEventListener, onwheel, support;

    // detect event model
    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
              "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function (elem, callback, useCapture) {
        _addWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support == "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    };

    function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function (originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function () {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support == "mousewheel") {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }

})(window, document);