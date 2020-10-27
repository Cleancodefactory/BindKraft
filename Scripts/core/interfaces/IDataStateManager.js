
/*INTERFACE*/
/**
 * Tunnel for data state manipulation over underlying data whenever 
 * the data is accessed through a proxy object (such as DataPair).
 * The implementation must have the following behavior:
 * 
 * set_DataItemState(null) has to effectively delete the state, get_ should return undefined or null
 * 
 * set_DataItemState(DataStateEnum.Undelete) must implement change from deleted or missing state to some other state transition.
 * The previous state can be remembered or otherwise deduced. As a guideline take this logic:
 *   missing -> insert, deleted -> changed or unchanged (where the changed is the safe bet, but smarter approach can be
 *   implemented when possible)
 * 
 */

function IDataStateManager() { }
IDataStateManager.Interface("IDataStateManager");
IDataStateManager.prototype.get_DataItemState = function () { return null; };
IDataStateManager.prototype.set_DataItemState = function (v) { };

