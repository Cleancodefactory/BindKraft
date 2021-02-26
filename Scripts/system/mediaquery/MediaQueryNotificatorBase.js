(function() {

    var IMediaQueryNotificator = Interface("IMediaQueryNotificator");

    /**
     * @param {MediaDeviceInfo} tracker The media tracker root object.
     */
    function MediaQueryNotificatorBase(tracker, name) {
        BaseObject.apply(this,arguments);
        this.$tracker = tracker;
        this.$name = name;
    }
    MediaQueryNotificatorBase.Inherit(BaseObject, "MediaQueryNotificatorBase")
        .Implement(IMediaQueryNotificator);


    MediaQueryNotificatorBase.prototype.obliterate = function() {
        this.matchevent.removeAll();
        this.unmatchevent.removeAll();
        BaseObject.prototype.obliterate.appply(this, arguments);
    }


    MediaQueryNotificatorBase.prototype.$tracker = null;
    MediaQueryNotificatorBase.prototype.$parseExpression = function(expr) {
        if (expr == null || expr.length == 0) return null;
        function _trim(x) {
            if (x == null) return "";
            return x.replace(/(^\s+)|(\s+$)/g,"");
        }
        var arr = _trim(expr).split("|").Select(function(idx, item){
            if (item == "") return item;
            return _trim(item).split("&").Select(function(idx, item){
                return _trim(item);
            });
        });
    
        var prg = [];
        var ops = ["|", "&"];
    
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
    MediaQueryNotificatorBase.prototype.$execExpression = function(prg,resolver) {
        function _resolve(x) {
            if (x == null) return null;
            if (typeof x == "string") {
                if (x == "true") {
                    return true;
                } else if (x == "false") {
                    return false;
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
                        st.push((st.pop() || st.pop())?true:false);
                    break;
                    case "&":
                        st.push((st.pop() && st.pop())?true:false);
                    break;
                    case "!":
                        st.push(!st.pop());
                    break;
                    default:
                        throw "Error in expression.";
                }
            }
            return st.pop();
        } else {
            return false;
        }
    }
    MediaQueryNotificatorBase.prototype.$program = null;
    MediaQueryNotificatorBase.prototype.$queryResolver = new InitializeMethodCallback("checks the media queries in the tracker by name", function(name) {
        var alt = false;
        if (name != null && name.charAt(name.length - 1) == "?") {
            name = name.slice(0,name.length - 1);
            alt = true;
        }
        if (this.$tracker != null) {
            // TODO: Extend to check if media query really exists and throw err if needed.
            if (!this.$tracker.exists(name)) {
                this.LASTERROR("The media query " + name + " is not registered. The condition expression is: " + this.$condition);
                return alt;
            }
            return this.$tracker.checkQuery(name);
        }
        return false;
    });
    MediaQueryNotificatorBase.prototype.execExpression = function(expr,resolver) {
        if (this.$program == null && typeof expr == "string") {
            this.$program = this.$parseExpression(expr);
        }
        if (BaseObject.is(this.$program, "Array")) {
            return this.$execExpression(this.$program, resolver);
        }
        return false;
    }
    MediaQueryNotificatorBase.prototype.$condition = "";
    /**
     * 
     * 
     * 
     * Examples: qry1 & !qry2 | qry3
     */
    MediaQueryNotificatorBase.prototype.setConditions = function(conditions) {
        this.$program = null;
        this.$condition = conditions;
        this.$program = this.$parseExpression(conditions);
    }
    MediaQueryNotificatorBase.prototype.exec = function(expression) {
        var expr = expression || null;
        return this.execExpression(expr, this.$queryResolver);
    };

    //#region Called by the tracker to initiate notifications if necessary
    MediaQueryNotificatorBase.prototype.$lastMediaState = null;
    MediaQueryNotificatorBase.prototype.onMediaChanged = function(force) {
        var result = this.exec();
        if (result !== this.$lastMediaState || force) {
            // Initiate notification
            this.OnMediaStateChanged(result);
            this.$lastMediaState = result;
        }
    }
    /**
     * @param {boolean} matchingUnMatching True if the state changes from non-matching to matching and false otherwise
     */
    MediaQueryNotificatorBase.prototype.OnMediaStateChanged = function(matchingUnMatching) {
        if (matchingUnMatching) {
            this.matchevent.invoke(this, this.$name);
        } else {
            this.unmatchevent.invoke(this, this.$name);
        }
        // TODO: Base notification caps and let inheriting classes to do more.
    }
    
    //#endregion
})();