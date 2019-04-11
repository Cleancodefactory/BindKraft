// Formaters/converters used by binding expressions



// Converts nulls to empty strings
function NullTextFormatter() { }
NullTextFormatter.Inherit(BaseObject, "NullTextFormatter");
NullTextFormatter.ToTarget = function (v) {
    if (v == null) return "";
    return v;
};
NullTextFormatter.FromTarget = function (v) {
    return v;
};

/* Force null to the server if the value is empty (well empty string for now, more later)
-------------------------------------------------------------*/
function EmptyToNullFormatter() { }
EmptyToNullFormatter.Inherit(BaseObject, "EmptyToNullFormatter");
EmptyToNullFormatter.ToTarget = function (v) {
    if (v == null) return "";
    return v;
};
EmptyToNullFormatter.FromTarget = function (v) {
    if (typeof v == "string") {
        if (v.length == 0 || v.trim().length == 0) return null;
    } else if (typeof v == "number") {
        if (v == 0) return null;
    }
    return v;
};

/* To Uppercase
-------------------------------------------------------------*/
function TestFormatter() { }
TestFormatter.Inherit(BaseObject, "TestFormatter");
TestFormatter.ToTarget = function (v) {
    if (BaseObject.is(v, "string")) return v.toUpperCase();
    return v;
};
TestFormatter.FromTarget = function (v) {
    if (BaseObject.is(v, "string")) return v.toLowerCase();
    return v;
};
/* For Checkbox
-------------------------------------------------------------*/

function CheckedFormatter() { }
CheckedFormatter.Inherit(BaseObject, "CheckedFormatter");
CheckedFormatter.ToTarget = function (v) {
    return (v) ? true : false;
};
CheckedFormatter.FromTarget = function (v) {
    return v;
};

/* Boolean Format
-------------------------------------------------------------*/
function NotNullBooleanFormatter() { }
NotNullBooleanFormatter.Inherit(BaseObject, "NotNullBooleanFormatter");
NotNullBooleanFormatter.ToTarget = function (v) {
    return v != null;
};
NotNullBooleanFormatter.FromTarget = function (v) {
    return v;
};

/* Boolean Format
-------------------------------------------------------------*/
function BooleanFormatter() { }
BooleanFormatter.Inherit(BaseObject, "BooleanFormatter");
BooleanFormatter.reTrue = /true|yes|on/i;
BooleanFormatter.ToTarget = function (v) {
    if (v == null) return false;
    switch (BaseObject.typeOf(v)) {
        case "string":
            if (v.length == 0) return false;
            if (v.match(BooleanFormatter.reTrue)) return true;
            break;
        default:
            return (v) ? true : false;
    }
    return false;
};
BooleanFormatter.FromTarget = function (v) {
    return v;
};
/* Boolean as int - guarantees the value travels as int
-------------------------------------------------------------*/
function IntBooleanFormatter() { }
IntBooleanFormatter.Inherit(BaseObject, "IntBooleanFormatter");
IntBooleanFormatter.reTrue = /true|yes|on|true/i;
IntBooleanFormatter.ToTarget = function (v) {
    if (v == null) return false;
    switch (BaseObject.typeOf(v)) {
        case "string":
            if (v.length == 0) return false;
            if (v.match(BooleanFormatter.reTrue)) return true;
            var x = parseInt(v);
            if (!isNaN(x) && x != 0) return true;
            break;
        default:
            return (v) ? true : false;
    }
    return false;
};
IntBooleanFormatter.FromTarget = function (v, binding) {
    var bp = BaseObject.getProperty(binding, "bindingParameter", null);
    if (bp != null && bp.indexOf("as string") >= 0) {
        if (bp != null && bp.indexOf("false is null") >= 0) {
            return ((v) ? "1" : null);
        } else {
            return ((v) ? "1" : "0");
        }
    } else {
        if (bp != null && bp.indexOf("false is null") >= 0) {
            return ((v) ? 1 : null);
        } else {
            return ((v) ? 1 : 0);
        }
    }
};

