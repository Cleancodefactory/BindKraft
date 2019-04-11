

/*CLASS*/
function InitializeMethodTrigger(desc, defval, pause) {
    Initialize.apply(this, arguments);
    this.type = "MethodTrigger";
    this.pause = (pause == null)?500:pause;
	this.active = true;
};
InitializeMethodTrigger.Inherit(Initialize, "InitializeMethodTrigger");
InitializeMethodTrigger.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    if (def != null) return new SpringTrigger(new Delegate(obj,def),this.pause);
    return null;
};
InitializeMethodTrigger.prototype.defValueDescription = function () {
    return {
        value: "",
        type: ((this.defaultValue != null) ? "(method)" : "")
    };
};

/* Ex:
	MyClass.prototype.trigger1 = new InitializeMethodTrigger("Some description", "dosomething", 500);
	MyClass.prototype.dosomething - functon() { ... }
	/// Somewhere else
	{ ....
		this.trigger1.windup();
	}
	

*/