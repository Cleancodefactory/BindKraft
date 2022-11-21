(function() {
    /**
     * Pure marking interface. Can be used only on components marked with IUIControl.
     * If the IUIControl is not inherited Implement this interface after IUIControl, otherwise an error will occur, 
     * because it is required.
     * 
     * The Implementation of the interface signifies for the validation system that this IUIControl is passable (transparent)
     * for the validation operations invoked from the parent(s). Normally IUIControl isolates the component from its parent validation and
     * if both are required the control must support IValidatable and the parent must invoke its validation. When this must be done by triggering the
     * parent validation a validator rule helps to link them together - see CheckValidationRule. This sounds logical in general and especially when the 
     * components are truly controls intended for usage everywhere - the validation of the child control is triggered as a whole separate operation 
     * as part of the parent validation or explicitly or in any other fashion. This way the inner control preserves its black box behavior. However this
     * requires additional work which is unnecessary when the inner control is declared as such only as a little convenience, but its inner logic is not
     * complicated - i.e. it is used mostly as means to reuse the template in a few specific places and not as means to keep it blackboxed at any price.
     * 
     * So, this interface turns off part of the default behavior of hte IUIControl - the part that declares it as separate validation container. This is 
     * useful (as hinted above) when it does not hide complex behavior, but serves mostly as a way to separate parts of a form for specific (most often 
     * app specific) reuse.
     * 
     * This completes the picture nicely, because components that implement:
     * 1. IUIControl only act separate and their validation is their internal business
     * 2. IUIControl and IValidatable - add ability to link their validation invocation with the validation of the parent still keeping it and everything else blackboxed.
     * 3. IUIControl and IUIControlValidateFromParent - explicitly state that they should not be treated as completely separate component and all their individual validators
     * should be driven by the parent.
     * 
     * So only controls that implement enough internal logic which may impact even their validation process can stick to case 2 and those that do nothing unusual with the
     * validation can delegate it to the parent (case 3). Case 1 looks most restrictive, but this is not so - the controls of case 1 are usually components designed to be 
     * driven by their parent through an interface of methods and properties called when needed, so they are supposed to be controlled explicitly, while adding IValidatable
     * implies integration according to a standard which is harder to implement especially if their validation is somehow untypical and involves additional steps.
     */
    function IUIControlValidateFromParent() {}
    IUIControlValidateFromParent.Interface("IUIControlValidateFromParent");
    IUIControlValidateFromParent.RequiredTypes("IUIControl");
})();