(function() {

    function CLRun(_script, ctx) {
        BaseObject.apply(this, arguments);
        if (BaseObject.is(ctx, "ICommandContext")) {
            this.context = ctx;
        } else {
            this.context = CommandContext.Global();
        }
        
        if (!this.$initRunner(_script)) {
            this.LASTERROR("Cannot detect the script type");
            this.$recognized = false;
        } else {
            this.$recognized = true;
        }
        this.script = _script;
    }
    CLRun.Inherit(BaseObject, "CLRun");
    CLRun.ImplementProperty("timelimit", new InitializeNumericParameter("Execution time limit, null - unlimited", null));

    CLRun.$Langs = [];
    /**
     * 
     * @param {*} detect - method for detecting if the script is of this type
     * @param {*} compile - compile the script to some object and return it
     * @param {*} run - run the script by having the object and context passed
     */
    CLRun.AddLang = function(detect, compile, run) {
        var o = {
            detect: detect,
            compile: compile,
            run: run
        }
    }
    CLRun.prototype.$recognized = false;
    CLRun.prototype.get_recognized = function() {
        return this.$recognized;
    }
    CLRun.prototype.$initRunner = function(source) {
        var b;
        for (var i = 0; i < CLRun.$Langs.length; i++) {
            var lang = CLRun.$Langs[i];
            b = lang.detect.call(this,source);
            if (b) {
                this.$compile = lang.compile;
                this.$run = lang.run;
                return true;
            }
        }
        return false;
    }

    //#region Compile and run
    CLRun.prototype.script = null;
    CLRun.prototype.context = null;
    CLRun.prototype.program = null; // Compiled program
    CLRun.prototype.errors = new InitializeArray("Compile-time errors are reported here.");
    CLRun.prototype.compile = function() {
        this.errors.splice(0);
        var program = this.$compile(this.script);
        if (this.errors.length > 0 || program == null) return null;
        this.program = program;
        return program;
    }
    CLRun.prototype.run = function(/* specific arguments */) {
        if (this.program === null) {
            this.program = this.compile(this.script);
        }
        if (this.program != null) {
            var args = Array.createCopyOf(arguments);
            return this.$run(this.program, this.context, args);
        } else {
            this.LASTERROR("Can't compile program", "run");
            return Operation.Failed("Can't compile program");
        }
    }
    //#endregion

    //#region Lang specific methods
    CLRun.prototype.$compile = function(source) {
        throw "CLRun not initialized";
    }
    CLRun.prototype.$run = function() {
        throw "CLRun not initialized";
    }
    //#endregion



    //#region internal registrations

    CLRun.AddLang( // Null lang
        function(script) { // detect
            if (/^\s*#clnull\s+/.test(script)) {
                return true;
            }
            return false;
        },
        function(script) { // compile
            this.program = null;
            var compiler = new CLNullLang();
            var runner = compiler.compile(script);
            if (runner.$buildError != null) {
                this.errors.push(runner.$buildError);
                return null;
            }
            this.runner = runner;
            return runner;
        },
        function(runner, context, constants) { // run
            return runner.execute(context, constants);
        }
    );
    // This one must be last!
    CLRun.AddLang( // CL Commander
        function(script) { // detect
            if (!/^\s*#/.test(script)) {
                return true;
            }
            return false;
        },
        function(script) { // compile
            this.program = script;
            
            return script;
        },
        function(runner, context, constants) { // run
            if (context != null) {
                return Commander.RunInContext(this.program, context);
            } else {
                return Commander.runGlobal(this.program);
            }
            
        }
    )

    //#endregion

})();