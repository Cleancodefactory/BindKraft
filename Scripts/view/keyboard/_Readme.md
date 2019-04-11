# Keyboard functionality - not finished.

These are kept together in the keyboard directory until fully finished and integrated into the rest of the framework.

Further work on this functionality makes it more convenient to keep this code separate.


## Keyboard related stuff (unfinished list)


### Focus navigation

Keyboard is handled by the browsers in a bit inconsistent manner. The key events 
are propagated, but focus events are not.
	
__PFocusContainer__ is the main Interface which defines the negotiation between containers
 and ways for the external world to command them

__PFocusContainerRegister__ is just a register for subordinate containers and is needed 
by the most FocusContainerControl	implementations except those that are dedicated to very simple elements.
This Interface is actually a ready-to-use implementation and usually does not need overriding of any methods - just Implement(FocusContainerRegisterControl)
wherever it is needed and before calling the Implement(`P{specific}FocusContainerImpl`);

__PDOMFocusContainer__ is a specific Interface that is used internally to delegate decisions from dumb DOM elements to the focus container. These are usually done by
the elements/controls themselves when they have some advanced functionality.