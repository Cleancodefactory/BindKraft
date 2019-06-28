/*
    File: Array.js
    Contains Array additions.
*/

//// ARRAY ADDITIONS PART ONE ///////////////////////////
// We need this here, because it is used even in the most basic definitions.

Array.prototype.FirstIndexOf = function (el) {
    for (var i = 0; i < this.length; i++) {
        try {
            if (this[i] == el) return i;
        } catch (e) {
            /*swallow*/
        }
    }
    return -1;
}.Description ("Returns index of the searched element. Search is performed using trivial == operation.")
 .Param("el","Searched element")
 .Returns("index or -1 if not found");

Array.prototype.findElement = function (el, startIndex) {
    for (var i = ((startIndex != null)?startIndex:0); i < this.length; i++) {
        try {
            if (BaseObject.equals(this[i], el)) return i;
        } catch (e) {
            /*swallow*/
        }
    }
    return -1;
}.Description ("Returns index of the searched element. Search is performed using equals BaseObject method or through native comparison for built-in types.")
 .Param("el","Searched element")
 .Returns("index or -1 if not found");

Array.prototype.getElement = function (el, parallelArray) {
    var n = this.findElement(el);
    if (n >= 0) {
        if (parallelArray != null && parallelArray.length > n) {
            return parallelArray[n];
        } else {
            return this[n];
        }
    }
    return null;
}.Description ("Returns the element or its counterpart")
 .Param("el","The element being searched.")
 .Param("parallelArray","...")
 .Returns("object or null if not found");

Array.prototype.removeElement = function (el, parallelArray) {
    var i = this.findElement(el);
    var r;
    if (i >= 0) {
        r = this.splice(i, 1);
        if (r.length > 0) {
            if (parallelArray != null && parallelArray.length > i) {
                parallelArray.splice(i,1);
            }
            return r[0];
        }
    }
    return null;
}.Description ("Removes element from array")
 .Param("el","Element to be removed")
 .Param("parallelArray","...")
 .Returns("Object or null");

Array.prototype.replaceElement = function (el, newel, parallelArray, parallelElement) {
    var i = this.findElement(el);
    var r;
    if (i >= 0) {
        if (newel != null) {
            r = this.splice(i, 1, newel);
            if (parallelArray != null && parallelArray.length > i) {
                parallelArray.splice(i, 1, parallelElement);
            }
        } else {
            r = this.splice(i, 1);
            if (parallelArray != null && parallelArray.length > i) {
                parallelArray.splice(i, 1);
            }
        }
        if (r.length > 0) return r[0];
    }
    return null;
}.Description ("...")
 .Param("el", "...")
 .Param("newel", "...")
 .Param("parallelArray", "...")
 .Param("parallelElemen", "...")
 .Returns("Object or null");

Array.prototype.sortElements = function () {
    this.sort(BaseObject.compare);
}.Description("Custom sort...");

Array.prototype.sortEx = function (proc, param) {
    var _proc = ((proc != null)?proc: BaseObject.compare);
    if (arguments.length >= 2) { // We have parameter for the comparer
        this.sort(function(x,y) {
            return _proc(x,y,param);
        });
    } else {
        this.sort(proc);
    }
}.Description("...")
 .Param("proc","...")
 .Param("param","...");
 
// Adds the element assuming the array is ordered. Goes through the elements from 0 up and adds the element before
// the first element that is less than the one being added. If none is the element is appdended in the end of the array.
// Note that this feature may be efficient, but can be easilly broken if other methods are used to add elements.
// !!! Use with care and only in controlled, hidden from the rest of the code arrays.
Array.prototype.addOrderedElement = function (el, parallelArray, parallelElement) {
    if (el != null) {
        // If the element exists it is removed first
        var oldel = this.removeElement(el,parallelArray); // For consistency we will return false if the element existed regardless of the fact that we will reorder it.
        var c;
        for (var i = 0; i < this.length; i++) {
            if (BaseObject.compare(el, this[i]) < 0) {
                // Append it here and exit
                this.insertElement(el,i,parallelArray, parallelElement);
                if (oldel != null) return false;
                return true; // See the comment above to understand the return result.
            }
        }
        // Need to append it
        this[this.length] = el;
        if (parallelArray != null) {
            parallelArray[this.length] = parallelElement;
        }
        return true;
    }
    return false;
}.Description ( "Adds an object before the first element that is less than the one being added, assuming the array is ORDERED." )
 .Param ( "el", "object to be added" )
 .Param ( "parallelArray", "" )
 .Param ( "parallelElement", "" )
 .Returns ( "true or false" );

