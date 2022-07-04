(function () {
    var $__ReplaceAll = function (str, patt, rep) {
        var regex = new RegExp(patt, 'g');
        return str.replace(regex, rep);
    }

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
                    return Operation.Failed("Not all passed parameters are numbers!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "Concat",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                var sum = '';
                for (var i = 0; i < ARGS.length; i++) {
                    sum += ('' + ARGS[i]);
                }
                return sum;
            },
            help: "... NO HELP!"
        },
        {
            name: "Throw",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length > 0 && ARGS[0] != null) {
                    return Operation.Failed(ARGS[0]);
                } else {
                    return Operation.Failed("Exception raised intentionally from an CLLibrarie code!");
                }
            },
            help: "... NO HELP!"
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
            help: "... NO HELP!"
        },
        {
            name: "IsNumeric",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("IsNumeric requires 1 argument!");
                }
                return BaseObject.is(ARGS[0], "number");
            },
            help: "... NO HELP!"
        },
        {
            name: "Neg",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1 && BaseObject.is(ARGS[0], "number")) {
                    return Operation.Failed("Neg requires 1 numeric argument!");
                }
                return (ARGS[0] * -1);
            },
            help: "... NO HELP!"
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
            help: "... NO HELP!"
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
            help: "... NO HELP!"
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
                        var start = ARGS[1];
                        var end = item.length;
                        if (ARGS.length > 2 && ARGS[2] != null) {
                            end = ARGS[2];
                        }
                        return item.slice(start, end);
                    } else {
                        return Operation.Failed("Slice - the first parameter can't be null or undefined!");
                    }
                }
            },
            help: "... NO HELP!"
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
                    var spliter = ARGS[1];
                    if (item != null && BaseObject.is(item, "string")) {
                        return item.split(spliter);
                    } else {
                        return Operation.Failed("Split - the first parameter must be a string!");
                    }
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
                            return $__ReplaceAll(item, patt, rep);
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
                    if (BaseObject.is(ARGS[0], "string")) {
                        var str = ARGS[0];
                        var utf8 = [];
                        for (var i=0; i < str.length; i++) {
                            var charcode = str.charCodeAt(i);
                            if (charcode < 0x80) {
                                utf8.push(charcode);
                            } else if (charcode < 0x800) {
                                utf8.push(0xc0 | (charcode >> 6), 
                                          0x80 | (charcode & 0x3f));
                            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                                utf8.push(0xe0 | (charcode >> 12), 
                                          0x80 | ((charcode>>6) & 0x3f), 
                                          0x80 | (charcode & 0x3f));
                            } else {
                                i++;
                                charcode = ((charcode&0x3ff)<<10)|(str.charCodeAt(i)&0x3ff)
                                utf8.push(0xf0 | (charcode >>18), 
                                          0x80 | ((charcode>>12) & 0x3f), 
                                          0x80 | ((charcode>>6) & 0x3f), 
                                          0x80 | (charcode & 0x3f));
                            }
                        }
                        return btoa(utf8);
                    }
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "DecodeBase64",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("DecodeBase64 requires 1 parameter!");
                } else {
                    if (BaseObject.is(ARGS[0], "Array")) {
                        var array, out, len, i, c, char2, char3;
                        array = ARGS[0];
                        out = "";
                        len = array.length;
                        i = 0;
                        while (i < len) {
                            c = array[i];
                            i += 1;
                            switch (c >> 4)
                            { 
                                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                                    // 0xxxxxxx
                                    out += String.fromCharCode(c);
                                    break;
                                case 12: case 13:
                                    // 110x xxxx   10xx xxxx
                                    char2 = array[i];
                                    i += 1;
                                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                                    break;
                                case 14:
                                    // 1110 xxxx  10xx xxxx  10xx xxxx
                                    char2 = array[i];
                                    i += 1;
                                    char3 = array[i];
                                    i += 1;
                                    out += String.fromCharCode(((c & 0x0F) << 12) |
                                                ((char2 & 0x3F) << 6) |
                                                ((char3 & 0x3F) << 0));
                                break;
                            }
                        }
                    
                        return atob(out);
                    }
                }
            },
            help: "... NO HELP!"
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
                    var el = null;
                    if (arr.length > 0) {
                        el = arr[arr.length - 1];
                        arr.splice(arr.length - 1, 1);
                    }
                    return el;
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "Array",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                var arr = [];
                if (ARGS.length > 0) {
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
                }
                return arr;
            },
            help: "... NO HELP!"
        },
        {
            name: "IsArray",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("IsArray requires 1 argument!");
                }
                return BaseObject.is(ARGS[0], "Array");
            },
            help: "... NO HELP!"
        },
        {
            name: "ArrayPush",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("ArrayPush requires atleast 1 argument!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    for (var i = 1; i < ARGS.length; i++) {
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
                } else {
                    return Operation.Failed("ArrayPush first argument must be an array!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ArrayGet",
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
            help: "... NO HELP!"
        },
        {
            name: "ArrayInsert",
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
                        return arr.splice(index, 0, ARGS[2]); // TODO: Do we need to check if the argument is null ?
                    } else {
                        return Operation.Failed("ArrayInsert second argument must be numeric!");
                    }
                } else {
                    return Operation.Failed("ArrayInsert first argument must be an array!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ArrayRemove",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length < 1) {
                    return Operation.Failed("ArrayRemove requires some arguments!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    for (var i = 0; i < ARGS.length; i++) {
                        var index = ARGS[i];
                        if (BaseObject.is(index, "number")) { // TODO: Do we need to throw an error if the index is not a number ?
                            arr.splice(index, 1); // TODO: Do we need to check if the index is inside array boundaries ?
                        }
                    }
                    return arr;
                } else {
                    return Operation.Failed("ArrayRemove first argument must be an array!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ArraySet",
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
                            return Operation.Failed("ArraySet - " + index + " is outside array boundaries!");
                        }
                    } else {
                        return Operation.Failed("ArraySet second argument must be numeric!");
                    }
                } else {
                    return Operation.Failed("ArraySet first argument must be an array!");
                }
            },
            help: "... NO HELP!"
        },
        {
            name: "ArrayClear",
            alias: null,
            regexp: null,
            action: function (ARGS, api) {
                if (ARGS.length != 1) {
                    return Operation.Failed("ArrayClear requires 1 argument!");
                }
                var arr = ARGS[0];
                if (BaseObject.is(arr, "Array")) {
                    return arr.splice(0, arr.length);
                } else {
                    return Operation.Failed("ArrayClear first argument must be an array!");
                }
            },
            help: "... NO HELP!"
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