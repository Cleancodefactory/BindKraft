// *************************************************************************
// DEPRECATED [2018-02-18] There is a new system in place - see SystemFormatterBase and SystemFormattersRegister
// **************************************************************************
/* DEPRECATED - do not use, do not base new formatters on anything here - only salvaging chunks of code is fine!
	The new system offers advanced parameter parsing and more
	
*/


// A new beginning for the framework formatters/converters/filters (official term "formatter").
/* 
    The lack of discipline caused chaotic implementation of formatters with inconsistential behaviour and feature coverage.
    The work to replace and organize formatters is now on. Please adhere to the rules below and contact Michael Palazov for permission
    to add new ones here.

    Rules:
        1) Inherit from FormatterBase
        2) Try to use only formatter parameters (a feature introduced in version 1.4.1). Use bindingParameter only as secondary source of parameters 
        3) USe the static methods FormatterBase.getFormatterParameter(arguments, defaultValue) or FormatterBase.getParameter(arguments, defaultValue) to obtain the parameters string.
            Prefer  FormatterBase.getFormatterParameter for new implementations and use FormatterBase.getParameter only for implementations that need to keep compatibility with legacy code.
            
            From version 1.4.1 formatters can be specified in bindings as follows:
                {... format=formatter1,formatter2,formatter3... }
                There must be no spaces between the formatters!
                Each formatter can be:
                    - systemformatter's class name (this file) (e.g. SysFmtInteger, SysFmtDouble etc.)
                    - custom formatter parent/child data-key address and property name (e.g. __view:myformatter, firtblock/mydiv:mycustomformatter)
                After each formatter name parameters can be specified optionally in () - e.g. someformatter(this is parameter)
                    The 'parameters' is a sting and can contain anything but ")" which needs to be escaped by doubling e.g. )) which makes brackets undesirable in parameters
            FormatterBase.getParameter will return the string and it is up to the formatter to parse it and extract the data it needs. Syntax with commmas or spaces between tokens
                is recommended, but is not mandatory.
            If no parameters are set in brackets the bindingParameter will be returned if the formatter is invoked by a binding. This usage is undesirable except in scenarios
                where confusion is considered impossible. The bindingParameter is too universal and can be used by almost any code executed during the binding processing, this can
                mix parameters intended for different
            On the contrary FormatterBase.getFormatterParameter will check only the validator parameters in the brackets and will return the defaultValue if they are not there. bindingParameter
                will not be used at all. This is the recommended behavior for new implementations.

        Note that validator parameters are static and should be static, they are set in the binding by the designer of the view and must be treated in configuration-like manner. Designing
        your code to rely on dynamically changed validator parameters should be considered bad idea (among the many reasons this makes the view unreadable by hiding the true functionality).

        If you still need dynamic behaviour you should design a validator that interacts with the state of one or more of the participants of the binding. They can be accessed through
        the second argument of the ToTarget/FromTarget functions and through the this variable in custom validators.

        WARNING: Any access to the binding (second argument of ToTarget/FromTarget) and the parameters (3-d argument) should be tested for null. This guarantees that the validator you
            write will be callable from code where binding is not available and parameters my or may not be present (depending on the caller's intention).

*/

