<!-- vscode-markdown-toc -->
* 1. [Basics](#basics)
    * 1.1. [The validation procedure performed by the Validator](#the-validation-procedure-performed-by-the-validator)
    * 1.2. [Validator templates](#validator-templates)
    * 1.3. [Validation rules - usually more than one per validator](#validation-rules---usually-more-than-one-per-validator)
        * 1.3.1. [Inline](#inline)
        * 1.3.2. [Referred from the code](#referred-from-the-code)
        * 1.3.3. [Rules conclusion](#rules-conclusion)
* 2. [Built-in validation rules](#built-in-validation-rules)
    * 2.1. [Base rule and common parameters](#base-rule-and-common-parameters)
    * 2.2. [async (AsyncValidatorRule)](#async-(asyncvalidatorrule))
    * 2.3. [validation (CheckValidationRule)](#validation-(checkvalidationrule))
    * 2.4. [comparedates (CompareDatesValidatorRule)](#comparedates-(comparedatesvalidatorrule))
* 3. [Goals of the validation](#goals-of-the-validation)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc --># Validation (of user input etc.)

**Validation** is set of classes and techniques that enable the programmer to validate user input and state of certain UI or part(s) of UI. Typically this is associated with forms filled by the user, but in our case it can goe further and covers more than just the user input. In any modern application the user input can be part of a variety of interactions with the software and they are certainly not limited to filling a number of fields and clicking "submit" in the end. This is why it is better to think about validation of the state of the UI and not just the user input, e.g. sometimes is practical to validate indirect results of the user actions and not only simple input consisting of textual input, checking options etc.

There are variety of possible approaches to validation in scenarios equivalent or similar to BindKraft's UI. One of the important general topics is the choice between validating the data, the state of UI element, or (for example) - validate the data, but double buffer it to avoid making the main data dirty. In BindKraft there are enough abstract ways to access the data placed in the UI - so, this made te choice straightforward - validation of the state of the UI. The benefits are - no need to think of double buffering, validation naturally follows the concepts of the application's UI and is easier to plan and implement.

##  1. <a name='basics'></a>Basics

The validation uses mostly two kinds of classes: 

- `Validator` - the only class of its kind - a container for rules, display templates and functionality driving the rules.
- **Rules** - A number of classes that can be found in `scripts/view/validatorrules`. All these classes register rule aliases (see `registerValidator` in their sources) which can be used instead of their class names when the rule is specified (both inline and in the code).

`Validator` class is the active part of the validation process. It is a fairly typical UI component subclassing the `Base` class. This means it is placed in templates the usual way e.g.

```HTML
<div data-class="Validator ... parameters..."
    ... bindings and rules specified inline ...
></div>
```

Being a component the `Validator` can use templates configured explicitly, implicitly or inline. The specifics of `Validator` are somewhat similar to the TemplateSwitcher and similar classes - the Validator seeks in its template parts corresponding to its state and shows these pieces instead of the entire template. Details about this and how to use this feature - later in this article.

There is an internal support for validators that links them to specific binding or bindings. This is the most important part of the validation structure - links the validator with the value(s) and binding(s) binding property(ies) to UI components/elements. This way the `Validator` can feed to its rules the value(s) to inspect and if necessary give them direct access to the binding(s) if they need more than just the value(s). While the latter is rarely needed and is and should be avoided, there are complex cases in which it could be necessary.

The validation process in a nutshell:

> A component, most often control or view:

1) finds all the `Validator` components inside itself and 

2) executes them one by one.

3) Each validator considers the most incorrect result returned by its rules as validation result.

4) Most incorrect result from all `Validator`-s is considered as result of the validation of the entire area controlled by the component initiating the validation.

_Simple and kind of obvious feature exists - each validator has a parameter `groupname` which can be set to some string. Through that a validation of individual groups of `Validator`-s can be invoked instead of all the validators. Such a feature is usually available in any library implementing something similar, so it should be at least familiar._

###  1.1. <a name='the-validation-procedure-performed-by-the-validator'></a>The validation procedure performed by the Validator

The validation procedure performed by each `Validator` component consists of optional waiting for ready condition of the component in which binding links the validator and then execution of all the rules configured in the component.

The **control readiness** is a topic for another article. In a couple of words it enables waiting a component to get into a state in which its properties contain meaningful values. This is a problem when the component has to perform some asynchronous operations in response to changes before it can produce the values. This can be invoked by user actions and code completely separate from the code that needs the validation (and in some other cases too), so there is an interface the component must implement in order to indicate what is its state and provide means to be waited to get ready.

TODO: Continue the section
###  1.2. <a name='validator-templates'></a>Validator templates

The template for the Validator, unlike the template for a simple component consists of up to 5 parts with data-keys matching the names of the states in which the Validator can be:

```HTML
<span data-key="incorrect">
    <span class="msg" data-bind-text="{read path=$message}"></span>
</span>
<span data-key="correct">
    <span class="success">Ok</span>
</span>
<span data-key="fail">
    <span class="criticalmsg" data-bind-text="{read path=$message}"></span>
</span>
<span data-key="uninitialized"> 
    <span>Possible instruction what to do</span>
</span>
<span data-key="pending">please wait ...</span>
```

When no template is specified the default (as configured for the workspace) is used. Explicit one can be specified with the templateName parameter e.g.: 

```HTML
<div data-class="Validator templateName='mymodule/validator-template'">...</div>
```

###  1.3. <a name='validation-rules---usually-more-than-one-per-validator'></a>Validation rules - usually more than one per validator

The rules can be specified inline (in the HTML template/view where validators are used, see [here](InlineSyntax.md)) or in the code and referred using a parameter, example:

```HTML
<div data-class="Validator @importrules={read service=someservice path=$pathtoruledefs}">...</div>
```

In the example `$pathtoruledefs` should fetch an array of strings, each containing a rule with its parameters. The syntax of the strings is the same inline and when referred from the code, but here is how this usually looks differently, because of a little syntactic sugar supported by the framework:

####  1.3.1. <a name='inline'></a>Inline
How they are usually specified:

```HTML
<div data-class="Validator"
    data-validate-required=""
    data-validate-length="#maxChar=20"
></div>
```

How they can be specified, but nobody does it, because it is not as human friendly as the other option:

```HTML
<div data-class="Validator"
    data-validate-1="required"
    data-validate-2="length #maxChar=20"
></div>
```

And how they can be specified in a hard to read, but very explicit way:

```HTML
<div data-class="Validator"
    data-validate-1="RequiredFieldValidatorRule"
    data-validate-2="LengthValidatorRule #maxChar=20"
></div>
```

all the 3 different forms do the same thing, however the first one is the best from readability perspective. What actually happens is that the aliases for the validation rule classes can be used as part of `data-validate-*` attributes and will be picked from there if the 3-d part of the attribute name matches an alias. However one can specify a random text (we used 1, 2, but anything that do not repeats will do) as attribute name and place the alias as first token in its value. And finally instead of aliases one can use the actual class names of the rules and they can be quite long and hard to read in the HTML.

####  1.3.2. <a name='referred-from-the-code'></a>Referred from the code

When the rules are referred using a parameter like this:

```HTML
<div data-class="Validator @importrules={read service=someservice path=$pathtoruledefs}">...</div>
```

the `get_pathtoruledefs` property referred by the binding expression has to return an array of strings, each string following the same syntax like the 2-nd or 3-d form of the attribute value in the Inline scenario. I.e to specify the same rules as in the examples above this property implementation can do the job:

```Javascript
someclass.prototype.get_pathtoruledefs = function() {
    return [
        "required",
        "length #maxChar=20"
    ];
}
```

or without aliases:

```Javascript
someclass.prototype.get_pathtoruledefs = function() {
    return [
        "RequiredFieldValidatorRule",
        "LengthValidatorRule #maxChar=20"
    ];
}
```

The strings are interpreted the same way the attribute values are interpreted when rules are specified inline. Be careful, because this also means that any binding parameters (e.g. `@maxChar={read service=serviceX path=$maxfieldlength}` ) will be resolved as if it was specified in the HTML where the Validator element resides. In practice this implies that one should try to use only `service` sources in such parameter bindings and make sure these services are available in the context where the view/control is shown. Using `source` and pointing to a location in the template can very easily go wrong when the rules are specified in the Javascript code - they will assume certain structure of any template where the rule is used and it is obvious that such a thing is both not easy and also a limiting factor for the design.

`Translation` bindings are not a problem, of course and are even easier to use than the `service` bindings in these cases.

####  1.3.3. <a name='rules-conclusion'></a>Rules conclusion

Most projects will certainly prefer rules specified in code and referred by the validators that use them. Most apps reuse same fields with same rules and this gives you the opportunity to not repeat their configuration. However some exceptions always exist and also small apps do not need such a serious planning. In those cases the rules can be specified inline. 

There is a third option - refer rules from code, but sometimes add an additional one here and there. The additional rule can be added inline.

Specifying rules inline in the HTML is also more convenient when the Validator in question is not a container for basic rules, but checks the validity of control which in turn may have any number of validators inside. This applies mostly for the `CheckValidationRule` rule (alias: `validation`). A very stripped down example:

```HTML

<div data-class="SomeControl" 
    data-bind-$checkvalidity="{probe validator='../validator1'}"
></div>
<div data-class="Validator" data-key="validator1"
    data-validate-validation="text='The control has some validation errors'"
></div>
```

We assume that `SomeControl` implements `IUIControl` and the validation of the containing template (view or another control) will not invoke its validators because of the `IUIControl` interface (it marks a semi-transparent border that allows the control to work internally with no regard for the external conditions). We also assume that `SomeControl` implements `IValidatable` interface (in most cases this is done using the implementor: `IValidatableImpl`) which is exposing the `get_checkvalidation` property. When read this property invokes the internal validation in SomeControl - `IValidatableImpl` just runs its validators which is what we want in 99% of the cases. Therefore in the example above the external validation will trigger the internal validation in SomeControl through `validator1` and this validator can use a template that focuses the user's attention to the instance of `SomeControl` when there is a validation problem in it (imagine a red border around the control for example, inside it any failed validators will still display their correct templates, but a little more focusing is not necessarily a bad UIX approach).

##  2. <a name='built-in-validation-rules'></a>Built-in validation rules

In the list below the rules are listed with their aliases and the class name implementing them in ( brackets )

TODO: List all rules

###  2.1. <a name='base-rule-and-common-parameters'></a>Base rule and common parameters

###  2.2. <a name='async-(asyncvalidatorrule)'></a>async (AsyncValidatorRule)

###  2.3. <a name='validation-(checkvalidationrule)'></a>validation (CheckValidationRule)

###  2.4. <a name='comparedates-(comparedatesvalidatorrule)'></a>comparedates (CompareDatesValidatorRule)

TODO - list them all


##  3. <a name='goals-of-the-validation'></a>Goals of the validation

The validation infrastructure provides:

* Means to configure one or more rules, including custom ones, and assign them to a single validation "unit"/container, which we call a `validator`. Each `validator` can be invoked in various ways to perform validation by applying the configured rules over supplied value(s) and/or binding(s). Almost all standard rules and most custom ones deal with single value or sometimes set of values, but the `validator` also supports _lower level_ access to the data being validated by providing access to the bindings that move the data to the rules that need this. See [Inline syntax](InlineSyntax.md), [Reusing rule sets and templates](AdvancedSyntax.md)

* Options to configure each `validator` for automatic invocation that follows the user and in rare cases non-user invoked changes of the UI state. This is achieved by support for invocation on configurable list of events for each separate `validator`.

* Methods for programmatic invocation of all `validators` in certain scope or part of them by grouping. Any code that needs to ensure data validity before using it can use the methods to determine if it should proceed or not. This includes also a number of methods and properties that enable more detailed analysis of the validation if needed - e.g. it is possible to get all the failed `validators` or all those that succeeded, check which rules have failed and so on. Usually validation is used exactly because one wants to put the details out of the way, but nothing is perfect in life and sometimes dealing with details is unavoidable, this is why the validation API includes a number of methods and properties which are not for everyday use, but are there for those rare cases when they would be needed.

* Means to provide templates that display the state of each `validator` in the UI and means to query each `validator` in order to display its state somewhere else if necessary. The `validators` are containers based on the `Base` class and are visual elements which gives them the ability to use the provided templates to automatically display their (resulting) state when they are invoked. This make it possible to skip dealing with validation messages and just invoke the validation, counting on it to provide the user automatically with the necessary visual feedback.