Array.prototype.addElement = function (el, parallelArray, parallelElement) {
    if (el != null && this.replaceElement(el, el) == null) {
        this[this.length] = el;
        if (parallelArray != null) {
            parallelArray[this.length] = parallelElement;
        }
        return true;
    }
    return false;
}.Description("Adds object to the current array")
 .Param("el","...")
 .Param("parallelArray","...")
 .Param("parallelElement","...")
 .Returns("true or false");

Array.prototype.insertElement = function (el, pos, parallelArray, parallelElelment) {
    var _pos = pos != null ? pos : 0;
    if (el != null && this.replaceElement(el, el) == null) {
        for (var i = this.length - 1; i >= _pos; i--) {
            this[i + 1] = this[i];
            if (parallelArray != null) {
                parallelArray[i+1] = parallelArray[i];
            }
        }
        if (_pos <= this.length) {
            this[_pos] = el;
            if (parallelArray != null) {
                parallelArray[_pos] = parallelElement;
            }
        } else {
            this[this.length] = el;
            if (parallelArray != null) {
                parallelArray[this.length] = parallelElement;
            }
        }
        return true;
    }
    return false;
}.Description("Inserts element at position")
 .Param("el","element to be inserted")
 .Param("pos","position where the element should be inserted. If not passed, 0 is assumed.")
 .Param("parallelArray","...")
 .Param("parallelElelment","")
 .Returns("true or false");

Array.prototype.lastElement = function () {
    if (this.length > 0) return this[this.length - 1];
    return null;
}.Description ( "Returns last element of the array")
 .Returns("object or null");
 
 //+VERSION 1.5
 Array.prototype.addElements = function(els, parallelArray,parallelElelments) {
     var added = 0;
     if (els != null) {
         for (var i = 0; i < els.length; i++) {
             if (this.addElement(els[i], parallelArray, (parallelElelments != null)?parallelElelments[i]:null)) {
                 added ++;
             }
         }
     }
     return added;
 }
 //-VERSION 1.5

Array.prototype.obliterate = function(bFull) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (bFull && (BaseObject.is(this[i], "BaseObject") || BaseObject.is(this[i], "Array"))) {
            if (typeof this[i].obliterate == "function") this[i].obliterate(bFull);
        }
        delete this[i];
    }
    // We need also for-in - it is faster in two steps
    for (var i in this) {
        if (bFull && (BaseObject.is(this[i], "BaseObject") || BaseObject.is(this[i], "Array"))) {
            if (typeof this[i].obliterate == "function") this[i].obliterate(bFull);
        }
        delete this[i];
    }
}.Description("bFull obliterates everything in chain, without it the object simply detaches all the references, with bFull the destruction is chained")
 .Param("bFull","boolean");

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = Array.prototype.findElement;
}

function newObjectArray() {
    return new Array();
};
/*CLASS*/
Array.createCopyOf = function(arr, start_index, end_index) {
    if (arr == null) return [];
    var a = [];
    if (BaseObject.is(arr, "Array") || arr.length != null) {
        var _start = (start_index == null)?0:start_index;
        var _end = (end_index != null && end_index <= arr.length)?end_index:arr.length;
        for (var i = _start; i < _end; i++) a.push(arr[i]);
    } else {
        for (var i in arr) {
            a.push(arr[i]);
        }
    }
    return a;
}.Description("Returns a copy of an array")
 .Param("arr","Array to be copied")
 .Param("start_index","Start index, index of the first element to copy")
 .Param("end_index","End index, index of the last element to copy")
 .Returns("array");

Array.prototype.parent = null;
Array.classType = "Array";

Array.prototype.classType = function () {
    return this.constructor.classType;
}.Description("Returns the class type of the class")
 .Returns("string");

Array.prototype.inherits = function (cls) {
    if (this.classType() == cls) return true;
    return false;
}.Description("Checks if the class type equals to class ")
 .Param("cls","Class type to test against")
 .Returns("true or false");

Array.interfaces = { PArray: true };

Array.prototype.supports = function (prot) {
    if (this.constructor.interfaces[prot]) return true;
    return false;
}.Description("Checks if the class is supporting a Interface")
 .Param("prot","Interface to check against")
 .Returns("true or false");

Array.prototype.is = function (clsOrProt) {
    var t = clsOrProt;
    if (BaseObject.typeOf(clsOrProt) != "string") {
        t = BaseObject.typeOf(clsOrProt);
    }
    if (this.inherits(t)) return true;
    if (this.supports(t)) return true;
    return false;
}.Description("Checks if the object is descendant of a class or prototype")
 .Param("clsOrProt","Class or prototype to check against")
 .Returns("true or false");

