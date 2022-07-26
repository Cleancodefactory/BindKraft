(function () {



    var $__ReplaceAll = function (str, patt, rep) {
        var regex = new RegExp(patt, 'g');
        return str.replace(regex, rep);
    }
    function toUtf8(inp) {
        var src = encodeURIComponent(inp);
        var bstr = "";
        for (var i = 0;i<src.length;i++) {
            if (src.charAt(i) == '%') {
                bstr += String.fromCharCode(parseInt(src.slice(i+1,i+3),16));
                i +=2;
            } else {
                bstr += src.charAt(i);
            }
        }
        return bstr;
    }
    var UTF8Encoding = Class("UTF8Encoding");

    var libs = Class("CLLibraries");
    libs.DefineLibrary("base", [{
            name: "Sum",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                var allNum = ARGS.All(function (i, el) {
                    if (isNaN(el)) {
                        return false;
                    }
                    return true;
                });
                if (allNum) {
                    var sum = 0;
                    for (var i = 0; i < ARGS.length; i++) {
                        sum += Number(ARGS[i]);
                    }
                    return sum;
                } else {
                    return Operation.Failed("Sum - Not all passed parameters are numbers!");
                }
            },
            help: "Sums all the arguments if they are all numbers."
        },
        {
            name: "Concat",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                var sum = '';
                if (ARGS.length == 0) return sum;
                
                for (var i = 0; i < ARGS.length; i++) {
                    sum += ('' + ARGS[i]);
                }
                return sum;
            },
            help: "Concatenates all the arguments in one string."
        },
        {
            name: "Throw",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length > 0 && ARGS[0] != null) {
                    return Operation.Failed(ARGS[0]);
                } else {
                    return Operation.Failed("Exception raised intentionally from an CLLibrary code!");
                }
            },
            help: "Causes an exception."
        },
        {
            name: "Log",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length > 0) {
                    console.log(ARGS.toString());
                    return ARGS[0];
                } else {
                    return null;
                }
            },
            help: "Logs all the arguments to the browser's console."
        },
        {
            name: "IsNumeric",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("IsNumeric requires 1 argument!");
                }
                return !isNaN(ARGS[0]);
            },
            help: "Checks if the argument is a number."
        },
        {
            name: "Neg",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1 || isNaN(ARGS[0])) {
                    return Operation.Failed("Neg requires 1 numeric argument!");
                }
                return (Number(ARGS[0]) * -1);
            },
            help: "Reverses the sign of the numeric argument."
        },
        {
            name: "Or",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length == 0) {
                    return false;
                }
                return ARGS.Any(function (index, el) {
                    if (el) {
                        return true;
                    }
                    return false;
                });
            },
            help: "Checks if any argument is truthy"
        },
        {
            name: "IsEmpty",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("IsEmpty requires single argument!");
                } else {
                    if (ARGS[0] == null) {
                        return true;
                    } else if ((BaseObject.is(ARGS[0], "string") && /\S+/.test(ARGS[0])) ||
                        (BaseObject.is(ARGS[0], "object") && Object.keys(ARGS[0]).length > 0) ||
                        (BaseObject.is(ARGS[0], "Array") && ARGS[0].length > 0)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            help: "Checks if the argument is null or empty."
        },
        {
            name: "Slice",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 2) {
                    return Operation.Failed("Slice - incorrect number of arguments, 2 or 3 are expected!");
                } else {
                    var item = ARGS[0];
                    if (item != null && (BaseObject.is(item, "string") || BaseObject.is(item, "Array"))) {
                        var start = 0;
                        if (isNaN(ARGS[1])) { return Operation.Failed("Slice - start argument is not a number.") } else { start = Number(ARGS[1]); }

                        var end = item.length;
                        if (ARGS.length > 2 && ARGS[2] != null) {
                            end = Number(ARGS[2]);
                            if (isNaN(end)) return Operation.Failed("Slice - end argument is not a number.");
                        }
                        return item.slice(start, end);
                    } else {
                        return Operation.Failed("Slice - the first parameter can't be null or undefined!");
                    }
                }
            },
            help: "Returns a slice from a string."
        },
        {
            name: "Split",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 2) {
                    return Operation.Failed("Split - incorrect number of arguments, 2 are expected!");
                } else {
                    var item = ARGS[0];
                    var spliter = ARGS[1] != null ? ARGS[1] + "" : ",";
                    if (item != null) {
                        return (item + "").split(spliter);
                    } else {
                        return [];
                    }
                }
            },
            help: "Splits the first argument converted to string by comma or (if specified) the delimiter given by the second argument."
        },
        {
            name: "Length",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("Length - 1 argument expected!");
                } else {
                    var item = ARGS[0];
                    if (Array.isArray(item)) return item.length;
                    if (typeof item == "string") return item.length;
                    
                    return Operation.Failed("Length - Unsupported argument type!");
                    
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "Replace",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 3) {
                    return Operation.Failed("Replace - incorrect number of arguments, 3 or 4 are expected!");
                } else {
                    var item = ARGS[0];
                    var patt = ARGS[1];
                    var rep = ARGS[2];
                    if (item != null && BaseObject.is(item, "string")) {
                        if (ARGS[3] != null && ARGS[3]) {
                            return $__ReplaceAll(item, patt, rep); // TODO should not use regex
                        }
                        return item.replace(patt, rep);
                    } else {
                        return Operation.Failed("Replace - the first parameter must be a string!");
                    }
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "RegexReplace",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 3) {
                    return Operation.Failed("RegexReplace - incorrect number of arguments, 3 are expected!");
                } else {
                    var item = ARGS[0];
                    var patt = ARGS[1];
                    var rep = ARGS[2];
                    if (item != null && BaseObject.is(item, "string")) {
                        return $__ReplaceAll(item, patt, rep);
                    } else {
                        return Operation.Failed("RegexReplace - the first parameter must be a string!");
                    }
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "Trim",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("Trim requires 1 parameter!");
                } else {
                    var item = ARGS[0];
                    if (item != null && BaseObject.is(item, "string")) {
                        return item.trim();
                    } else {
                        return Operation.Failed("Trim - parameter must be a string!");
                    }
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "EncodeBase64",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("EncodeBase64 requires 1 parameter!");
                } else {
                    return btoa(UTF8Encoding.encodeToBinaryString(ARGS[0] + ""));
                }
            },
            help: "Encodes a string to Base64, transforms the string to UTF8 first. Compatible with most services not designed for Javascript."
        },
        {
            name: "DecodeBase64",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("DecodeBase64 requires 1 parameter!");
                } else {
                    return atob(UTF8Encoding.decodeFromBinaryString(ARGS[0]));
                }
            },
            help: "Decodes a string from Base64, treats the string as UTF8. Compatible with most services not designed for Javascript."
        },
        //#region Array ops
        {
            name: "ConsumeOne",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1 && BaseObject.is(ARGS[0], "Array")) {
                    return Operation.Failed("ConsumeOne takes one argument - an array!");
                } else {
                    var arr = ARGS[0];
                    if (arr.length > 0) {
                        return arr.splice(arr.length - 1,1);
                    }
                    return null;
                }
            },
            help: "Works with arrays only, removes and returns the last element of the array, null otherwise."
        },
        {
            name: "List",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                var arr = [];
                for (var i = 0; i < ARGS.length; i++) {
                    var el = ARGS[i];
                    if (el != null) {
                        if (BaseObject.is(el, "Array")) {
                            arr = arr.concat(el);
                        } else {
                            arr.push(el);
                        }
                    }
                }
                return arr;
            },
            help: "Creates and optionally fills an array with the elements passed after the first argument. If any argument is an array, its elements will be added and not the array as a single element."
        },
        {
            name: "IsList",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("IsArray requires 1 argument!");
                }
                return BaseObject.is(ARGS[0], "Array");
            },
            help: "Checks if the argument is an array."
        },
        {
            name: "ListAdd",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("ArrayPush requires at least 1 argument!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    for (var i = 1; i < ARGS.length; i++) {
                        var el = ARGS[i];
                        if (BaseObject.is(el, "Array")) {
                            arr = arr.concat(el);
                        } else {
                            arr.push(el);
                        }
                        
                    }
                    return arr;
                } else {
                    return Operation.Failed("ListAdd first argument must be an array!");
                }
            },
            help: "Adds elements to the end of the array. Called with single argument (the array only), does nothing. Returns the array."
        },
        {
            name: "ListGet",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 2) {
                    return Operation.Failed("ArrayGet requires 2 arguments!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    var index = ARGS[1];
                    if (BaseObject.is(index, "number")) {
                        if (index >= 0 && index < arr.length) {
                            return arr[index];
                        } else {
                            return Operation.Failed("ArrayGet - " + index + " is outside array boundaries!");
                        }
                    } else {
                        return Operation.Failed("ArrayGet second argument must be numeric!");
                    }
                } else {
                    return Operation.Failed("ArrayGet first argument must be an array!");
                }
            },
            help: "Returns the indexed element from the array."
        },
        {
            name: "ListInsert",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 3) {
                    return Operation.Failed("ArrayInsert requires 3 arguments!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    var index = ARGS[1];
                    if (BaseObject.is(index, "number")) { // TODO: Do we need to check if the index is inside array boundaries ?
                        arr.splice(index, 0, ARGS[2]); // TODO: Do we need to check if the argument is null ?
                        return arr;
                    } else {
                        return Operation.Failed("ListInsert second argument must be numeric!");
                    }
                } else {
                    return Operation.Failed("ListInsert first argument must be an array!");
                }
            },
            help: "Inserts an element into an array ListInsert(array, index, element), returns the list."
        },
        {
            name: "ListRemove",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("ArrayRemove requires some arguments!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    var indices = Array.createCopyOf(ARGS,1).sort(function(a,b) {if(a > b) return -1; if (a < b) return 1; return 0;});
                    for (var i = 0; i < indices.length; i++) {
                        var index = indices[i];
                        if (BaseObject.is(index, "number")) { // TODO: Do we need to throw an error if the index is not a number ?
                            arr.splice(index, 1); // TODO: Do we need to check if the index is inside array boundaries ?
                        }
                    }
                    return arr;
                } else {
                    return Operation.Failed("ListRemove first argument must be an array!");
                }
            },
            help: "Removes 0 or more elements from an array."
        },
        {
            name: "ListSet",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 3) {
                    return Operation.Failed("ArraySet requires 3 arguments!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    var index = ARGS[1];
                    if (BaseObject.is(index, "number")) {
                        if (index >= 0 && index < arr.length) {
                            arr[index] = ARGS[2]; // TODO: Do we need to check if the argument is null ?
                            return arr;
                        } else {
                            return Operation.Failed("ListSet - " + index + " is outside array boundaries!");
                        }
                    } else {
                        return Operation.Failed("ListSet second argument must be numeric!");
                    }
                } else {
                    return Operation.Failed("ListSet first argument must be an array!");
                }
            },
            help: "Sets an element in the array."
        },
        {
            name: "ListClear",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("ArrayClear requires 1 argument!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    arr.splice(0);
                    return arr;
                } else {
                    return Operation.Failed("ListClear first argument must be an array!");
                }
            },
            help: "Clears all the elements of an array. Return the array itself."
        },
        {
            name: "AsArray",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("AsArray requires 1 argument!");
                }
                var item = ARGS[0];
                if (item != null) {
                    var arr = [];
                    if (BaseObject.is(item, "object")) {
                        for (var key in item) {
                            arr.push(item[key]);
                        }
                    } else if (BaseObject.is(item, "Array")) {
                        for (var i = 0; i < item.length; i++) {
                            arr.push(item[i]);
                        }
                    } else {
                        arr.push(item);
                    }
                    return arr;
                } else {
                    return [];
                }
            },
            help: "... NO HELP!"
        },
        //#endregion
        //#region Object ops
        {
            name: "Object",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length > 0 && ARGS.length % 2 != 0) {
                    return Operation.Failed("Object accpets only even number of arguments!");
                }
                var obj = {};
                var length = ARGS.length / 2;
                for (var i = 0; i < length; i++) {
                    var key = ARGS[i * 2];
                    var value = ARGS[i * 2 + 1];
                    if (key != null) {
                        obj['' + key] = value;
                    } else {
                        return Operation.Failed("Object key is null!");
                    }
                }
                return obj;
            },
            help: "... NO HELP!"
        },
        {
            name: "IsObject",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("IsObject requires an argument!");
                }
                return BaseObject.is(ARGS[0], "object");
            },
            help: "... NO HELP!"
        },
        {
            name: "ObjectSet",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length % 2 == 0) {
                    return Operation.Failed("ObjectSet requires odd number of arguments!");
                }
                var obj = ARGS[0];
                if (BaseObject.is(obj, "object")) {
                    ARGS.splice(0, 1);
                    var length = ARGS.length / 2;
                    for (var i = 0; i < length; i++) {
                        var key = ARGS[i * 2];
                        var value = ARGS[i * 2 + 1];
                        if (key != null) {
                            obj['' + key] = value;
                        }
                    }
                    return obj;
                } else {
                    return Operation.Failed("ObjectSet first argument must be an object!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ObjectGet",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 2) {
                    return Operation.Failed("ObjectGet requires 2 arguments!");
                }
                var obj = ARGS[0];
                if (BaseObject.is(obj, "object")) {
                    var key = ARGS[1];
                    if (key != null) {
                        return obj['' + key];
                    } else {
                        return Operation.Failed("ObjectGet key is null!");
                    }
                } else {
                    return Operation.Failed("ObjectGet first argument must be an object!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ObjectClear",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("ObjectClear requires 1 argument!");
                }
                var obj = ARGS[0];
                if (BaseObject.is(obj, "object")) {
                    for (var key in obj) {
                        delete obj[key];
                    }
                    return obj;
                } else {
                    return Operation.Failed("ObjectClear argument must be an object!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ObjectRemoveExcept",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("ObjectRemoveExcept requires at least 1 argument!");
                }
                var obj = ARGS[0];
                if (BaseObject.is(obj, "object")) {
                    var preservekeys = ARGS.splice(0, 1);
                    for (var key in obj) {
                        if (preservekeys.indexOf(key) == -1) {
                            delete obj[key];
                        }
                    }
                    return obj;
                } else {
                    return Operation.Failed("ObjectRemoveExcept first argument must be an object!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "AsObject",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("AsObject requires at least 1 argument!");
                }
                var arg1 = ARGS[0];
                var arg2 = null;
                if (ARGS.length > 1) {
                    arg2 = ARGS[1];
                }
                var obj = {};
                if (BaseObject.is(arg1, "object")) { // Ignore the second argument entirely
                    for (var key in arg1) {
                        obj[key] = arg1[key];
                    }
                } else if (BaseObject.is(arg1, "Array") && BaseObject.is(arg2, "Array")) {
                    var keys = [];
                    for (var i = 0; i < arg1.length; i++) {
                        var el = arg1[i];
                        if (el != null) {
                            keys.push('' + el);
                        } // TODO: Do we need to throw an error if there is a null el ?
                    }

                    var values = [];
                    for (var j = 0; j < arg2.length; j++) {
                        values.push(arg2[j]);
                    }

                    var length = Math.min(keys.length, values.length);
                    for (var k = 0; k < length; k++) {
                        obj[keys[k]] = values[k];
                    }
                } else if (arg1 != null && arg2 != null) {
                    obj['' + arg1] = arg2;
                }
                return obj;
            },
            help: "... NO HELP!"
        },
        {
            name: "IsObjectCompatible",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("IsObjectCompatible requires at least 1 argument!");
                }
                var arg1 = ARGS[0];
                var arg2 = null;
                if (ARGS.length > 1) {
                    arg2 = ARGS[1];
                }
                if (BaseObject.is(arg1, "object") 
                || (BaseObject.is(arg1, "Array") && BaseObject.is(arg2, "Array")) 
                || (arg1 != null && arg2 != null)) {
                    return true;
                } else {
                    return false;
                }
            },
            help: "... NO HELP!"
        }
        //#endregion
    ])

})();