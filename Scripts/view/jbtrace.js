// Client side tracing
(function ($) {
    $.fn.jbtracecolorrev = function (v) {
        if (!this.length) return null;
        if (v) {
            var c, bc = parseInt(v, 16);
            if (!isNaN(bc)) {
                c = ~bc;
            } else {
                bc = 0xFFFFFF;
                c = 0x000000;
            }
            this.css("background-color", "rgb(" + ((bc >> 16) & 0xFF) + "," + ((bc >> 8) & 0xFF) + "," + (bc & 0xFF) + ")");
            this.css("color", "rgb(" + ((c >> 16) & 0xFF) + "," + ((c >> 8) & 0xFF) + "," + (c & 0xFF) + ")");
        } else {
            return "FFFFFF";
        }
        return "FFFFFF";
    };
    // Set color by using #CCCBBB where the high 12 bits are the text color and the low 12 bits are the background color
    $.fn.jbtracecolor = function (v) {
        if (!this.length) return null;
        if (v) {
            var c, bc = BaseObject.is(v, "string") ? parseInt(v, 16) : v;
            if (!isNaN(bc) && bc != 0) {
                c = (bc >> 12) & 0xFFF;
                bc = bc & 0xFFF;
            } else {
                c = 0xFFF;
                bc = 0x000;
            }
            this.css("background-color", "rgb(" + (((bc >> 8) & 0xF) * 16) + "," + (((bc >> 4) & 0xF) * 16) + "," + ((bc & 0xF) * 16) + ")");
            this.css("color", "rgb(" + (((c >> 8) & 0xF) * 16) + "," + (((c >> 4) & 0xF) * 16) + "," + ((c & 0xF) * 16) + ")");
        } else {
            return "FFFFFF";
        }
        return "FFFFFF";
    };
})(jQuery);

function jbTrace(el) {
    ViewBase.apply(this, arguments);
    Messenger.Default.subscribe(JbTraceChanged, new Delegate(this, this.OnTraceChanged));
    jbTrace.log("new instance of a trace viewer has been launched.", "FFC000");
    this.cmdDelete = new Command(this, this.OnClear, { caption: "Clear", image: mapPath("img/delete_icon.png"), visible: true });
    this.commands.push(this.cmdDelete);
    //this.initialize();
    //this.updateTargets();
}
jbTrace.Inherit(ViewBase, "jbTrace");
jbTrace.Implement(IViewContainerEventsSink);
jbTrace.Implement(ITemplateRoot);
jbTrace.prototype.onViewSizeChanged = function (size) {
    var s = size;
};
jbTrace.entries = [];
jbTrace.$logWorkspaceNotification = function (obj) {
    if (BaseObject.is(obj, "WorkspaceNotificationMessage")) {
        jbTrace.log(((obj.from == null) ? "" : obj.from + "<br />") + (obj.content != null ? obj.content : "Unspecified error."), 0xFFF804);
    }
};
jbTrace.log = function (s, lt) {
    var m = { msg: s, msgtype: ((lt == null) ? 0xFFF000 : lt) };
    jbTrace.entries.push(m);
    if (jbTrace.entries.length > 100) {
        jbTrace.entries.splice(0, 1);
    }
    Messenger.Default.post(JbTraceChanged.Default, false);
};
jbTrace.logObject = function (s, obj, lt) {
    var msg = (s != null) ? "<b>" + s + "</b><br />" : "";
    var ctx = { c: 0, l: 3 };
    try {
        msg = msg + jbTrace.dumpObj(obj, ctx);
    } catch (e) {
        msg = "[error=" + e + "]<br />";
    }
    jbTrace.log(msg, lt);
};
jbTrace.dumpObj = function (obj, ctx) {
    if (ctx != null) {
        ctx.c++;
        if (ctx.c > ctx.l) return "";
    }
    var s = "<blockquote class=\"dbgident\">";
    if (typeof (obj) == "string") {
        s += "\"" + obj + "\"";
    } else {
        for (var i in obj) {
            if (typeof (obj[i]) != "function") {
                s += i + ": ";
                if (typeof (obj[i]) == "object") {
                    if (obj[i] == null) {
                        s += "null";
                    } else {
                        s += "{<br/>" + jbTrace.dumpObj(obj[i], ctx) + "<br />}";
                    }
                } else {
                    s += obj[i];
                }
                s += "<br/>";
            }
        }
    }
    s += "</blockquote>";
    if (ctx != null) {
        ctx.c--;
    }
    return s;
};
jbTrace.dumpObjString = function (obj) {
    var s = "";
    for (var i in obj) {
        if (typeof (obj[i]) != "function") {
            s += i + ": ";
            if (typeof (obj[i]) == "object") {
                s += "{\n" + jbTrace.dumpObjString(obj[i]) + "}";
            } else {
                s += obj[i];
            }
            s += "\n";
        }
    }
    return s;
};
jbTrace.prototype.init = function () {
    var req = new ChangeContainerStyleQuery();
    req.scrollable = false;
    this.throwStructuralQuery(req);
};
jbTrace.prototype.OnTraceChanged = function (obj) {
    this.updateTargets();
    this.throwStructuralQuery(new HostCallQuery(HostCallCommandEnum.activate));
    // var p = this.child("logview");
    var p = $(this.root);
    p.scrollTop(this.child("logview").height());
};
jbTrace.prototype.get_caption = function () {
    return "Trace (current workspace)";
};
jbTrace.prototype.onClose = function () {
    ViewBase.prototype.onClose.call(this);
    // Messenger.Default.unsubscribeAll(this);
    return true;
};
jbTrace.prototype.set_data = function (v) {
    Base.prototype.set_data.call(this, jbTrace.entries);
};
jbTrace.prototype.OnClear = function () {
    jbTrace.entries.splice(0, jbTrace.entries.length);
    this.updateTargets();
};
// Trace window
jbTrace.registerShellCommand("tracelog", null, function () {
	if (BaseObject.is(jbTrace.entries,"Array")) {
		var s = "";
		for (var i = 0; i < jbTrace.entries.length; i++) {
			s += i + ": " + jbTrace.entries[i].msg + "\n";
		}
		return s;
	}
    return "log is empty";
}, "Dumps the current tracelog.");

/*CLASS*/
// Note that this message has a singleton pattern of usage which saves memory.
function JbTraceChanged() { }
JbTraceChanged.Inherit(Message, "JbTraceChanged");
JbTraceChanged.Default = new JbTraceChanged();