/* Vidual Boolean Format
-------------------------------------------------------------*/
function VisualBooleanFormatter() { }
VisualBooleanFormatter.Inherit(BaseObject, "VisualBooleanFormatter");
VisualBooleanFormatter.reTrue = /true|yes|on/i;
VisualBooleanFormatter.ToTarget = function (v) {
    return v ? "true": "false";
};
VisualBooleanFormatter.FromTarget = function (v) {
    if (BaseObject.is(v,"string") && (v.toLowerCase() == "true" || v.toLowerCase() == "yes")) return true;
    return false;
};
/* Inverter - inverts the value 
------------------------------------------------------------*/
function InverseFormatter() { }
InverseFormatter.Inherit(BaseObject, "InverseFormatter");
InverseFormatter.ToTarget = function (v) {
    return (v) ? false : true;
};
InverseFormatter.FromTarget = function (v) {
    return (v) ? false : true;
};

/* Is the value in a set of values*/
function StringInSetFormatter() { }
StringInSetFormatter.Inherit(BaseObject, "StringInSetFormatter");
StringInSetFormatter.$reSyntax = /^([a-z]*):(.*)$/i;
StringInSetFormatter.ToTarget = function (v, binding) {
    var s = binding.bindingParameter;
    var i;
    var arr = StringInSetFormatter.$reSyntax.exec(s);
    if (arr != null) {
        var cmd = arr[1];
        var words = arr[2].split(",");
        if(words != null && words.length) {
            var wordsBool = {};
            for (i = 0; i < words.length; wordsBool[words[i++]] = true);
            switch (cmd) {
                case "or":
                    if (BaseObject.is(v, "Array")) {
                        for (i = 0; i < v.length; i++) {
                            if (wordsBool[v[i].toLowerCase()] === true) return true;
                        }
                    } else if (typeof v == "object") {
                        for (i in v) {
                            if (wordsBool[i.toLowerCase()] === true) return true;
                        }
                    }else if (typeof v == "string" ) {
                        for (i = 0; i < words.length; i++) {
                            if (v.toLowerCase().indexOf(words[i]) >= 0 && words[i] !== "") return true;
                        }
                    }
                    break;
                case "all":
                case "and":
                    if (BaseObject.is(v, "Array")) {
                        for (i = 0; i < v.length; i++) {
                            var current = wordsBool[v[i].toLowerCase()];
                            if(current !== undefined){
                                if (current !== true) return false;
                            }
                        }
                    } else if (typeof v == "object") {
                        for (i in v) {
                            if (wordsBool[i.toLowerCase()] !== true) return false;
                        }
                    } else if (typeof v == "string") {
                        for (i = 0; i < words.length; i++) {
                            if (v.toLowerCase().indexOf(words[i] && words[i] !== "") < 0)return false;
                        }
                    }
                    return true;
            }
        }
        return false;
    } else {
        throw 'Invalid expression in the binding parameter. The right format is: parameter=<condition>:<word1,word2,...>. Condition must be "and", "or", "all"';
    }
};
StringInSetFormatter.FromTarget = function (v, binding) {
    throw "This formatter cannot be used with bidirectional bindings!";
};
function CloseBtnFormatter() {
}
CloseBtnFormatter.Inherit(BaseObject, "CloseBtnFormatter");
CloseBtnFormatter.ToTarget = function (v, binding) {
    return !window.weblink && StringInSetFormatter.ToTarget(v, binding);
};
/* Date Short Format
-------------------------------------------------------------*/
function DateShort() { }
DateShort.Inherit(BaseObject, "DateShort");
DateShort.re = /\/Date\(([+-]?\d+)\)\//i;
DateShort.format = "d";
DateShort.ToTarget = function (v) {
    var format = DateShort.GetFormat();
    if (typeof v === "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateShort.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
DateShort.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, DateShort.GetFormat());
        return d;
    }
    return v;
};
DateShort.GetFormat = function () {
    //var format = System.Default().get_settings('Settings360.DateShortFormat', 'd');
    var format = System.Default().get_settings('Settings360.DateFormat', 'd');
    return !IsNull(format) ? format : DateShort.format;
};
/* Date Short Format
-------------------------------------------------------------*/
/* Date Long Format
-------------------------------------------------------------*/
function DateLong() { }
DateLong.Inherit(BaseObject, "DateLong");
DateLong.re = /\/Date\(([+-]?\d+)\)\//i;
DateLong.format = "dd.MM.yyyy";
DateLong.ToTarget = function (v) {
    var format = DateLong.GetFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateLong.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
DateLong.FromTarget = function (v) {
    if (!IsNull(v)) {
        var format = DateLong.GetFormat();
        var d = Globalize.Default.parseDate(v, format);
        return d;
    }
    return v;
};
DateLong.GetFormat = function () {
    //var format = System.Default().get_settings('Settings360.DateLongFormat'); // Supposingly so - there is no setting for long date
    //var format = System.Default().get_settings('Settings360.DateFormat');
    //return !IsNull(format) ? format : DateLong.format;
    return DateLong.format;
};
/* Date Time Short Format
-------------------------------------------------------------*/
function DateTimeShort() { }
DateTimeShort.Inherit(BaseObject, "DateTimeShort");
DateTimeShort.re = /\/Date\(([+-]?\d+)\)\//i;
DateTimeShort.ToTarget = function (v) {
    var format = DateTimeShort.$getFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateTimeShort.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
DateTimeShort.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, DateTimeShort.$getFormat());
        return d;
    }
    return v;
};
DateTimeShort.$getFormat = function () {
    return DateShort.GetFormat() + ' ' + TimeShort.GetFormat();
};

