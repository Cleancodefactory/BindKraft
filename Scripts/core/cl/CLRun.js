(function() {

    function CLRun(_script, ctx) {
        BaseObject.apply(this, arguments);
        if (BaseObject.is(ctx, "ICommandContext")) {
            this.context = ctx;
        } else {
            this.context = CommandContext.Global();
        }
        
        if (this.$initRunner(_script)) {
            this.compile(_script);
        } else {
            this.LASTERROR("Cannot detect the script type");
        }
    }
    CLRun.Inherit(BaseObject, "CLRun");

    CLRun.$Langs = [];
    CLRun.AddLang = function(detect, compile, run) {
        var o = {
            detect: detect,
            compile: compile,
            run: run
        }
    }

    CLRun.prototype.$initRunner = function(source) {
        var b;
        for (var i = 0; i < CLRun.$Langs.length; i++) {
            var lang = CLRun.$Langs[i];
            b = lang.detect.call(this,source);
            if (b) {
                this.compile = lang.compile;
                this.run = lang.run;
                return true;
            }
        }
        return false;
    }

    //#region 
    CLRun.prototype.compile = function(source) {
        throw "Not initialized";
    }
    CLRun.prototype.run = function() {
        throw "Not initialized";
    }
    //#endregion

})();