Array.prototype.fullClassType = function (childClasses) {
    var s = childClasses ? childClasses : "";
    s = this.classType() + ((s.length > 0) ? ("::" + s) : "");
    return s;
}.Description("Returns the full class type of the object")
 .Param("childClasses","...")
 .Returns("string");

//Array.prototype.toString = function (r) {
//    return "[" + this.fullClassType + "]";
//};
Array.prototype.equals = function (obj) {
    if (obj == null) return false;
    if (this.fullClassType() != BaseObject.fullTypeOf(obj)) return false;
    if (obj.length != this.length) return false;
    try {
        for (var i = 0; i < this.length; i++) {
            if (this[i] != null) {
                if (!this[i].equals(obj[i])) return false;
            } else {
                if (obj[i] != null) return false;
            }
        }
    } catch (e) {
        return false;
    }
    return true;
}.Description("...")
 .Param("obj","...")
 .Returns("true or false");

Array.prototype.compareTo = function (obj) {
    throw loc_CompareNotImplemented + ' ' + this.fullClassType();
}.Description("Not Implemented")
 .Param("obj","...");

Array.prototype.copyFrom = function (o) {
    var i;
//    for (i in o) {
//        if (typeof (o[i]) != "function") {
//            this[i] = o[i];
//        }
//    }
    for (i = 0; i < o.length; i++) {
        this.push(o[i]);
    }
}.Description("Copies a passed array to the current one")
 .Param("o","Array to be copied");
Array.prototype.ProjectAs = function(fromKeys, toKeys, originalKey, start, len) {
    var fk = null;
    if (BaseObject.is(fromKeys,"Array")) {
        fk = fromKeys;
    } else if (typeof fromKeys == "string") {
        fk = fromKeys.split(",");
    }
    var tk = null;
    if (BaseObject.is(toKeys,"Array")) {
        tk = toKeys;
    } else if (typeof toKeys == "string") {
        tk = toKeys.split(",");
    } else if (toKeys == null) {
        tk = fk;
    }
    var _start = start || 0;
    var _len = len || this.length;
    var result = [];
    var o;
    for (var i = _start; i < _len; i++) {
        o = {};
        for (var j = 0; j < fk.length && j < tk.length; j++) {
            if (fk[j] != null && tk[j] != null) {
                o[tk[j]] = this[i][fk[j]];
            }
        }
        result.push(o);
        if (originalKey != null) {
            o[originalKey] = this[i];
        }
    }
    return result;
}
Array.prototype.clone = function () {
    var o = new this.constructor();
    o.copyFrom(this);
    return o;
}.Description("Clones the current array")
 .Returns("array, may be empty");
Array.prototype.Append = function(args) {
    var arg = null;
    for (var i = 0; i < arguments.length; i++) {
        arg = arguments[i];
        if (BaseObject.is(arg, "Array")) {
            for (var j =0 ; j < arg.length; j++) {
                this.push(arg[j]);
            }
        } else {
            this.push(arg);
        }
    }
}
Array.prototype.safeJoin = function (delim) {
    var s = "";
    for (var i = 0; i < this.length; i++) {
        if (s.length > 0) s += delim;
        if (this[i] != null) {
            if (this[i].toString != null) {
                s += this[i];
            } else {
                s += "[unknown object]";
            }
        } else {
            s += "[null]";
        }
    }
}.Description("Joins the current array with a specified delimiter")
 .Param("delim","Delimiter to separate the elements of the array");

Array.prototype.injectIndexInData = function (propName) {
    if (BaseObject.is(propName, "string")) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] != null && typeof this[i] == "object") this[i][propName] = i;
        }
    }
}.Description("injects the item index in the data");

Array.prototype.activeFilter = function (el) { return true; };
Array.prototype.get_filteredView = function () {
    var arr = [];
    if (BaseObject.is(this.activeFilter, "Delegate")) {
        for (var i = 0; i < this.length; i++) {
            if (this.activeFilter.invoke(this[i])) {
                arr.push(this[i]);
            }
        }
    } else {
        for (var i = 0; i < this.length; i++) {
            if (this.activeFilter(this[i])) {
                arr.push(this[i]);
            }
        }
    }
    return arr;
}.Description("...")
 .Returns("array, may be empty");