/* Date Short Format
-------------------------------------------------------------*/
/* Date Time Long Format
-------------------------------------------------------------*/
function DateTimeLong() { }
DateTimeLong.Inherit(BaseObject, "DateTimeLong");
DateTimeLong.re = /\/Date\(([+-]?\d+)\)\//i;
DateTimeLong.format = "f";
DateTimeLong.ToTarget = function (v) {
    var format = DateTimeLong.$getFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateTimeLong.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
DateTimeLong.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, DateTimeLong.$getFormat());
		//if (d != null) return d.toJSON();
        return d;
    }
    return v;
};
DateTimeLong.$getFormat = function () {
	//return "dd.MM.yyyy HH:mm:ss";
    return DateLong.GetFormat() + ' ' + TimeLong.GetFormat();
};
/* Date Long Time Format
-------------------------------------------------------------*/
/* Date Short Time Short Format
-------------------------------------------------------------*/
function DateShortTimeLong() { }
DateShortTimeLong.Inherit(BaseObject, "DateShortTimeLong");
DateShortTimeLong.re = /\/Date\(([+-]?\d+)\)\//i;
DateShortTimeLong.ToTarget = function (v) {
    var format = DateShortTimeLong.$getFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateShortTimeLong.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
DateShortTimeLong.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, DateShortTimeLong.$getFormat());
        return d;
    }
    return v;
};
DateShortTimeLong.$getFormat = function () {
    return DateShort.GetFormat() + ' ' + TimeLong.GetFormat();
};
/* Date Short Time Long
-------------------------------------------------------------*/
/* Time Short Format
-------------------------------------------------------------*/
function TimeShort() { }
TimeShort.Inherit(BaseObject, "TimeShort");
TimeShort.re = /\/Date\(([+-]?\d+)\)\//i;
TimeShort.format = "t";
TimeShort.ToTarget = function (v) {
    var format = TimeShort.GetFormat();
    
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = TimeShort.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
TimeShort.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, TimeShort.GetFormat());
        return d;
    }
    return v;
};
TimeShort.GetFormat = function () {
    /*
    var timeFormat = 'h:mm tt';
    var dateDisplay = System.Default().get_settings('DateDisplay');
    if (dateDisplay != '12') timeFormat = 'HH:mm';
    */
    //return System.Default().get_settings('Settings360.TimeShortFormat',"HH:mm");
	return TimeShort.format;
};
/* Short Time Format
-------------------------------------------------------------*/
/* Time Long Format
-------------------------------------------------------------*/
function TimeLong() { }
TimeLong.Inherit(BaseObject, "TimeLong");
TimeLong.re = /\/Date\(([+-]?\d+)\)\//i;
//TimeLong.format = "T";
TimeLong.format = "hh:mm tt";
TimeLong.ToTarget = function (v) {
    var format = TimeLong.GetFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = TimeShort.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
TimeLong.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, TimeLong.GetFormat());
        return d;
    }
    return v;
};
TimeLong.GetFormat = function () {
    /*
    var timeFormat = 'h:mm:ss tt';
    var dateDisplay = System.Default().get_settings('DateDisplay');
    if (dateDisplay != '12') timeFormat = 'HH:mm:ss';
    */
    //return System.Default().get_settings('Settings360.TimeLongFormat', "HH:mm:ss");
	return TimeLong.format;
};

