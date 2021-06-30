(function() {

    /**
     * The purpose of this class is to be the base class for classes implementing
     * logic that decide what king of trap to use based on geometrical and structural 
     * (DOM) reasons. In the end the gesture result is used to provide detailed 
     * answer "what must be done".
     * 
     * The different tasks may differ drastically.
     * 
     */

    function GestureTaskBase() {
        BaseObject.apply(this, arguments);
    }
    GestureTaskBase.Inherit(BaseObject, "GestureTaskBase");

    GestureTaskBase.prototype.$cursorAtPaused = false;
    GestureTaskBase.prototype.cursorAt = function(pt_or_event, element) {
        if (this.$cursorAtPaused) return;
        var cur = this.suggestCursor(pt_or_event);
        var el = element || document.body;
        if (el instanceof HTMLElement) {
            if (cur == null) {
                if (el.$__originalCursor != null) {
                    el.style.cursor = el.$__originalCursor;
                    el.$__originalCursor = null;
                } else {
                    el.style.cursor = "";
                }
            } else {
                if (el.$__originalCursor == null) {
                    var x = el.style.cursor;
                    if (typeof x == "string" && x.length > 0) {
                        el.$__originalCursor = x;
                    } else {
                        el.$__originalCursor = ""; // Not null, signals that it was recorded already
                    }
                }
                el.style.cursor = cur.getStyle();
            }
        }
    }
    GestureTaskBase.prototype.pauseCursorSuggestion = function(op) {
        if (BaseObject.is(op, Operation)) {
            this.$cursorAtPaused = true;
            op.then(o => {
                this.$cursorAtPaused = false;
            });
        }
    }
    GestureTaskBase.prototype.suggestCursor = function(pt_or_event) {
        return null;
        throw "Not implemented.";
    }
    GestureTaskBase.prototype.resetCursor = function(element) {
        var el = element || document.body;
        if (el instanceof HTMLElement) {
            if (el.$__originalCursor != null) {
                el.style.cursor = el.$__originalCursor;
                el.$__originalCursor = null;
            } else {
                el.style.cursor = "";
            } 
        }
    }
    GestureTaskBase.prototype.applyAt = function(pt_ot_event) /* :Operation */ {
        throw "Not implemented.";
    }


})();