// This base class does not actually serve inheritance purpose and it is not a requirement to Inherit from this class
// when you build a formatter. However this class is also a holder for some helper static methods and this makes its existence
// meaningful
function FormatterBase() {}
FormatterBase.Inherit(BaseObject, "FormatterBase");
FormatterBase.getFormatterParameter = function(args, defVal) {
    if (args != null && args.length >= 3 && args[2] != null) {
		return args[2];
    }
    return defVal;
};
FormatterBase.getParameter = function(args, defVal) {
	if (args != null && args.length >= 3 && args[2] != null) {
		return args[2];
	} else if (args != null && args.length >= 2 && BaseObject.is(args[1], "CBinding")) {
		var r = args[1].bindingParameter;
		if (r != null) return r;
	}
	return defVal;
};
FormatterBase.callFormatter = function(customObject, fmtName, direction, val, bind, args) {
	var fmt = null;
	var m = ((direction == "source")?"FromTarget":"ToTarget");
	if (customObject != null) {
		if (typeof customObject[fmtName] == "object") {
			if (typeof customObject[fmtName][m] != "function") throw "Method " + m + " not found on custom formatter " + fmtName + " in class " + CObject.fullTypeOf(customObject);
			fmt = new CDelegate(customObject, customObject[fmtName][m]);
		} else {
			throw "Custom formatter " + fmtName + " cannot be found on " + CObject.fullTypeOf(customObject);
		}
		
	} else {
		fmt = Function.classes[fmtName];
		if (fmt != null) {
			if (typeof fmt[m] != "function") throw "Method " + m + " not found on system formatter " + fmtName;
			fmt = new CDelegate(fmt, m);
		} else {
			throw "Class not found when trying to find system formatter " +fmtName;
		}
	}
	if (fmt != null) {
		return fmt.invoke(/*any*/val, /*Binding*/bind, /*string*/args);
	}
}

/*CLASS*/ /*FORMATTER*/
// SysFmtFilterObject return object containing key-value pairs with keys which matches some words passed as parameters.
function SysFmtFilterObject() {}
SysFmtFilterObject.Inherit(FormatterBase,"SysFmtFilterObject");
SysFmtFilterObject.ToTarget = function(v,b,args) {
    var arg = FormatterBase.getFormatterParameter(arguments, null);
    if (arg != null && arg.length > 0) { // TODO: Validate input! Has to be string(obviously)
        var arr = arg.split(" ");
        if (arr.length > 0) {
            var i,o,k,re;
            o = {};
            re = [];
            for (i = 1; i < arr.length; i++) {
                re[i-1] = new RegExp(arr[i],"g");
            }
            if (arr[0].indexOf("include") == 0) {
                for(k in v) {
                    for (i = 0; i < re.length; i++) {
                        if (re[i].test(k)) {
                            o[k] = v[k];
                            break;
                        }
                    }
                }
                return o;
            } else if (arr[0].indexOf("exclude") == 0) {
                var pass = false;
                for(k in v) {
                    pass = false;
                    for (i = 0; i < re.length; i++) {
                        if (re[i].test(k)) {
                            pass = true;
                            break;
                        }
                    }
                    if (!pass) {
                        o[k] = v[k];
                    }
                }
                return o;
            }
            else{
                throw new Error('Invalid parameter passed to SysFmtFilterObject.ToTarget formatter! First parameter must to be "include" or "exclude"');
            }
        }
    }

    return v; // With no instruction the reference is passed "as is
};
SysFmtFilterObject.FromTarget = function(v,b,args) {
    return v;
};

// Date and Time formatter. For explanation on how it works, see the example for the New formatters.
// TODO: For implementing parsing other formats of Date and Time
function SysFmtDateTime(){}
SysFmtDateTime.Inherit(FormatterBase, 'SysFmtDateTime');
SysFmtDateTime.reTimeStamp = /\/Date\(([+-]?\d+)\)\//i;
SysFmtDateTime.ToTarget = function(v, b, args){
    var date, pattern;
    args = SysFmtDateTime.ParseArgumentString(args);

    // predefined patterns
    if(args.predefinedPattern){
        switch(args.predefinedPattern){
            case 'd':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.d; // d - parameter for Short date format, the pattern will be in format M/d/yyyy
                break;
            case 'D':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.D; // d - parameter for Short date format, the pattern will be in format "dddd, MMMM dd, yyyy"
                break;
            case 't':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.t; // "h:mm tt", long time pattern
                break;
            case 'T':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.T; // "h:mm:ss tt", long date, short time pattern
                break;
            case 'f':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.f; // "dddd, MMMM dd, yyyy h:mm tt", long date, long time pattern
                break;
            case 'F':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.F; // "dddd, MMMM dd, yyyy h:mm:ss tt", month/day pattern
                break;
            case 'M':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.M; // "MMMM dd", month/day pattern
                break;
            case 'Y':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.Y; // "yyyy MMMM", year/ month pattern
                break;
            case 'S':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.S; // S is a sortable format that does not vary by culture "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",
                break;
            case 'K':
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.K; // "M/d"
                break;
            default: // the default format is Date short format M/d/yyyy
                pattern = Globalize.Default.culture(args.culture).calendar.patterns.d;
                break;
        }
    }
    else if(args.explicitPattern){
        pattern = args.explicitPattern; // useless variable pattern
    }

    var matches = SysFmtDateTime.reTimeStamp.exec(v);
    if(matches != null){
        var timeStampNumber = parseInt(matches[1], 10);
        date = new Date(timeStampNumber);
    }
    var c = args.culture;
    date = Globalize.Default.format(date, pattern, args.culture);

    return date;
};