/* Date Time Day Month Format
-------------------------------------------------------------*/
function DateTimeDayMonth() { }
DateTimeDayMonth.Inherit(BaseObject, "DateTimeDayMonth");
DateTimeDayMonth.re = /\/Date\(([+-]?\d+)\)\//i;
DateTimeDayMonth.ToTarget = function (v) {
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, "K");
    }
    var matches = DateTimeLong.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, "K");
        return d;
    }
    return v;
};
DateTimeDayMonth.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, "K");
        return d;
    }
    return v;
};
DateTimeDayMonth.NewTarget = function (v) {
    if (!IsNull(v)) {
        var newv = new Date(v);
        var d = Globalize.Default.format(newv, "K");
        return d;
    }
    return v;
};
/* 
-------------------------------------------------------------*/

function DateShortGMT() { }
DateShortGMT.Inherit(BaseObject, "DateShortGMT");
DateShortGMT.re = /\/Date\(([+-]?\d+)\)\//i;
DateShortGMT.ToTarget = function (v) {
    var format = DateShortGMT.$getFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateShortGMT.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};

DateShortGMT.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, DateShortGMT.$getFormat());
        if (!IsNull(d)) {
            return new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
        }
        return d;
    }
    return v;
};
DateShortGMT.$getFormat = function () {
    var patterns;
    if (!IsNull(Globalize.Default)) {
        patterns = Globalize.Default.culture().calendar.patterns;
    } else {
        patterns = Globalize.culture().calendar.patterns;
    }
    return patterns.d + ' ' + patterns.t;
};
/* Short Time Format
-------------------------------------------------------------*/
// function VirtualPathFormatter() { }
// VirtualPathFormatter.Inherit(BaseObject, "VirtualPathFormatter");
// VirtualPathFormatter.ToTarget = function (v) {
    // return mapPath(v);
// };
// VirtualPathFormatter.FromTarget = function (v) {
    // return v;
// };

function CurrencyFormatter() { }
CurrencyFormatter.Inherit(BaseObject, "CurrencyFormatter");

CurrencyFormatter.ToTarget = function (v) {
    var a = Globalize.Default.format(v, "c");
    return a;
};
CurrencyFormatter.FromTarget = function (v) {
    var a = Globalize.parseFloat(v);
    return a;
};

function VirtualPathFormatter(basePath) {
    this.basePath = basePath;
}
VirtualPathFormatter.Inherit(BaseObject, "VirtualPathFormatter");
VirtualPathFormatter.ToTarget = function (v) {
    return mapPath(v);
};
VirtualPathFormatter.FromTarget = function (v) {
    return v;
};
VirtualPathFormatter.prototype.ToTarget = function (v) {
    return (this.basePath != null)? mapPath(basePath + v): mapPath(v);
};
VirtualPathFormatter.prototype.FromTarget = function (v) {
    return v;
};

function FloatPathFormatter() { }
FloatPathFormatter.Inherit(BaseObject, "FloatPathFormatter");

FloatPathFormatter.ToTarget = function (v) {
    var a = Globalize.Default.format(v, "n");
    return a;
};
FloatPathFormatter.FromTarget = function (v) {
    var a = Globalize.parseFloat(v);
    return a;
};


function CurrencyFormatted() { };
CurrencyFormatted.Inherit(BaseObject, "CurrencyFormatted");

