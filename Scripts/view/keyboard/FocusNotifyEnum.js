/*ENUM*/
var FocusNotifyEnum = {
    lost: 1, // The container should fire this when the focus is lost without container's action
    received: 2, // The focus has been directly received in some of the controlled elements of the container
    surrender: 3 // The container wants to surrender the focus to another - the parent is responsible to decide which (result is important)
};