SysFmtDateTime.FromTarget = function(v,b,args) {
    throw new Error('SysFmtDateTime.FromTarget not implemented exception!'); //TODO!
};

SysFmtDateTime.ParseArgumentString = function(arg, base) {
    var re = /(?:(?:^|\s)([a-z]{2})(?:\-([A-Za-z]{2}))?(?=$|\s))|(?:(?:(?:^|\s)\')(?:([a-zA-Z]{1})|(\S{4,24}))(?=\'(?=$|\s)))|(?:(?:^|\s)(utc|local|default)(?=$|\s))/g;
    var a = arg;
    re.lastIndex = 0; // why? it Is 0;
    var m,i;
    // Here the defaults should be set, but we have to decide where to get them from.
    var result = {
        culture: null,
        subculture: null,
        predefinedPattern: null,
        explicitPattern: null,
        timePolicy: null
    };

    if(!arg){
        result = {
            culture: 'en',
            subculture: null,
            predefinedPattern: 'd',
            explicitPattern: null,
            timePolicy: 'local'
        }
    }

    if (base != null) {
        for (i in base) {
            if (base[i] != null) result[i] = base[i]
        }
    }
    while(m = re.exec(arg)) { // m is Array
        for (i = 1; i <= 5;i++) {
            if (m[i] != null && m[i].length && m[i].length > 0) {
                switch (i) {
                    case 1:
                        result.culture = m[i];
                        if (m[i+1] != null && m[i+1].length > 0) result.subculture = m[i+1];
                        break;
                    case 3:
                        result.predefinedPattern = m[i];
                        break;
                    case 4:
                        result.explicitPattern = m[i];
                        break;
                    case 5:
                        result.timePolicy = m[i];
                        break;
                }
            }
        }
    }
    return result;
};

// SysFmtToBoolean formatter. Evaluates anything passed as value to boolean expression.
function SysFmtToBoolean(){}
SysFmtToBoolean.Inherit(FormatterBase, 'SysFmtToBoolean');
// SysFmtToBoolean.regEx = /true|yes|yea|yep|on|да|si|ja/gi; // TODO 1: BEWARE with the static regEx patterns. They keep tracks for the last index matched and set it on the lastIndex property of the RegEx object.
SysFmtToBoolean.ToTarget = function(v, b, args){
    var arg = FormatterBase.getFormatterParameter(arguments,"");
    var result = SysFmtToBoolean.GetResult(v);

    if(arg == 'inverse'){
        return !result;
    }

    return result;
};

SysFmtToBoolean.FromTarget = function(value, binding, args){
    var arg = FormatterBase.getFormatterParameter(arguments,"");
    var result = SysFmtToBoolean.GetResult(value);

    if(arg == 'inverse'){
        return !result;
    }

    return result;
};

SysFmtToBoolean.GetResult = function(v){
    var regEx = /true|yes|yea|yep|on|да|si|ja/gi; // TODO 2: Avoid the above by using local regEx pattern variable!
    if(v == null) return false;
    if(v == true) return true;
    if(typeof v == 'number'){
        if(v > 0) return true;
        else{
            return false;
        }
    }
    else if(typeof v == 'string'){
        if(v.length == 0) return false;
        if(isNaN(parseInt(v))){
            if(regEx.test(v)){
                //SysFmtToBoolean.regEx.lastIndex = 0; // TODO: In case of using static regEx pattern, set manually lastIndex to 0!!!
                return true;
            }
            else{
                return false;
            }
        }
        else{
            //matchedNumber = SysFmtToBoolean.regEx.exec(v);
            //if(parseInt(matchedNumber[0]))return true;
            if(parseInt(v) > 0) return true;
            else{
                return false;
            }
        }
    }
    else{
        return false;
    }
};

// SysFmtIsNull formatter. Check if the value is null
function SysFmtIsNull() {}
SysFmtIsNull.Inherit(FormatterBase,"SysFmtIsNull");
SysFmtIsNull.ToTarget = function(v,b,args) {
    var arg = FormatterBase.getFormatterParameter(arguments,"isnull");
    if (arg != null && arg.length > 0) { // why arg.length > 0? It is always > 0, because the default value is 'isnull'
        arg = arg.trim();
        if (arg == "notnull" || arg == "not") {
            if (v != null) return true;
        } else if(arg === 'is' || arg === 'isnull'){
            if (v == null) return true;
        }
        else{
            throw new Error('You entered wrong parameter. Check for null value against "notnull", "not", "isnull" or "is" parameter word');
        }
    }
    return false;
};

SysFmtIsNull.FromTarget = function(v,b,args) {
    throw new Error("SysFmtIsNull MUST not be used in FromTarget direction.");
};

// SysFmtNullOrEmptyToString - Turns null to empty string or empty string to null, according to what we are formatting!
function SysFmtNullOrEmptyToString(){}
SysFmtNullOrEmptyToString.Inherit(FormatterBase, 'SysFmtNullOrEmptyToString');
SysFmtNullOrEmptyToString.ToTarget = function(value, binding, args){
    if(value === null){
        return '';
    }
    else if(value === '' || typeof value === 'undefined'){
        return null; // if empty string is passed as value, it comes here as undefined!!! Why, Michael, why?
    }
    else{
        throw new Error("Null or Empty string must be passed as value to the SysFmtNullOrEmptyToString.ToTarget");
    }
};
SysFmtNullOrEmptyToString.FromTarget = function(value, binding, args){
    if(value === null){
        return '';
    }
    else if(value === '' || typeof value === 'undefined'){
        return null;
    }
    else{
        throw new Error("Null or Empty string must be passed as value to the SysFmtNullOrEmptyToString.FromTarget");
    }
};

// SysFmtCurrency - Currency formatter in different cultures.
function SysFmtCurrency(){}
SysFmtCurrency.Inherit(FormatterBase, 'SysFmtCurrency');
SysFmtCurrency.ToTarget = function(v, b, args){
    args = SysFmtCurrency.ParseArguments(args);

    if(!v) throw new Error('Null or undefined value passed to the formatter');
    if(typeof v  == 'string') v = parseFloat(v);
    if(isNaN(v)){
        throw new Error('Valid number must be passed as value to the formatter!');
    }

    var formattedValue = Globalize.format(v, 'c', args.culture); // c - for currency
    return formattedValue;
};

SysFmtCurrency.FromTarget = function (v, b, args) {
    args = SysFmtCurrency.ParseArguments(args);

    var radix = 10; // TODO: need some improvement...
    var a = Globalize.parseFloat(v, radix, args.culture);
    if(isNaN(a)){
        throw new Error('Valid number must be passed as value to the formatter!');
    }

    return a;
};

SysFmtCurrency.ParseArguments = function (parameters){
    var args  = {
        culture: null,
        formatPattern: null,
        timeSystem: null
    };

    if(!parameters){
        args.culture = 'en';
        return args;
    }
    var firstSpaceIndex, firstQuotationIndex, secondQuotationIndex, secondSpaceIndex, firstParam, secondParam, thirdParam;
    parameters = parameters.trim();

    firstSpaceIndex = parameters.indexOf(' ');
    if(firstSpaceIndex == -1){
        args.culture = parameters;
    }
    else{
        firstParam = parameters.substr(0, 2);
        if(SysFmtCurrency.ValidateParam(firstParam)) args.culture = firstParam;

        firstQuotationIndex = parameters.indexOf('\'', firstSpaceIndex);
        secondQuotationIndex = parameters.indexOf('\'', firstQuotationIndex + 1);
        secondSpaceIndex = parameters.indexOf(' ', secondQuotationIndex + 1);

        // parsing second parameter
        if(firstQuotationIndex > 0){
            if(secondQuotationIndex > 0){
                secondParam = parameters.substring(firstQuotationIndex + 1, secondQuotationIndex).trim();
                if(SysFmtCurrency.ValidateParam(secondParam)) args.formatPattern = secondParam;
            }else{
                throw 'Second formatter parameter has to be bound in single quotation marks: \'parameter\''
            }
        }else{
            return parameters;
        }
        //parsing third parameter
        if(secondSpaceIndex > 0){
            thirdParam = parameters.substr(secondSpaceIndex + 1, parameters.length).trim();
            if(SysFmtCurrency.ValidateParam(thirdParam)) args.timeSystem = thirdParam;
        }else{
            return args;
        }

        return args;
    }

    return args;
};

SysFmtCurrency.ValidateParam = function(str){
    if(!(str.charCodeAt(0) > 96 && str.charCodeAt(str.length - 1) < 123)){
        throw 'Invalid parameter format!';
    }

    return true;
};

// SysFmtRoundDecimal - Format a number to float with fixed number of digits
function SysFmtRoundDecimal() {}
SysFmtRoundDecimal.Inherit(FormatterBase, 'SysFmtRoundDecimal');
SysFmtRoundDecimal.ToTarget = function(v, b, args){
    var numberOfDigitsAfterComma = FormatterBase.getFormatterParameter(arguments, '2');

    v = parseFloat(v);
    if(isNaN(v)){
        throw new Error('Insert valid number to the SysFmtRoundDecimal formatter');
    }

    numberOfDigitsAfterComma = parseInt(numberOfDigitsAfterComma, 10);
    if(isNaN(numberOfDigitsAfterComma)){
        numberOfDigitsAfterComma = 2;
    }
    if(numberOfDigitsAfterComma < 21){
        var module = Math.pow(10, numberOfDigitsAfterComma);
        v = parseFloat((Math.round(v * module) / module).toFixed(numberOfDigitsAfterComma));
    }

    return v;
};
SysFmtRoundDecimal.FromTarget = function(v,b,args) {
    var numberOfDigitsAfterComma = FormatterBase.getFormatterParameter(arguments, '2');

    v = parseFloat(v);
    if(isNaN(v)){
        throw new Error('Insert valid number to the SysFmtRoundDecimal formatter');
    }
    numberOfDigitsAfterComma = parseInt(numberOfDigitsAfterComma, 10);
    if(isNaN(numberOfDigitsAfterComma)){
        numberOfDigitsAfterComma = 2;
    }
    if(numberOfDigitsAfterComma < 21){
        var module = Math.pow(10, numberOfDigitsAfterComma);
        v = parseFloat((Math.round(v * module) / module).toFixed(numberOfDigitsAfterComma));
    }

    return v;
};

// SysFmtArrayOrObjectAsString - concatenate the members of an array, two-dimensional array and associated array, and those which are nested in them.
function SysFmtArrayOrObjectAsString(){}
SysFmtArrayOrObjectAsString.Inherit(FormatterBase, 'SysFmtArrayOrObjectAsString');
SysFmtArrayOrObjectAsString.ToTarget = function(v, b, args){
    var result = {'r': ''},
        i,
        len,
        delimiter = FormatterBase.getFormatterParameter(arguments, ',');

    if(!({}.toString.apply(v) == '[object Array]' || {}.toString.apply(v) == '[object Object]')){
        throw new Error("Not an array or object has been passed to the SysFmtArrayOrObjectAsString formatter!")
    }

    SysFmtArrayOrObjectAsString.parseObjectRecursive(v, delimiter, result);

    result.r = result.r.substr(0, result.r.length - 1);
    return result.r;
};

SysFmtArrayOrObjectAsString.parseObjectRecursive = function(obj, delimiter, result){
    if({}.toString.apply(obj) == '[object Array]'){
        var len = obj.length;
        for(var i = 0; i < len; i++){
            var currentElement = obj[i];
            if(currentElement instanceof Array){
                SysFmtArrayOrObjectAsString.parseObjectRecursive(currentElement, delimiter, result);
            }
            else if({}.toString.apply(currentElement) == '[object Object]'){
                // code repetition
                for(var key in currentElement){
                    if({}.toString.apply(currentElement[key]) == '[object Object]' || {}.toString.apply(currentElement[key]) == '[object Array]'){
                        SysFmtArrayOrObjectAsString.parseObjectRecursive(currentElement[key], delimiter, result);
                    }
                    else{
                        result.r += (currentElement[key] + delimiter);
                    }
                }
                // code repetition
            }
            else{
                result.r += currentElement + delimiter;
            }
        }
    }
    else if({}.toString.apply(obj) == '[object Object]'){
        // code repetition
        for(var key in obj){
            if({}.toString.apply(obj[key]) == '[object Object]' || {}.toString.apply(obj[key]) == '[object Array]'){
                SysFmtArrayOrObjectAsString.parseObjectRecursive(obj[key], delimiter, result);
            }
            else{
                result.r += (obj[key] + delimiter);
            }
        }
        // code repetition
    }
    else{
        result.r += (obj[key] + delimiter);
    }
};

SysFmtArrayOrObjectAsString.FromTarget = function(v,b,args) {
    throw new Error("SysFmtArrayOrObjectAsString MUST not be used in FromTarget direction.");
};

// SysFmtStringInSet formatter. Checks for a string in other string, array or associated array. The associated array is checked against the keys and the values of their key-value pairs.
function SysFmtStringInSet() {}
SysFmtStringInSet.Inherit(FormatterBase, "SysFmtStringInSet");
SysFmtStringInSet.$reSyntax = /^([a-z]*):(.*)$/i;
SysFmtStringInSet.ToTarget = function (v, binding, args) {
    var i,
        arr,
        current,
        param = FormatterBase.getFormatterParameter(arguments, '');
    //var s = binding.bindingParameter; // intent to avoid passing parameters with 'parameter=...' and using binding.bindingParameters object

    if(!({}.toString.apply(v) == '[object String]' || {}.toString.apply(v) == '[object Array]' || {}.toString.apply(v) == '[object Object]')){
        throw new Error("Not an array, object or string has been passed to the SysFmtArrayOrObjectAsString formatter!")
    }

    arr = SysFmtStringInSet.$reSyntax.exec(param);
    if (arr != null) {
        var cmd = arr[1];
        var words = arr[2].split(";"); // Michael! The formatter parameters MUST TO BE ABLE TO CONTAIN commas as separator :)
        if(words != null && words.length) {
            var wordsBool = {};
            for (i = 0; i < words.length; wordsBool[words[i++]] = true);
            switch (cmd) {
                case "or":
                    if (BaseObject.is(v, "Array")) {
                        for (i = 0; i < v.length; i++) {
                            if(typeof v[i] == 'string'){
                                current = wordsBool[v[i].toLowerCase()];
                                if(current !== undefined){
                                    if (current === true) return true;
                                }
                            }
                        }
                    } else if ({}.toString.apply(v) == "[object Object]") {
                        for (i in v) {
                            if (wordsBool[i.toLowerCase()] === true) return true; // checks for matching the keys against the parameters, not the values!!!
                        }
                    }else if (typeof v == "string" ) {
                        for (i = 0; i < words.length; i++) {
                            if (v.toLowerCase().indexOf(words[i]) >= 0 || words[i] === "") return true;
                        }
                    }
                    break;
                case "all": // what is the reason to have both 'all' and 'and' condition parameters, if they do the same work?
                case "and":
                    if (BaseObject.is(v, "Array")) {
                        var isTrue = false;
                        for(var key in wordsBool){
                            isTrue = false;
                            for (i = 0; i < v.length; i++) {
                                var curr = v[i].toString().toLowerCase();
                                if(curr === key || curr === wordsBool[key]){
                                    isTrue = true;
                                    break;
                                }
                            }
                            if(!isTrue){
                                return false;
                            }
                        }
                        return isTrue;
                    } else if ({}.toString.apply(v) == "[object Object]") {
                        for (i in v) {
                            if (wordsBool[i.toLowerCase()] !== true) return false;
                        }
                    } else if (typeof v == "string") {
                        for (i = 0; i < words.length; i++) {
                            if (v.toLowerCase().indexOf(words[i]) < 0 || words[i] === "") return false;
                        }
                    }
                    return true;
            }
        }
        return false;
    } else {
        throw new Error('Invalid expression in the formatter parameter. The right format is: (<condition>:<word1;word2;word3...>). Note that the delimiter is ";". Condition must be "and", "or", "all"');
    }
};

SysFmtStringInSet.FromTarget = function (v, binding) {
    throw new Error("SysFmtStringInSet cannot be used with bidirectional bindings!");
};

// SysFmtChangeCase - Change the letter case of string to Upper or to Lower
function SysFmtChangeCase(){}
SysFmtChangeCase.Inherit(FormatterBase, "SysFmtChangeCase");
SysFmtChangeCase.ToTarget = function(value, binding, args){
    var result,
        condition = FormatterBase.getFormatterParameter(arguments, 'toUpper');
    if(typeof value !== 'string'){
        throw new Error('Only strings are allowed to be formatted by SysFmtChangeCase');
    }
    if(condition === 'toUpper'){
        result = value.toUpperCase();
    }
    else if(condition === 'toLower'){
        result = value.toLowerCase();
    }
    else{
        throw new Error('Only "toUpper" and "toLower" parameters are allowed in SysFmtChangeCase');
    }

    return result;
};
SysFmtChangeCase.FromTarget = SysFmtChangeCase.ToTarget;

// SysFmtNumberDisplacement
function SysFmtNumberDisplacement(){}
SysFmtNumberDisplacement.Inherit(FormatterBase, 'SysFmtNumberDisplacement');
SysFmtNumberDisplacement.ToTarget = function(value, binding, args){
    var number,
        param = FormatterBase.getFormatterParameter(arguments, 1);

    if(typeof value === 'number'){
        number = value;
    }
    else if(typeof value === 'string'){
        number = parseInt(value);
        if(isNaN(number)){
            throw new Error('Please, enter valid number as value to the SysFmtNumberDisplacement');
        }
    }
    else{
        throw new Error('Please, enter valid number as value to the SysFmtNumberDisplacement');
    }

    if(typeof param === 'string'){
        param = parseInt(param);
        if(isNaN(param)){
            throw new Error('Please, enter valid number as parameter to the SysFmtNumberDisplacement');
        }
    }
    if(typeof param === 'number'){
        number += param;
    }
    else{
        throw new Error('Please, enter valid number as parameter to the SysFmtNumberDisplacement');
    }

    return number;
};

SysFmtNumberDisplacement.FromTarget = SysFmtNumberDisplacement.ToTarget;

// SysFmtStringToArray - Split a string to an array according to delimiter passed as parameter
function SysFmtStringToArray(){}
SysFmtStringToArray.Inherit(FormatterBase, 'SysFmtStringToArray');
SysFmtStringToArray.ToTarget = function(value, binding, args){
    var result = [],
        param = FormatterBase.getFormatterParameter(arguments, ','); // available params: RemoveEmptyEntries, RemovePunctuationMarks
    if (BaseObject.is(value,"Array")) return value;
    if(typeof value !== 'string'){
        throw new Error('Value passed to the SysFmtStringToArray must to be string or array');
    }

    result = SysFmtStringToArray.splitAndRemoveEmptyEntries(value, param);
    return result;
};

SysFmtStringToArray.FromTarget = SysFmtStringToArray.ToTarget;

// SysFmtStringToArray - split string, trim the split strings, and remove empty entries.
SysFmtStringToArray.splitAndRemoveEmptyEntries = function(str, param){
    var result = [],
        i = 0,
        len,
        temp = str.split(param),
        trimStr;

    len = temp.length;
    for(; i < len; i+=1){
        trimStr = temp[i].trim();
        if(temp[i].length !== 0){
            result.push(trimStr);
        }
    }

    return result;
};