CurrencyFormatted.ToTarget = function (v) {
    var i = parseFloat(v);
    var accurate = i.toFixed(4);
//    if (isNaN(i)) { i = 0.00; }
//    var minus = '';
//    if (i < 0) { minus = '-'; }
//    i = Math.abs(i);
//    // i = parseInt((i + .005) * 100);
//    i = i / 100;
//    s = new String(i);
//    if (s.indexOf('.') < 0) { s += '.00'; }
//    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
//    s = minus + s;
//    var c = Globalize.format(s, "n"); // "1,235"

    // Will return "10.00"
    return accurate;
};
/* Data state conveniences
    These formatters should be helpful whenever batch deletes/updates are performed and you want to vissually indicate the state of a record/subrecord
	Example data-bind-backcolor="{read ... format=DataStateFormatter parameter='case(new=#FFFFFF deleted=#FF0000 updated=#FFFF80 default=#CCCCCC)'}"
-------------------------------------------------------------------*/
function DataStateFormatter() { };
DataStateFormatter.Inherit(BaseObject, "DataStateFormatter");
DataStateFormatter.ToTarget = function (v, binding) {
    var param = (binding != null && binding.bindingParameter != null) ? binding.bindingParameter : "notdeleted";
    if (param == "notdeleted") {
        if (v != DataStateEnum.Deleted) return true;
        return false;
    } else if (param == "isdeleted") {
        if (v == DataStateEnum.Deleted) return true;
        return false;
    } else if (param != null && param.length > 0 && param.indexOf("case") == 0) {
        var re = /case\((.*?)\)/gi;
        var m = re.exec(param);
        if (m != null) {
            var cases = m[1];
            var recases = /(new|deleted|updated|unchanged|undefined|default)=(\S+)/gi;
            var def = v;
            while (m = recases.exec(cases)) {
                switch (m[1]) {
                    case "new":
                        if (v == DataStateEnum.New) return m[2];
                        break;
                    case "deleted":
                        if (v == DataStateEnum.Deleted) return m[2];
                        break;
                    case "updated":
                        if (v == DataStateEnum.Updated) return m[2];
                        break;
                    case "unchanged":
                        if (v == DataStateEnum.Unchanged) return m[2];
                        break;
					case "undefined":
						if (v == null) return m[2];
                        break;
                    case "default":
                        def = m[2];
                }
            }
            return def;
        }
    }
    return v;
};
DataStateFormatter.FromTarget = function (v, binding) {
    throw "This formatter should never be used on non-readonly binding!";
};
// Data state setter
function SetDataStateFormatter() { };
SetDataStateFormatter.Inherit(BaseObject, "SetDataStateFormatter");
SetDataStateFormatter.ToTarget = function (v, binding) {
    return v;
};
SetDataStateFormatter.FromTarget = function (v, binding) {
    if (binding != null) {
        var oldval = binding.get_sourceValue();
        if (v) {
            switch (binding.bindingParameter) {
                case "new":
                    return DataStateEnum.New;
                case "deleted":
                    return DataStateEnum.Deleted;
                case "updated":
                    return DataStateEnum.Updated;
                case "unchanged":
                    return DataStateEnum.Unchanged;
            }
        }
        return oldval;
    }
    return DataStateEnum.Unchanged; // Todo: Better throw an exception here.
};
/* Date Time Short Format
-------------------------------------------------------------*/
function DateTimeShortEx() { }
DateTimeShortEx.Inherit(BaseObject, "DateTimeShortEx");
DateTimeShortEx.re = /\/Date\(([+-]?\d+)\)\//i;
DateTimeShortEx.ToTarget = function (v) {
    var format = DateTimeShortEx.$getFormat();
    if (typeof (v) == "object") {
        return Globalize.Default.format(v, format);
    }
    var matches = DateTimeShortEx.re.exec(v);
    if (matches != null) {
        var parsing = parseInt(matches[1], 10);
        var result = new Date(parsing);
        var d = Globalize.Default.format(result, format);
        return d;
    }
    return v;
};
DateTimeShortEx.FromTarget = function (v) {
    if (!IsNull(v)) {
        var d = Globalize.Default.parseDate(v, DateTimeShortEx.$getFormat());
        return d;
    }
    return v;
};
DateTimeShortEx.$getFormat = function () {
    return "MM/dd/yyyy" + "     " + "h:mm tt";
};
/* Date Short Format
-------------------------------------------------------------*/

