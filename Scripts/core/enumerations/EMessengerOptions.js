var EMessengerOptions = Enumeration("EMessengerOptions",{
    "none": 0,
    record: 0x01, // Record the message and use it to advise new subscribers.
    clear: 0x02, // Clear the recorded message 
    all: 0x03
}, {
    record: function(val) {
        if (typeof val === "number" && (val & 0x01) !== 0) {
            return true;
        }  
        return false;
    },
    clear: function(val) {
        if (typeof val === "number" && (val & 0x02) !== 0) {
            return true;
        }  
        return false;
    }
});