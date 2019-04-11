The directory where all the interfaces for the Core part are placed
Special attention is requied for the interfaces in the Core, because this is the start-up
point of the framework and some interfaces need to be defined too early and they cannot use oop or
registration helpers, or depend on other interfaces that are not yet defined. 
To address this issue the interfaces in this part are included in two steps - one early almost
before everything else (except the very ability to define classes and interfaces) and another - late
when everything from the core part is loaded and defined. This implies the need to list the interfaces 
in two profile files (lists of includes) e.g. interfaces-full.dep (for the early ones) and interfaces-full-post.dep
for the later ones (post load). When defining a new interface consider carefuly when it will be used and by what kind
of classes and put it in the appropriate list, then also use this decision to determine how to implement it - with
basic mean only, or by useing advanced helpers and dependencies on other stuff.
Unfortunately this cannot be simplified by splitting the core in two, because the efficient implementation of some features
will become difficult or "ugly" if the interfaces it uses have to reside in two cleanly separated parts/modules.