/* Round Format
-------------------------------------------------------------*/
function RoundDecimal() { }
RoundDecimal.Inherit(BaseObject, "RoundDecimal");
RoundDecimal.ToTarget = function (v, binding) {
    if (!IsNull(v)) {
        var param = (binding != null && binding.bindingParameter != null) ? binding.bindingParameter : '2';
        param = parseInt(param, 10);
        if (isNaN(param)) { param = 2; }
        if (param < 10) { 
            var digitsaftercoma = Math.pow(10, param);
            v = (Math.round(v * digitsaftercoma) / digitsaftercoma).toFixed(param);
        }
        return v;
    }
    return v;
};
RoundDecimal.FromTarget = function (v) {
    return (v === "") ? null : v;
};

/* Round Format
-------------------------------------------------------------*/

/* Integer Format
-------------------------------------------------------------*/
function IntegerFormatter() { }
IntegerFormatter.Inherit(BaseObject, "IntegerFormatter");
IntegerFormatter.ToTarget = function (v) {
    return v;
};
IntegerFormatter.FromTarget = function (v) {
    return (v === "") ? null : parseInt(v, 10);
};
/*----------------------------------------------------------*/

/* EmptyString Format
-------------------------------------------------------------*/
function EmptyStringToNullFormatter() { }
EmptyStringToNullFormatter.Inherit(BaseObject, "EmptyStringToNullFormatter");
EmptyStringToNullFormatter.ToTarget = function (v) {
    return v;
};
EmptyStringToNullFormatter.FromTarget = function (v) {
    return (v === "") ? null : v;
};
/*----------------------------------------------------------*/

/*New Lines Formatter*/
function NewLinesFormatter() { }
NewLinesFormatter.Inherit(BaseObject, "NewLinesFormatter");
NewLinesFormatter.re = /[\r\n\u0085\u2028\u2029]+/g;
NewLinesFormatter.ToTarget = function (v) {
    if (IsNull(v)) return '';
    var value = v.replace(NewLinesFormatter.re, '<br />');
    return value;
};
NewLinesFormatter.FromTarget = function (v) {
    return v;
};
/*New Lines Formatter*/
function ConvertNewLinesFormatter() { }
ConvertNewLinesFormatter.Inherit(BaseObject, "ConvertNewLinesFormatter");
ConvertNewLinesFormatter.ToTarget = function(v) {
    if (!IsNull(v)) {
        v = v.replace("<br/>", "\r\n");
        return v;
    } else {
        return "";
    }
};
ConvertNewLinesFormatter.FromTarget = function (v) {
    if (!IsNull(v)) {
        v = v.replace(/(\r\n)|(\n\r)|(\n(?!\r))|(\r(?!\n))/gi, "<br/>");
        return v;
    }
    else {
        return "";
    }
};
/*-------------------*/

/* Sentence formatter
-------------------------------------------------------------*/
function SentenceFormatter() { }
SentenceFormatter.Inherit(BaseObject, "SentenceFormatter");
SentenceFormatter.re = /%(?!%)\S+%/g;
SentenceFormatter.ToTarget = function (v, binding) {
    debugger;
    var fmt = binding.bindingParameter;
    if (fmt == null) return "[The binding parameter is not set!!!]";
    var s = new String(fmt);
    var arr = s.match(SentenceFormatter.re);
    if (arr != null) {
        for (var i = 0; i < arr.length; i++) {
            var f = arr[i].slice(1, -1);
            s = s.replace(arr[i], v[f]);
        }
        return s;
    } else {
        return v;
    }
};
SentenceFormatter.FromTarget = function (v) {
    return v;
};

/* Displacement of the index formatter
-------------------------------------------------------------*/