// Query tools
Array.prototype.Select = function (callback) {
    var arr = [];
    var el;
    for (var i = 0; i < this.length; i++) {
        el = this[i];
        if (BaseObject.is(callback, "Delegate")) {
            el = callback.invoke(i, this[i]);
        } else if (typeof callback == "function") {
            el = callback.call(this,i,el);
        } else if (BaseObject.is(callback, "BaseObject")) {
            if (!BaseObject.equals(this[i], callback)) {
                el = null;
            }
        } else if (callback != null) {
            if (this[i] != callback) el = null;
        }
        if (el != null) arr.push(el);
    };
    return arr;
}.Description("Creates new array with elements returned by a callback function or ampty array")
 .Param("callback", "Callback to be executed on every element of the current array")
 .Returns("array, may be empty");
 Array.prototype.Each = function(callback) {
    var el;
    for (var i = 0; i < this.length; i++) {
        el = this[i];
        if (BaseObject.is(callback, "Delegate")) {
            callback.invoke(i, el);
        } else if (typeof callback == "function") {
            callback.call(this,i,el);
        } 
    }
}.Description("Calls the callback for each element of the array")
	.Param("callback","The callback - Delegate or function (this is the array), function(elementindex, element)");
Array.prototype.All = function(callback) {
    var el;
    for (var i = 0; i < this.length; i++) {
        el = this[i];
        if (BaseObject.is(callback, "Delegate")) {
            if (!callback.invoke(i, el)) return false;
        } else if (typeof callback == "function") {
            if (!callback.call(this,i,el)) return false;
        } else if (BaseObject.is(callback, "BaseObject")) {
            if (!BaseObject.equals(el, callback)) {
                return false;
            }
        } else if (callback != null) {
            if (el != callback) return false;
        }
    };
    return true;
}
Array.prototype.Any = function(callback) {
    var el;
    for (var i = 0; i < this.length; i++) {
        el = this[i];
        if (BaseObject.is(callback, "Delegate")) {
            if (callback.invoke(i, el)) return true;
        } else if (typeof callback == "function") {
            if (callback.call(this,i,el)) return true;
        } else if (BaseObject.is(callback, "BaseObject")) {
            if (BaseObject.equals(el, callback)) {
                return true;
            }
        } else if (callback != null) {
            if (el == callback) return true;
        }
    };
    return false;
}
Array.prototype.FirstOrDefault = function (callback) {
    var o;
    if (callback == null) {
        if (this.length > 0) return this[0];
        return null;
    } else {
        var el;
        for (var i = 0; i < this.length; i++) {
            el = this[i];
            if (BaseObject.is(callback, "Delegate")) {
                el = callback.invoke(i, this[i]);
            } else if (typeof callback == "function") {
                el = callback.call(this,i,el);
            } else if (BaseObject.is(callback, "BaseObject")) {
                if (!BaseObject.equals(this[i], callback)) {
                    el = null;
                }
            } else if (callback != null) {
                if (this[i] != callback) el = null;
            }
            if (el != null) return el;
        };
        return null;
    }
}.Description("Creates new array with elements returned by a callback function or null")
 .Param("callback","Callback to be executed on every element of the current array")
 .Returns("array or null");

Array.prototype.On = function (fieldOrCallback) {
    var arr = this.Select();
    arr.$On = fieldOrCallback;
    return arr;
}.Description("...")
 .Param("fieldOrCallback","...")
 .Returns("array, may be empty");

Array.CombineObjects = BaseObject.CombineObjects;
Array.prototype.OrderBy = function () { // var x = array.OrderBy({field1: 1},{field2: -1});
    var r = this;
    var dirs = arguments;
    return r.sort(function (e1, e2) {
        var c = 0;
        for (var i = 0; i < dirs.length; i++) {
            var o = dirs[i], dir = 1;
            var o1, o2;
            for (var f in o) {
                dir = o[f];
                if (e1 == null) {
                    c = (-1 * dir);
                    break;
                }
                if (e2 == null) {
                    c = (1 * dir);
                    break;
                }
                o1 = e1[f]; o2 = e2[f];
                if (o1 == null) {
                    c = (-1 * dir);
                    break;
                }
                if (o2 == null) {
                    c = (-1 * dir);
                    break;
                }
                if (BaseObject.is(o1, "BaseObject")) {
                    c = o1.compareTo(o2) * dir;
                    break;
                } else if (BaseObject.is(o2, "BaseObject")) {
                    c = -o1.compareTo(o2) * dir;
                    break;
                } else {
                    try {
                        c = (((o1 > o2) ? 1 : ((o2 > o1) ? -1 : 0)) * dir);
                        break;
                    } catch (e) {
                        return -1;
                    }
                }
                break;
            }
            if (c != 0) return c;
        }
        return c;
    });
}.Description("...")
 .Returns("...");

