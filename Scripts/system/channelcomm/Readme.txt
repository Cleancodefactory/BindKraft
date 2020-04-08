ChannelComm work notes
~~~~~~~~~~~~~~~~~~~~~~

This is a subproject intended to provide BindKraft with means to 
communicate between BrowserContexts (BC) with added ability to collect
pieces of data being communicated for various uses by other parts of BK
and apps working with it.

Intention
~~~~~~~~~

- Use MessageChannel as primary means of communication
- Provide ways for establishing channels with different targets
- Serve both long-term and short-term connections


Implementation specifics
~~~~~~~~~~~~~~~~~~~~~~~~

MessageChannel is wrapped which can be avoided by using both its ports
in the same BC whenever the actual data channel is something simulated
(e.g. RTC data channel transferring messages). This is an arbitrary 
decision made in BK favor enabling us to use its own abstractions
without overloading the workspace with too many objects (see also
the thoughts below)

The communication will often involve BK and non-BK participants.
For the non-BK participants there could be some light-weight libraries,
but the intent is to make it possible for them to cope with the 
communication easily enough even using only the naked browser API,
which is another argument in favor of the above decision - to wrap
the part that is in a BK environment, which enables the native part
available for the other participants to be managed on the BK side,
but left naked for the other with as much help provided for the non-BK
side as possible - e.g. simpler formats and life cycles.

ChannelComm does not support transferable objects in order to keep the
abstraction always applicable. The other side of a channel can be even a 
non-browser piece of software, so transferring the control of objects is
not possible in all cases.