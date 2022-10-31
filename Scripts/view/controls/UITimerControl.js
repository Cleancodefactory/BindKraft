(function() {


    function UITimerControl() {
        Base.call(this, arguments);
        this.set_freezeevents(true);
    }
    UITimerControl.Inherit(Base, "UITimerControl")
        .Implement(ICustomParameterizationStdImpl, "mode", "running")
        .Implement(IUIControl)
        .Implement(IFreezableImpl)
        .ImplementProperty("mode", new InitializeStringParameter("Mode can be 'ticker' or 'animationframe' or 'async'", "ticker"))
        .ImplementProperty("running", new InitializeBooleanParameter("Is the timer running", false), null, function(oval,nval){
            var self = this;
            if (nval) {
                if (this.get_mode() == "ticker") {
                    Ticker.Default.add(this.tiktok);
                    Ticker.Default.start();
                } else if (this.get_mode() == "animationframe") {
                    if (window.requestAnimationFrame) {
                        window.requestAnimationFrame(this.tiktok);
                    }
                } else if (this.get_mode() == "async") {
                    this.callAsync(function() {
                        self.tiktok.invoke();
                    });
                }
            } else {
                if (this.get_mode() == "ticker") {
                    Ticker.Default.remove(this.tiktok);
                } 
                // The other modes are self triggering
            }
        });

    UITimerControl.prototype.tickevent = new InitializeEvent("Fired when tick occurs");
    

    UITimerControl.prototype.finalinit = function() {
        this.set_freezeevents(false);
    }
    UITimerControl.prototype.tiktok = new InitializeMethodCallback("tiktok method",function() {
        var self = this;
        this.tickevent.invoke(this, null);
        if (this.get_running()) {
            if (this.get_mode() == "animationframe") {
                window.requestAnimationFrame(this.tiktok);
            } else if (this.get_mode() == "async") {
                this.callAsync(function() {
                    self.tiktok.invoke();
                });
            }
        }
    })
})();