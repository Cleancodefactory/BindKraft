# Validator inline syntax

In this document we are describing the basic usage of `validators`. To make it easier we will follow a simple example scenario where we want to configure validation for a text field.

## Basic skeleton

Lets start with this markup

```HTML
... other html ...
<div data-key="fieldslot">
    <input type="text" data-bind-val="{bind path=myfield validator='fieldslot/validator'}"/>
    <span data-class="Validator" data-key="validator"
        data-validate-required=""
    >
    </span>
</div>
<button data-on-click="{bind source=__view path=onDoSomething}">
... other html ...
```

Here we rely heavily on defaults. We just point what is what and leave the different parts to work without any additional behavior tunning.

_**What we got so far?**_ A validator with a simple `required` rule configured and linked to a binding that links the value of a textbox with some field in the local data context (it is not important to know more details about the data context for our goals here). The validator will trigger automatically on `blur` (when the field loses focus), but will **not** indicate its status visually, because we did not supply any markup for that.

_**Is this rudimentary code useful at this point?**_ Yes this minimal setup can still be used for something tangible, but only from the code. In the `onDoSomething` method we can make use of the validator:

```Javascript

MyView.prototype.onDoSomething = function(event, dc, binding) {
    if (this.validate() == ValidationResultEnum.correct) {
        this.updateSources();
        var data = this.get_data();
        // do something with the data, knowing that data.myfield is not empty.
    }
}

```

To clear the details - `ValidationResultEnum` is a simple enumeration of integers:

```Javascript
    var ValidationResultEnum = {
        pending: -2,
        uninitialized: -1,
        correct: 0, // Note how the actual values are ordered around the zero.
        incorrect: 1,
        fail: 2, // 
        critical: 2
    };
```

For now you can forget about the `pending` and `fail`/`critical` state and just notice that if the validation result is greater than 0, this means invalid values are present and result lower than 0 means that the validation is not performed. Obviously after invoking the validation we will get either 0 or greater than 0 value - indication that the data is correct or incorrect.

Lets look back at the code that calls `this.validate()`. The most important thing here is that it calls `this.updateSources()` only if the validation passes and not in the other case. The point of doing this is to keep the data context clean - with no invalid values. The data is typically validated from the fields and only if it is valid it is moved to the underlying storage (no matter what it is - a data context, some property of the view/component or something ele).

_This is the general philosophy of the validation in BindKraft - it aims to provide the features that will enable the programmer to do just that - ensure the data is Ok before putting it in the storage that will be used for further processing._

## Putting status indication template

Lets now modify the basic example by adding templates to the validator:

```HTML
... other html ...
<div data-key="fieldslot">
    <input type="text" data-bind-val="{bind path=myfield validator='fieldslot/validator'}"/>
    <span data-class="Validator" data-key="validator"
        data-validate-required=""
    >
        <span data-key="correct">The value is Ok</span>
        <span data-key="incorrect">The value is REQUIRED!</span>
        <span data-key="uninitialized">Please fill this in.</span>

    </span>
</div>
<button data-on-click="{bind source=__view path=onDoSomething}">
... other html ...
```

Notice the `data-key` attributes of the elements we put withing the element that holds the Validator data-class. These keys can be: `correct`, `incorrect`, `uninitialized` and `fail`, each corresponding to a state from the ValidationResultEnum. When the validator is invoked in any way only one of them will be actually materialized inside the element - the one corresponding to the result of the performed validation, in our case this is just checking if the value of the text field is not empty.

The templates can be more complex, nothing limits you to a single span here, you can use any element that makes sense for the design of the UI and put others inside it - e.g. one can display different images for each state. It also deserves a notice the fact that we put the text field and the validator inside one element (the div with data-key="fieldslot"). This is not a requirement in any way - one can easily change the `validator` entry in the binding to point to the validator in a different way (for instance validator='__view/validator'), but this practice or something close to it is usually convenient not only for pointing to the validator, but also because it helps the styling - relative positions, CSS selectors can be "anchored" to the field's slot which is more flexible than keying them according to the whole view (e.g. we will need unique names for validators and the styling will be easier to break if not "keyed" more locally). 

_**Still, a more complex template needs access to more data to be actually useful**_. So, the next question is what kind of binding can we use in the validator templates?

The answer is - any kind, but we have something specific as well, the data context inside the template when it gets materialized is the `Validator` itself. This allows us to place in these templates bindings to any `Validator`'s property and extract useful data from it.

```HTML
    <span data-key="incorrect" data-bind-text="{read path=$message}"></span>
```    

The most used one is of course the get_message property which holds the concatenated messages from the configured rules after validation. To illustrate this we better add one more rule:

```HTML
... other html ...
<div data-key="fieldslot">
    <input type="text" data-bind-val="{bind path=myfield validator='fieldslot/validator'}"/>
    <span data-class="Validator" data-key="validator"
        data-validate-required="@text={read source=static text='Please fill this field'}"
        data-validate-length="#minChar='5' @text={read source=static text='You have to enter at least 5 characters.'}"
    >
        <span data-key="correct">The value is Ok</span>
        <span data-key="incorrect" data-bind-text="{read path=$message}"></span>
        <span data-key="uninitialized">Please fill this in.</span>

    </span>
</div>
<button data-on-click="{bind source=__view path=onDoSomething}">
... other html ...
```

We also took the liberty to specify some custom error messages for the different rules. They have some defaults, but they are good mostly for development purposes, in real world applications we will probably use at least translations (e.g. `{read translation=MyApp path=vld_required}` ) and may be even some service that supplies the messages.

Anyway, in the incorrect part of the template we will get all or some of the messages concatenated in one string. Only the messages of the failed rules will be included.

_**What if do not want concatenated string?**_ We can get the messages as an array and place it in a Repeater for instance:

```HTML

<div data-key="incorrect" data-class="Repeater" data-bind-$items="{read path=$messages}">
    <div style="border-bottom: 1px dotted black;" data-bind-text="{read}"></div>
</div>

```

## The rules

The first thing we have to know about the rules is that they are written in a specific manner and if you write rules it is best to follow it:

>Each rule checks only what it understands and responds with `correct` to everything else - in other words each rule picks only the known incorrect cases and nothing else.

For somebody who never dealt with validation in depth this probably sounds strange, but there is a purpose behind it - it leaves in the hands of the developer who configures the validator to list all the necessary rules, i.e. cover all the cases. This way the domains of responsibility of the separate rules will not intersect and it will be clear what happens in each situation.

One of the nice side effects is that the rules that fail will be only those that reflect the exact mistake made by the user. It is not fatal to not adhere to this conventions, but be prepared to deal with the consequences - misleading or overcomplicated error messages, cases intercepted not by the rule you expect and so on. It is still possible to put order into rules not obeying the rule, but it will require much more complicated configuration and BindKraft decided to avoid that.