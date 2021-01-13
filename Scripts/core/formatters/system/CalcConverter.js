(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");


function CalcConverter() {
	SystemFormatterBase.apply(this,arguments);
}
CalcConverter.Inherit(SystemFormatterBase,"CalcConverter");
CalcConverter.Implement(IArgumentListParserStdImpl,"trim");

CalcConverter.$parseExpression = function(expr) {
    if (expr == null || expr.length == 0) return null;
    function _trim(x) {
        if (x == null) return "";
        return x.replace(/(^\s+)|(\s+$)/g,"");
    }
    var arr = _trim(expr).split("|").Select(function(idx, item){
        if (item == "") return item;
        return _trim(item).split("&").Select(function(idx, item){
            if (item == "") return item;
            return _trim(item).split("+").Select(function(idx, item){
                if (item == "") return item;
                return _trim(item).split("-").Select(function(idx,item){
                    if (item == "") return item;
                    return _trim(item).split("/").Select(function(idx,item){
                        if (item == "") return item;
                        return _trim(item).split("*").Select(function(idx, item){ return _trim(item); });
                    });
                });
            });
        });
    });

    var prg = [];
    var ops = ["|", "&", "+", "-","/","*"];

    function _rec(a,l) {
        if (typeof a == "string") {
            if (a.charAt(0) == "!") {
                prg.unshift({ i: "!", o: 1});
                prg.unshift({ i: "push", o: a.slice(1)});
            } else if (a.charAt(0) == "#") {
            	prg.unshift({ i: "#", o: 1});
                prg.unshift({ i: "push", o: a.slice(1)});
            } else if (a.charAt(0) == "$") {
            	prg.unshift({ i: "$", o: 1});
                prg.unshift({ i: "push", o: a.slice(1)});
            } else {
                prg.unshift({ i: "push", o: a});
            }
        } else { // a is array
            if (a.length > 1) {
                prg.unshift({ i:ops[l], o: 2});
                for (var i = 0; i < a.length; i++) {
                    if (i > 0 && i < a.length - 1) prg.unshift({ i:ops[l], o: 2});
                    _rec(a[i], l + 1);
                }
            } else {
                _rec(a[0], l + 1);
            }
        }
    }
    _rec(arr,0);
    return prg;
}
CalcConverter.$execExpression = function(prg,resolver) {
    function _resolve(x) {
        if (x == null) return null;
        if (typeof x == "string") {
            if (/^(?:-|\+)?\d+$/.test(x)) {
                return parseInt(x,10);
            } else if (x == "true") {
                return 1;
            } else if (x == "false") {
                return 0;
            } else if (/^'(?:[^\']|\'\')*'$/.test(x)) {
                return x.replace("''","'").slice(1,-1);
            } else {
                if (typeof resolver == "function") {
                    return resolver(x);
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }
    if (BaseObject.is(prg, "Array")) {
        var st = [];
        for (var i = 0; i < prg.length; i++) {
            var instr = prg[i];
            var v;
            switch (instr.i) {
                case "push":
                    st.push(_resolve(instr.o));
                break;
                case "|":
                    st.push((st.pop() || st.pop())?1:0);
                break;
                case "&":
                    st.push((st.pop() && st.pop())?1:0);
                break;
                case "+":
                    st.push(st.pop() + st.pop());
                break;
                case "-":
                    st.push(st.pop() - st.pop());
                break;
                case "*":
                    st.push(st.pop() * st.pop());
                break;
                case "/":
                    st.push(st.pop() / st.pop());
                break;
                case "!":
                    st.push(!st.pop());
                break;
                case "#":
                    st.push(parseInt(st.pop(),10));
                break;
                case "$":
                    st.push(st.pop() + "");
                break;
                default:
                    throw "Error in CalcConverter formatter.";
            }
        }
        return st.pop();
    } else {
        return (resolver)?resolver("value"):null;
    }
}
CalcConverter.execExpression = function(expr,resolver) {
    var prg = this.$parseExpression(expr);
    return this.$execExpression(prg, resolver);
}
CalcConverter.prototype.Exec = function(val, bind, params) {
    function resolve(x) {
        if (x == "value") return val;
        if (x == "parameter") return bind.bindingParameter;
        if (x.indexOf("__") == 0) {
            return null; // reserved
        }
        return bind.getRef(x);
    }
	
	if (typeof params == "string" && params.length > 0) {
        return CalcConverter.execExpression(params,resolve);
    } else {
        return val;
    }
	
}
CalcConverter.prototype.Read = function(val, bind, params) {
    return this.Exec.apply(this,arguments);
}
CalcConverter.prototype.Write = function(val, bind, params) {
    return this.Exec.apply(this,arguments);
}

})();