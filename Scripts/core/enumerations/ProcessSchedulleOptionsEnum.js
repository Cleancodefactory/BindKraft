


/*ENUM*/
// All options are optional and support for them too, but some are recommended
var ProcessScheduleOptionsEnum = {
    None: 0x0,
    // Characteristics that may or may not lead to anything - up to the scheduler to take them into account
    // To bits characterizing the task's size - very subjective, but the scheduler may be able to optimize. Use the following directions to determine
    Small: 0x0001, // A few calls up to 100-200 including calls in the simpler routines - up to about 20 calls inside the plain on which the calling code works.
    Big: 0x0002,   // Many calls - more than 1000 including internal library calls, more than 200 calls inside the plain on which the calling code works
    Huge: 0x003,   // Too many calls - 2-3 times bigger or more than Big.
    SizeMask: 0x3,
    // Explicit instructions (they should not be used in manner that depends on their support explicitly!)
    Continue: 0x0004, // Pick the next job after completint this one without waiting for another time slot.
    Later: 0x0008, // Move the task to the end of the queue if there are other tasks on queue (removes the flag and the next time the task is processed - low priority)
    Synchronous: 0x000C, // Perform the task immediatelly (while scheduled)
    ExplicitMask: 0xC
};