# TODO and doing

This list was started at April 2019, previous lists were archived and closed.

This list contains future and current tasks as identified by the developers of the BindKRaftJS platform. The tasks are grouped by section (core, view, windowing, system, comm, and others)

**Legend**

    - task not done
    + task done
    ~ task in progress
    ? suggested task and tasks that need review and splitting into better defined ones
    ! Questions, bugs, considerations etc. When reviewed these ar changed to +, any identified tasks are added to the list.

    Combining two signs is allowed in some cases - mostly: -?, !?

## Core

    + BKUrl and related classes. URL parsing and management set of classes.

    ~ Tree states. Functionality that enables apps (and not only) to define their possible states as a tree of nodes. Each node is a group of parameters with optional conditions for their values. This functionality enables declaration, conversion back and forth to/from linear/vector (array) form of the states, serialization/deserialization of the linears to/from strings, including form usable in URL paths, system history states and possibly others as well. 

## View

    - Replace left side binding (target expression) handling for DOM elements. Replacement is available in the parallel-master-merge, but may need some more work.

    ~ Extend ViewUtils with members as needed. This is lower level than previously planned DOM oriented (mostly) routines to be used by BindKraftJS internally. Previously we wanted to use DOMM (Dom Manager) as a replacement for JQuery, but after missing the point at which this could have been done with minimal effort, now that more work needs to be done - we go further and additional performance improvements are expected as a result. (some arguments about this are available in the documentation - important side argument is that using fully functional separate library at JQuery or DOMM level has unexpected effects - stimulates new developers to dig into DOM instead of using the BindKraft techniques, which are more efficient, but require mental changes in the programming approach).

## Windowing

    ~ Remove old and implement new base support for multiple client slots in logical windows (on BaseWindow level and above) to enable advanced layout solutions. The layout control in windows will be based on client slots - DOM elements intended to hold a child window or sometimes even sets of child windows. Any layout dynamic behavior will be done by manipulating the slots and fully basing the child windows low level layout behavior on the slot usage. E.g. maximizing (filling the parent) is filling the slot.  changing the state of a child in the whole parent layout - 

## System

## Comm

    - AJAX infrastructure replacement implementation. Planning was done and most interfaces initially defined. The second phase needs to complete the definitions after the the review and create the actual implementation.