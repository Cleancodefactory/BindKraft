(function(){

    var Base = Class("Base");

    function PulsarElement() {
        Base.apply(this,arguments);
    }
    PulsarElement.Inherit(Base, "PulsarElement")
        .Implement(ICustomParameterizationStdImpl)
        .ImplementProperty("timeout", new InitializeNumericParameter("timeout between pulses", 500))
        .ImplementProperty("pulses", new InitializeNumericParameter("number of pulses", 1))
        .ImplementProperty("bindingflags", new InitializeStringParameter("Trigger update on all bindings with those flags. Default null - none", null))
        .ImplementProperty("bindingnames", new InitializeStringParameter("Trigger update on all bindings with those names. Default null - none", null));


    PulsarElement.prototype.pulseevent = new InitializeEvent("Pulse event");

    PulsarElement.prototype.$pulse = false;
    PulsarElement.prototype.get_pulse = function() {
        return this.$pulse;
    }
    PulsarElement.prototype.set_pulse = function(v) {
        if (v) {
            this.pulse();
        } else {
            this.$stopPulsing();
        }
    }
    PulsarElement.prototype.$stopPulsing = function() {
        this.discardAsync("pulse");
        var p = this.$pulse;
        this.$pulse = false;
        if (p) {
            this.pulseevent.invoke(this, false);
            this.$pulseFlags();
            this.$pulseNames();
        }
    }
    PulsarElement.prototype.pulse = function() {
        var pulses = this.get_pulses();
        if (typeof pulses != "number" || isNaN(pulses)) return;
        pulse ++;
        this.$pulse = true;
        var me = this;
        function _pulse() {
            me.pulseevent.invoke(me, true);
            me.$pulseFlags();
            me.$pulseNames();
            pulses --;
            if (pulses > 0) {
                me.async(_pulse),key("pulse").after(me.get_timeout()).execute();
            } else {
                me.$pulse = false;
                me.pulseevent.invoke(me, false);
                me.$pulseFlags();
                me.$pulseNames();
            }
        }

        _pulse();

    }
    PulsarElement.prototype.$pulseFlags = function() {
        var f = this.get_bindingflags();
        if (typeof f == "string" && /^\S+$/.test(f)) {
            this.updateTargets(f);
        }
    }
    PulsarElement.prototype.$pulseNames = function() {
        var f = this.get_bindingnames();
        if (typeof f == "string" && f.length > 0) {
            var arr = f.split(",").Select(function(idx, item) {
                var t = item.trim();
                if (t.length > 0) return t;
                return null;
            });

            var binds = this.findBindings(function(idx, b) {
                if (arr.indexOf(b.bindingName) >= 0) {
                    b.updateTarget();
                    return b;
                }
                return null;
            });
            return binds;
        }
    }

})();