function DisplacementFormater() { };
DisplacementFormater.Inherit(BaseObject, "DisplacementFormater");
DisplacementFormater.ToTarget = function (v, par) {
    var p = par.bindingParameter;
    if (!IsNull(p)) {
        p = parseInt(p);
        //v = v + p;
        v += p;
    } else {
        v += 1;
    }
    return v;
};
DisplacementFormater.FromTarget = function (v) { return v; };
/* Comparison formatter
-------------------------------------------------------------*/
function CompareFormater() { };
CompareFormater.Inherit(BaseObject, "CompareFormater");
CompareFormater.ToTarget = function (v, par) {
    if (v == null) return false;
    if (par != null) {
        if (v == par.bindingParameter) return true;
    }
    return false;
};
CompareFormater.FromTarget = function (v, par) {
    if (par != null) {
        if (v) return par.bindingParameter;
    }
    return null;
};
/* PositiveNegative formatter
-------------------------------------------------------------*/
function PositiveNegativeFormater() { };
PositiveNegativeFormater.Inherit(BaseObject, "PositiveNegativeFormater");
PositiveNegativeFormater.ToTarget = function (v, binding) {
    var par = (binding == null) ? null : binding.bindingParameter;
    var p = (par == null || !BaseObject.is(par, "string")) ? "pos" : p;
    switch (p) {
        case "pos":
            return (v >= 0);
            break;
        default:
            return (v < 0);
            break;
    }
    return false;
};
PositiveNegativeFormater.FromTarget = function (v, binding) {
    var par = (binding == null) ? null : binding.bindingParameter;
    var p = (par == null || !BaseObject.is(par, "string")) ? "pos" : p;
    switch (p) {
        case "pos":
            return (v)?1:-1;
            break;
        default:
            return (v) ? -1 : 1;
            break;
    }
    return 0;
};

/*------- Order clause formatter ------*/
function OrderClauseFormatter() { 
    BaseObject.apply(this,arguments);
};
OrderClauseFormatter.Inherit(BaseObject, "OrderClauseFormatter");
OrderClauseFormatter.ToTarget = function (v) {
    var arr = [];
    if (BaseObject.is(v, "string")) {
        var t = v.split(",");
        for (var i = 0; i < t.length; i++) {
            var te = t[i].trim().split(/\s+/);
            arr.push({ index: i, field: te[0], order: te[1] });
        }
    }
    return arr;
};
OrderClauseFormatter.FromTarget = function (v) {
    var s = "";
    if (BaseObject.is(v, "Array")) {
        for (var i = 0; i < v.length; i++) {
            var o = v[i];
            if (o != null && typeof o == "object" && typeof o.field == "string") {
                if (s.length > 0) s += ",";
                s += o.field + " " + ((o.order != null) ? o.order : "asc");
            }
        }
    }
    return ((s.length > 0) ? s : null);
};

/*------------Array - string list -------------*/
// The target requires an array of objects, the source is a list of strings
// [{ name: "a"},{name: "b"}] <-> "a,b"
function ArrayAsStringFormatter() { }
ArrayAsStringFormatter.Inherit(BaseObject, "ArrayAsStringFormatter");
ArrayAsStringFormatter.ToTarget = function (v, binding) {
    var delim = ((binding.bindingParameter != null && binding.bindingParameter.length > 0) ? binding.bindingParameter : ",");
    var result = []
    if (BaseObject.is(v, "string")) {
        var arr = v.split(delim);
        for (var i = 0; i < arr.length; i++) {
            result.push({field: arr[i], index: i});
        }
    }
    return result;
}
ArrayAsStringFormatter.FromTarget = function (v, binding) {
    var delim = ((binding.bindingParameter != null && binding.bindingParameter.length > 0) ? binding.bindingParameter : ",");
    var result = "";
    if (BaseObject.is(v, "Array")) {
        var o = v[i];
        if (o != null && typeof o == "object" && typeof o.field == "string") {
            if (result.length > 0) {
                result += ",";
            }
            result+= o.field;
        }
    }
    return ((result.length > 0) ? result : null);
}

/*------------tokens in string to array and back---------------*/
function StringToArrayFormatter() {
}
StringToArrayFormatter.Inherit(BaseObject, "StringToArrayFormatter");
StringToArrayFormatter.ToTarget = function(v, binding, args) {
	var delim = FormatterBase.getParameter(arguments, ",");
	if (BaseObject.is(v,"Array") || v == null) return v;
	return ("" + v).split(delim).Select(function(idx, item) {
		return item.trim();
	});
}
StringToArrayFormatter.FromTarget = function(v, binding, args) {
	var delim = FormatterBase.getParameter(arguments, ",");
	if (typeof v == "string" || v == null) return v;
	if (BaseObject.is(v, "Array")) return v.join(delim);
	return null;
}