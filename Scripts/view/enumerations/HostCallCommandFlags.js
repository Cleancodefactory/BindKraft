


// Enumeration of the standard commands, other custom commands can be used as well, but the standard ones should be these:

// This enumeration is used as command in the HostCallQuery. 
/* IMPLEMENTATION INSTRUCTIONS
The host should process the host call as set of commands encoded as bits
and not as mutually exclusive command constants!!! The order in which the commands need to be executed is mostly obvious - those commands
that can make other commands impossible to execute should be processed last.
Depending on the host one should decide if the query should be declared processed once it enters the host or the commands not supported by 
this host should be passed down the view tree for processing by a host further in the view tree. If that is the case the implementation can remove
the flags of the executed commands and return true (query is completely processed) if the command remains 0 in the end of the processing chain. 
You can use HostCallQuery.prototype.clearCommandFlag to do that.
*/
/*ENUM*/
var HostCallCommandEnum = {
    close: 0x0001,  // Request close, the host should still call onClose of the view and vcancel the operation if false is returned
    hide: 0x0002,  // hide - the host or the view only - as appropriate
    show: 0x0004,  // show - the host or the view as appropriate for the specific host
    updateui: 0x0008, // if the host maintains ui bound to the contained view it should rebind it
    maxsize: 0x0010, // resize to maximum size if supported (optional)
    minsize: 0x0020, // resize to minimal size if supported (optional)
    normalsize: 0x0040, // resize to regular size if supported (optional)
    datachanged: 0x0080, // Data context changed - the host should take measures if it is interested or needs to expose it
    apply: 0x0080, // Data (context or other data) changed - the host should take measures if it is interested or needs to expose it
    queryrole: 0x0100, // This function has been DEPRECATED - the flag can be reused for something else
    gethost: 0x0200, // The host should return self
    getshell: 0x0400, // The host should return the system shell.
    activate: 0x0800, // Go to top, activate in some manner that will focus the user attention - as appropriate for the UI
    reload: 0x1000, // Asks the host to reload (leads to closing!)
    // composite constants for convenience
    ok: 0x0081 // Data changed + close
};
var HostCallCommandFlags = HostCallCommandEnum;