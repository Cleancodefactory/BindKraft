var ProcessingChainContextStatusEnum = {	
	IDLE: 1,
    BUSY: 2,
    //STARTED: 3,
    COMPLETE: 4,
    FAILED: 5
};

/*
    Chain context statuses
    bit 0: 1 = busy
    bit 1: 1 = started, 0 means we are at 0 index
    bit 2L not used
    bit 3: 1 = failure
    
    bit 4: 1 = complete
*/

/*var ProcessingChainContextStatusFlags = {
    busy: 0x0001,
    started: 0x0002,
    complete: 0x0010,
    failure: 0x0008
};*/
