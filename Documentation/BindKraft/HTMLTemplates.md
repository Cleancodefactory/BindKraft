# BindKraft - HTML Templates (Materialization)

The instantiation of pieces of HTML with BindKraft markup is constantly re-occurring process during the functioning of any UI code. To get the fill of it let us see a couple of example cases

- Almost each time a Repeater has its items changed it has to instantiate one template for each of them.
- A TemplateSwitcher (or derived class) will destroy some piece of the DOM and instantiate new template in its place each time it is triggered
- Each time you open a drop-down you trigger a Repeater or something alike to redraw its items (bringing us back to the first example).

The list of scenarios can continue - a lot of things happening in BindKraftJS are simple because they all boil down to reusing again and again the same 
mechanism - HTML template instantiation.

## HTML Template instantiation

What the materialization entails? To make it easier to point at examples, let us take this HTML with BindKraft additions as an example:

```html
<div data-class="SampleClass1" data-key="key1">
    <div></div>
    <div></div>
</div>
```

TODO: Continue ...