Array.prototype.Join = function (arr) {
    if (arr != null) {
        var r = [];
        if (this.$On) {
            var t;
            if (BaseObject.is(this.$On, "string")) {
                if (this.$On == "#") {
                    for (var i = 0; i < this.length; i++) {
                        r.push(Array.CombineObjects(this[i], arr[i]));
                    }
                } else {
                    for (var i = 0; i < this.length; i++) {
                        for (var j = 0; j < arr.length; j++) {
                            if (this[i] != null && arr[j] != null && this[i][this.$On] != null && arr[j][this.$On] && this[i][this.$On] == arr[j][this.$On]) {
                                r.push(Array.CombineObjects(this[i], arr[j]));
                            }
                        }
                    }
                }
            } else if (BaseObject.is(this.$On, "Delegate")) {
                for (var i = 0; i < this.length; i++) {
                    for (var j = 0; j < arr.length; j++) {
                        t = this.$On.invoke(this[i], arr[j]);
                        if (t != null) r.push(t);
                    }
                }
            } else if (typeof this.$On == "function") {
                for (var i = 0; i < this.length; i++) {
                    for (var j = 0; j < arr.length; j++) {
                        t = this.$On.call(this, this[i], arr[j]);
                        if (t != null) r.push(t);
                    }
                }
            } else {
                return this;
            }
        } else {
            var r = [];
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    r.push(Array.CombineObjects(this[i], arr[j]));
                }
            }
        }
        return r;
    } else {
        return this;
    }
}.Description("...")
 .Param("arr","...")
 .Returns("");

Array.prototype.Combine = function (arr) {
    if (arr != null) {
        if (this.$On) {
            var f = this.$On;
            if (BaseObject.is(f, "Delegate")) {
                this.$On = function (el1, el2) {
                    if (f.invoke(el1, el2)) {
                        return Array.CombineObjects(el1, el2);
                    }
                    return null;
                };
            } else if (typeof f == "function") {
                this.$On = function (el1, el2) {
                    if (f.call(this, el1, el2)) {
                        return Array.CombineObjects(el1, el2);
                    }
                    return null;
                };
            } else {
                return this.Join(arr);
            }
            return this.Join(arr);
        }
    }
    return this;
}.Description("...")
 .Param("arr","...")
 .Remarks("Could be chained");

Array.prototype.Delete = function (callback) {
    var o, b;
    for (var i = this.length - 1; i >= 0; i--) {
        b = false;
        if (BaseObject.is(callback, "Delegate")) {
            b = callback.invoke(i, this[i]);
        } else if (typeof callback == "function") {
            b = callback.call(this, i, this[i]);
        } else if (BaseObject.is(callback, "BaseObject")) {
            if (BaseObject.equals(this[i], callback)) {
                b = true;
            }
        } else if (callback != null) {
            if (this[i] == callback) b = true;
        }
        if (b) {
            this.splice(i, 1);
        } else {
            // TODO: We should remove this code!!!
            /*o = this[i];
            if (BaseObject.is(o, "Array")) {
                o.Delete(callback);
            } else if (o != null && typeof o == "object" && o.Delete != null) {
                o.Delete(callback);
            }*/
        }
    }
    return this;
}.Description("...")
 .Param("callback","Callback to be executed on every element of the current array")
 .Returns("...")
 .Remarks("Could be chained");

Array.prototype.Update = function (callback, bobjects) {
    var o;
    for (var i = this.length - 1; i >= 0; i--) {
        if (BaseObject.is(callback, "Delegate")) {
            callback.invoke(i, this[i]);
        } else if (typeof callback == "function") {
            callback.call(this, i, this[i]);
        }
        
        o = this[i];
        if (BaseObject.is(o, "Array")) {
            o.Update(callback);
        } else if (bobjects && o != null && typeof o == "object" && o.Update != null) {
            o.Update(callback);
        }
    }
    return this;
}.Description("Changes the value of an element of the current array based on the result of a callback function")
 .Param("callback","Callback to be executed on every element of the current array")
 .Returns("...")
 .Remarks("Could be chained");

Array.prototype.Aggregate = function (callback) {
    var result = null;
    for (var i = this.length - 1; i >= 0; i--) {
        if (BaseObject.is(callback, "Delegate")) {
            result = callback.invoke(i, this[i], result);
        } else if (typeof callback == "function") {
            result = callback.call(this, i, this[i], result);
        }
    }
    return result;
}.Description("...")
 .Param("callback","Callback to be executed on every element of the current array")
 .Returns("...");
 
Array.prototype.toQuotedString = function () {
    var arr = this.Select(function (idx, item) {
        if (item != null && item.toString) {
            return ("'" + item.toString().replace("'", "''") + "'");
        }
        return null;
    });
    return arr.join(",");
}.Description("Returns a string with all elements of the current array, surrounded with single quotes")
 .Returns("string");
