# TextBox component.

Should be used only over textarea and input type="text"/"search", but not "number".

```html
<textarea data-class="TextBox"></textarea>
```

Wraps the textual fields supported by the browser and provides more convenient members for binding.

## Methods

`selectAll()` - selects all the text.

## Properties

`get/set_detectenter` - boolean, listen for the (enter) key and fire the dedicated `enterevent` when pressed.

`get/set_whenreplacingselection` - string, what to do when replacing selection (set_selectedtext). The default is "select". See [setRangeText on MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText) for more info.

`get/set_val` - string, sets/gets the value of the field and checks if it has changed. If change occurred fires the `valchangedevent`.

`get/set_selectionstart` - gets/sets the selection start position.

`get/set_selectionend` - gete/sets the selection end position

`get/set_selectiondirection` - string: "forward" | "backward". Sets/gets the selection direction. set_selectiondirection accepts also boolean as parameter - true: forward, false: backward.

`get_selectiondirectionbool` - Gets the selection direction as boolean - true is forward, false - backward. 

`get/set_selectedtext` - string, gets or sets the selection text.

## Events

`enterevent` - If detectenter is set to true fires when enter is pressed inside the field.

`valchangedevent` - When the value is set through get/set_val, fires when the value really changes.

## Remarks

When setting the selection's text, there is no guarantee the behavior specified by whenreplacingselection will be applied. Browsers behave differently and we consider enforcing it to guarantee the same behavior. Furthermore, not having the focus on the field most often means that the selection will change when the focus is received. The reason is the overwhelming usage of mouse or touch to drive the focus by the users today.
