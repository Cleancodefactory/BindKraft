


/*CLASS*/
// Under construction - will be finished later

function ArrayFilter() {
    Base.apply(this, arguments);
}

ArrayFilter.Inherit(Base, "ArrayFilter");
ArrayFilter.prototype.$program = null;
ArrayFilter.$priorityL = {
    ".not.": 0,
    ".and.": 1,
    ".or.": 2
};
ArrayFilter.$priorityC = {
    ".in.": 0,
    ".eq.": 1,
    ".lte.": 2,
    ".gte.": 2,
    ".lt.": 3,
    ".gt.": 3,
    ".not.": 4,
    ".and.": 5,
    ".or.": 6
};
ArrayFilter.prototype.$getMatchType = function(match) {
    if (match == null) return 0;
    for (var i = 1; i < match.length; i++) {
        if (match[i] != null && match[i].length > 0) return i;
    }
    return 0;
};
ArrayFilter.prototype.$parseQuery = function(qry) {

    function _error(s) {
        jbTrace.log(s);
        return false;
    }

// 1= C bi, 2= C un postfix, 3= L bi, 4= L un prefix, 5= value operand, 6= start group, 7= end group
    var reTokenizer = /(\.gt\.|\.lt\.|\.lte\.|\.gte\.|\.eq\.|\.in\.)|(\.notnull|\.empty|\.isnull)|(\.and\.|\.or\.)|(not\.)|(?:\[?([a-zA-Z0-9_ ]+)\]?)|(\()|(\))/g;
    var match, opStack = [], vStack = [], mt;

    function optop() {
        if (opStack.length > 0) {
            return opStack[opStack.length - 1];
        } else {
            return null;
        }
    }

    while ((match = reTokenizer.exec(qry)) != null) {
        mt = this.$getMatchType(match);
        switch (mt) {
        case 1:
// Compare binary
            if (vStack.length == 0) return _error("no left argument for " + match[1]);
            opStack.push({ t: 1, p: match[1], p: 1 });
            break;
        }
    }

};
//// END DATA UTILITIES ////