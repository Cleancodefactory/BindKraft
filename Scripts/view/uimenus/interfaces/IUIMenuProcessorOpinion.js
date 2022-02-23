(function() {
    /**
     * If implemented over the object passed as processor with an UIMenuItem, this interface enables query
     * for the appropriate component class during slotting of the menu item.
     * 
     * During the slotting process the interface may or may not be called depending on the flexibility of the slot,
     * also there is no guarantee that all the requesters will use the class returned and not ignore it for some reason.
     * A slot may decide to ask not only for itself, but also for similar slots and choose one of the answers, or decide that
     * none of them matches its requirements.
     * 
     */
    function IUIMenuProcessorOpinion() {}
    IUIMenuProcessorOpinion.Interface("IUIMenuProcessorOpinion");

    /**
     * @param {interface} slotInterface Can be null.The definition of the defining interface for the slot (e.g. IUIAppMenuHost, IUIContextMenuSlot, IUIMenuSlot etc.)
     * @param {UIMenuItem} menuItem The menu item which has to be shown by the chosen component.
     * 
     * slotInterface == null means query for suggestion REGARDLESS of the slot 
     * 
     * The decision SHOULD be based primarily on the same traits the slot/s take into account when choosing representation for the item:
     * menuItem type, menuItem.processorType, slot needs/limitations. Any other traits should be considered "additional".
     */
    IUIMenuProcessorOpinion.prototype.suggestUIComponentClass = function(slotInterface, menuItem) { throw "not opinionated"; }

    
 })();