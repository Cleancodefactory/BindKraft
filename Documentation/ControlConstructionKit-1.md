# Control construction kit part 1 - Interfaces
This is part of the __View__ layer of BindKraftJS

## Foreword

The CCK (Control Construction Kit) is work in progress and is considered somewhat experimental. It can be used in its stable part, but there is no guarantee how much functionality it will be able to cover in future.

## Principles

Various principles are involved in the structure described by the interfaces and will help you understand certain methods and whole interfaces.

### Explicit and Implicit selection/hint

**Explicit** selection or hint is one that is specifically selected by the user (usually) and if such is received it must be obeyed - shown as selected, tracked in a list etc.

**Implicit** selection or hint is usually extracted from the current user actions - browsing through list, writing a filter text etc. It should be considered intermediate action and instructs the receiver to adjust what it shows if it is possible. An example can be a list of items dynamically filtered as the user types the filter. The support is optional and not always possible.

### Dedicated methods for handling of events and direct calls

There are actions which can be performed both through receiving an event or by direct call from the code. They are usually represented by two methods in the interface:
* handleXXXXXX(event_or_sender, data) - to handle events
* processXXXXX(data) to process the action data directly.

These are usually pre-implemented in the very interfaces to direct all the processing to the processXXXXX method, so that is the one in which you have to implement the logic. In some cases (rare ones) event handling (handleXXXXXXX) may need to do additional work before passing the work to the processXXXXXX method, but in all other cases you can just implement the processXXXXXX method and use the handleXXXXXXX only in bindings and other event connection techniques. Keep in mind that auto-connection features may also do this for you in the most cases.

### fireXXXXXX methods

Interfaces that contain events usually include fireXXXXXX method with capitalized event names which provide at least invoking the events with less parameters and can be implemented in a specific manner if this is more convenient.

## Interfaces

The interfaces in CCK work together with a number of more general purpose interfaces from BindKraftJS to enable creation of small sub-control elements that can be brought together to form powerful controls for everyday usage. They encapsulate certain concepts and even ability for semi-automatic integration between the elements.

List of the interfaces in the kit:
* IHintedSelectorUIController
* IFilterDataSource
* IHintedSelector
* IPartnershipTarget
* IPartnershipInitiator

Related interfaces used extensively with the kit (only the most frequently used)
* IUIControl
* IDisablable
* IKeyboardEventHandler
* IKeyboardLogicalSource
* IKeyboardHandler
* IItemKeyPropertiesDescriptor


### IHintedSelector

```javascript
function IHintedSelector() {};
IHintedSelector.Interface("IHintedSelector");
IHintedSelector.prototype.processExplicitHintData = function(hint);
IHintedSelector.prototype.handleProcessExplicitHintData = function(e_sender,hint);
IHintedSelector.prototype.processImplicitHintData = function(hint);
IHintedSelector.prototype.handleProcessImplicitHintData = function(e_sender,hint);
IHintedSelector.prototype.handleStartHintProcessingUI = function(sender, data);
IHintedSelector.prototype.handleStopHintProcessingUI = function(semnder, data);
IHintedSelector.prototype.selectionsuggestevent = new InitializeEvent();
IHintedSelector.prototype.fireSelectionSuggestEvent = function(item);

```

**processExplicitHintData** and **handleProcessExplicitHintData** process explicit hint and handle **explicithintevent** event respectively (see Principles above).

**processImplicitHintData** and **handleProcessImplicitHintData** process implicit hint and handle **implicithintevent** respectively.

Because **IHintedSelector** is usually implemented by element presenting a set of items to the user, the _hint_ events hint the _selector_ how to adjust the set/list of items according to the current actions of the user. Hint may contain various information, see **Hint structure** below for more information.

**handleStartHintProcessingUI** and **handleStopHintProcessingUI** are handlers which should implement the necessary measures when the UI is activated and deactivated respectively. Activation/Deactivation (start/stop the processing UI) can be opening/closing of a drop-down, showing/hiding, freezing/unfreezing etc. The implementation is required if the element implementing IHintedSelector has such functionality or expects to be activated/deactivated forcibly and wants to prevent unnecessary user actions processing (however in this case the implementation is not mandatory).

**selectionsuggestevent** and its helper **fireSelectionSuggestEvent** fire an event with data (second argument) containing the identification of the selected item. This is usually a key, id or something else that uniquely identifies the item. This is typically easy to determine once you plan what you want to construct and how are you going to manage and identify the items.

### Hint structure
This structure is not a class, but just a documented javascript object with properties dedicated for specific usage.

Currently only one property is defined:

```javascript
{
    defaultHint: "some string value"
}

```

It is not a problem to define more properties, but for now only the defaultHint value is used, to prevent introducing too much rules that may change in the future.

The default hint should be used as a filter or exact value and can be converted to a number if necessary. More specific usages should be deduced by the type of the value (a date for instance), but it is mainly designed to be a string.