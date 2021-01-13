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
                return _trim(item).split("*");
            });
        });
    });

    var prg = [];
    var ops = ["|", "&", "+", "*"];

    function _rec(a,l) {
        if (typeof a == "string") {
            if (a.charAt(0) == "!") {
                prg.unshift({ i: "!", o: 1});
                prg.unshift({ i: "push", o: a.slice(1)});
            } else {
                prg.unshift({ i: "push", o: a});
            }
        } else { // a is array
            if (a.length > 1) {
                prg.unshift({ i:ops[l], o: 2});
                for (var i = 0; i < a.length; i++) {
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
    if (BaseObject.is(prg, "Array")) {
        var st = [];
        for (var i = 0; i < prg.length; i++) {
            var instr = prg[i];
            switch (instr.i) {
                case "push":
                    st.push(inst.o);
                break;
                case "|":
                    st.push(st.pop() || st.pop());
                break;
                case "&":
                    st.push(st.pop() && st.pop());
                break;
                case "+":
                    st.push(st.pop() + st.pop());
                break;
                case "*":
                    st.push(st.pop() * st.pop());
                break;
                default:
                    throw "Error in CalcConverter formatter.";
            }
        }
        return st.pop;
    } else {
        return (resolver)?resolver("value"):null;
    }
}
CalcConverter.execExpression = function(expr,resolver) {
    var prg = this.$parseExpression(expr);
    return this.$execExpression(prg, resolver);
}

CalcConverter.prototype.Read = function(val, bind, params) {
    var b = val ? true : false;
	
	if (params == "invert" || params == "inv" || params == "!") {
		b = !b;
	}
	return b;
}
CalcConverter.prototype.Write = function(val, bind, params) {
    var b = val ? true : false;
    if (typeof params == "string" && (params.toLowerCase() == "invert" || params.toLowerCase() == "inv" || params == "!")) {
		b = !b;
    }
    return b;

}

})();