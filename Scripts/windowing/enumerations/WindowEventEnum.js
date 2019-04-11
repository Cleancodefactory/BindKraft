


// These are also called window messages in conversations and documentation. The "window event" is literally the specific message's type.
// See some useful comments after the declaration.

/*
    Details: These are the standard window messages, additional messages are defined by more specialized windows (mostly implemented in the lib directory).

*/

/*ENUM*/
var WindowEventEnum = {
    ParentChanged: "ParentChanged", // notifies the window that its parent has been changed
    RemovingChild: "RemovingChild", // refurn false to cancel the operation
    AddingChild: "AddingChild", // refurn false to cancel the operation
    ChildAdded: "ChildAdded", // notifies the window that a new child window has been added
    ChildRemoved: "ChildRemoved", // notifies the window that a new child window has been removed
    SysCreate: "SysCreate", // *** System create message (finalize creation)
    SysParentReady: "SysParentReady", // *** Sent by the parent to its children when it becomes ready
    SysTemplateReceived: "SysTemplateReceived", // *** notifies the window that its custom template has been received.
    SetStyles: "SetStyles", // sets the styles
    GetStyles: "GetStyles", // gets the styles
    SizeChanged: "SizeChanged", // Sent to the window after its size has been changed, the new size is already set and can be read from the object properties.
	ResizeStart: "ResizeStart", 
	Resize: "Resize", // Can (should) be sent only between ResizeStart and ResizeStop { newsize: Rectangle }
    ResizeStop: "ResizeStop",
    AdjustClient: "AdjustClient", // Usually sent to the window after its size has been changed from the internal handler of the SizeChanged.
    // Windows implementing special behaviour that may affect the size and possibly placement of their client area must also send this message to their affected children
    // Good example is using DOM techiques to hold a child window in place. The resizing of the window will happen automatically without it knowing about it
    // - no SizeChanged will be received by the window as it is not resized explicitly, but still the parent knows that the size has changed and must inform the child to adjust its client area(s)
    EnableWindow: "EnableWindow", // msg.data = { enable: true|false } Sent to the window after it was enabled or disabled

    PosChanged: "PosChanged", // Sent to the window after its position has been changed
    ChildResized: "ChildResized", // Sent to the parent when a child has been resized.
    ChildMoved: "ChildMoved", // Sent to the parent when a child has been moved
    ChildShown: "ChildShown", // Sent to the parent when a child has been shown or hidden { visible: true | false }
    GetDragHandle: "GetDragHandle", // return the drag handle element
    Create: "Create", // Sent to the window when it has been completely created - the best place for construction of the internal content the data contains the data passed to the constructor
	Created: "Create", // Alias for the above (mistakes are regular)
    Materialize: "Materialize", // Sent to the window when it has been completely created and attached to the window hierarchy of the workspace - the best place for construction of parent dependent internal content.
    IsMaterialized: "IsMaterialized", // Sent to the window from its parent to give it a chance to determine if it needs to fire Materialized, the window cascades this message while handling materialize
    // Destruction sequence is performed by sending the ChildClosing, the Close message and the Destroy message is then emited internally, finally a ChildDestroyed is sent to the parent to enable constructs where the parent may want to remove references to children only after all the close related tasks are done.
    ChildClosing: "ChildClosing", // Notification sent to the parent to enable it to cancel the operation before anything else happens.
    Close: "Close", // Sent to the window just before destroying it. Return false to cancel (may not be honoured !!! have this in mind)
    Destroy: "Destroy", // Sent to the window when destroying it. Use this opportunity to release resources or other stuff (save operations should be done on close).
    ChildDestroyed: "ChildDestroyed", // { child: window }
	ReportResult: "ReportResult", // { result: <boolean>, resultData: <any> } This event is only explicitly fired to report a "result". What is "result" depends on the functionality that uses the feature - for instance dialogs use this message, but other (custom) implementations can also use the message if they open window(s) for a certain period and expect some task to be completed at some point (usually when the window closes, but not necessarily)
	Broadcast: "Broadcast", // data is arbitrary - this message is refired on each window's children until all receive it or it hits a window with nobroadcast style flag set
	BroadcastAction: "BroadcastAction", // Like broadcast, but the default processing will call the callback in the data if the condition passes (again callback)
										// { condition: [<callback(window)>], action: callback<window>}
										// No condition executes action over each window, condition is predicate and needs to return true-like result.
    Show: "Show", // Sent when the visibility changes - data.visible is set to true = visible, false = hidden
    Activated: "Activated", // Sent to the window being activated (becomes visible and receives focus)
    Deactivating: "Deactivating", // Sent to the window by its host(s)/parent(s) to inform it that the window's state/visibility or something else will change in a manner 
									// data: { window: <this window>, newWindow: <optional window to which we switch>, reason: <arbitrary keyword> }
    // that may corrupt/lose/hide the data. The window should take measures to start saving the data. It can return false (explicitly) to inform the host that there 
    // is an obstacle (usually validation failed). The parent/host may or may not honour the return result.
    // Note that this message is not sent by the very low level windows for window hiding or destruction for example. It is presumed that such things
    // are low level functionality cycle through which one may need to pass while actually deactivating a window for a higher level reason. Implementing something
    // on a very low level may easilly cause duplication or even unwanted triggering of persistence mechanisms. The tigh level to Implement this is directly in a view host which
    // being specialized will know when to send the message.
    FirstShown: "FirstShown", // Sent to the window the first time it becomes visible.
    LoadView: "LoadView", // Loads a data bound view { directData: , view: , url: }
    ViewLoaded: "ViewLoaded", // Sent to the window when the view completes its loading process { initData + loadedView: ViewBase view root class }
    ViewPreLoad: "ViewPreLoad", // Sent to the window when the view class instance is created (no data loaded)

    // Z-Ordering messages
    ActivateWindow: "ActivateWindow", // The window is instructed to go to the top of the z-order stack in its parent. The default implementation sends ActivateChild to the parent which does the actual work
	DeactivateWindow: "DeactivateWindow", // The window is informed for deactivation
    ActivateChild: "ActivateChild", // { child: <BaseWindow> }
	DeactivateChild: "DeactivateChild", // { child: <BaseWindow> }

    SetFocus: "SetFocus",
    KillFocus: "KillFocus",

    // Proposed but not yet accepted! (not used yet)
    ReloadData: "ReloadData", // Informs a window that it should reload its data and rerender its view. 
    SplitterMoved: "SplitterMoved", // Used for SplitWindow, return false to stop splitter moving (fly me to the Moon! I mean private enum for the specific class)
    GetFocus: "GetFocus",
    // Events sent from a child to a container potentially supporting layout management (such as splitter)
    // The child SHOULD NOT change its visual representation on its own, because its reques may not be honoured or may be honoured only partially. 
    // The change MUST be performed as a response of the special messages sent from the container.
    LayoutRequest: "LayoutRequest", // { child: <BaseWindow>, childState: <constant>, width: <integer>, height: <integer>}
    // This one is sent from the child to its container as a request for a change. There can be custom parameters honoured by specific containers.
    LayoutChange: "LayoutChange",   // { childState: <constant>}
    // This one is sent by the container to a child, other custom parameters are possible and allowed
    LayoutQuery: "LayoutQuery", // Sent by container to child(ren) to query them for sizing and other preferences. May return different results depending on the state.
    // set msg.data = { minwidth/height:, maxwidth/height,prefwidth/height}
    LayoutGetState: "LayoutGetState", // For both messages { child: [BaseWindow], state: <statedata> - returned or sent depending on the message }
    LayoutSetState: "LayoutSetState"  // If child is present the container should return/apply only the state concerning that child (if possible for the particular container).
};

/*
	Window initialization sequence.
	Most of this functionality is coming from BaseWindow and should not be changed in inheriting classes. While unusual window behavior is not completely out of question it is unlikely
	that any changes in the main sequence will have useful consequences.
	
	Messages:
	
	!!!!
	ParentChanged - Can be received early if the parent is given in the constructor. You can check isWindowMaterial() 
	!!!!
	
	Create (message), on_Create (implicit handler), exernal (registerExternalHandler)
		- When the window is constructed and all the vital info is fetched (e.g. template and parameters). This is before the window is actually attached to its parent.
	Callback 
		- The callback supplied to the constructor (if any)
	*Materialized (event, implicit handler, external handler)
		- Only if
	
	
	
*/