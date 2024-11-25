<!-- header
{
    "title": "Using formatters",
    "description": "The Formatters API in BindKraftJS actually covers formatters, convertors, filters and any other similar constructs that accept a value and have to return another one that corresponds in some way to the input",
    "keywords": [ "Formatter", "Convertor", "Filter", "Sorter", "Calculator" ]
}
-->



# Using formatters

This article describes usage of formatters in BindKraft based on the new API-s from February 2019. In some places old/legacy techniques are mentioned, but please be aware that all legacy formatter API will be removed soon (April/May 2019). More about the history of the API and future plans can be found in the article "Formatters".

## Overview

The Formatters API in BindKraftJS actually covers `formatters`, `convertors`, `filters` and any other similar constructs that accept a value and have to return another one that corresponds in some way to the input. So, the API is the same, the usage is also the same, but the purpose can differ. To keep this in order this terminology is used:
- **Formatter** - formats a value to user readable text
- **Convertor** - converts the value in some way
- **Filter** - filters elements (usually work on sets - arrays/objects)
- **Sorter** - Sorts elements (usually work on sets - arrays/objects)
- **Calculator** - Calculates a value based on the input

For the reminder of the document we will use the term `formatter` as general term pointing at anything based on the formatter API, but the specific formatter can be actually a convertor or a filter, or something else (mentioned when unclear).

_Formatting_ or _conversion_ in BK is similar to the operations called **piping** in some other programming environments. It is a popular approach that got its fame from unix shells and process management in general. However in BindKraft the abstraction is impacted by the need to use "piping" in **binding** techniques - conveniently and as easy as feasible. Bindings can be loosely described in general sense as _connecting objects in some way_. This means that unlike typical piping in binding two way operation or bidirectional (reversible) operation is rather expected if it is possible.

The formatters can be used entirely in code, but they are designed with primary aim to fit into the HTML templates and the bindings specified in them even if that will make their in-code usage slightly less convenient. 

## Kinds of formatters

There are two kinds of formatters in respect the way they are used:

- **System formatters** - defined by the system and available for usage everywhere without the need to instantiate them.

- **Custom formatters** - configured/defined on local basis for use only in certain template (more about these later).

In respect to the implementation the formatters can be split again in two categories:

- **Implemented as classes** - all system formatters and custom formatters that can be needed in many places (e.g. in many templates used by an app or 2-3 apps etc.).

- **Ad Hoc formatters** - Implemented locally for usage only in the template directly managed by the class. The Ad Hoc formatters can be reused in a very limited fashion - as long as there are more than one different templates that can be managed by instances of the same class.

Obviously the particular implementation is determined by the specific problem  solved with the particular formatter. There are those that implement fairly abstract operations and may be needed in different places and there are those that make sense only under specific conditions of a singular class/view. This is why BK supports these different approaches. Ad Hoc formatters require the same effort needed for a typical method of a class and typically solve similarly scoped problems. Formatters implemented as classes can retain their own state, support extensive configuration and even interact with multiple other objects in order to determine how to perform their job, but they require a bit more effort.

We will cover the usage details further in this document and describe the creation of formatters in depth in the article "Formatters".

### Formatter aggregates

For convenience BindKraftJS offers one more very specific category of formatters - **formatter aggregates**. While using them the programmer rarely needs to know if a specific formatter is aggregate or not - the purpose of the aggregates is to combine a few formatters together into an aggregate that looks like a single formatter, but is internally created as a predefined chain of existing formatters. A good example are some system date-time formatters (`DefaultDateTimeFormat`, `DefaultDateFormat`, `DefaultTimeFormat`) - they combine ConvertDateTime convertor and different formatters for user-readable representation, thus performing all the work from conversion from raw format to Date object and then to readable text for the user.

As you would probably expect aggregates can be system and custom formatters. In bindings multiple formatters can be chained, but for the frequently used cases and in order to implicitly enforce some policy. aggregates enable the black-box approach.

## Naming Conventions

The system formatters are registered with their class names in the system formatters register and used with these same names in bindings. The custom formatters (those implemented as classes) are attached under arbitrary names, but the attachment is an operation coded by the programmer. 

So, the developers have to know the class name of a formatter in order to use it (except the _ad hoc_ formatters which are not classes). For this reason the naming convention is important for both creators of formatters and users of formatters.

The formatter classes have to be named as follows (corresponds to the terminology described in the overview section):

- Format`Specific_name`	- those that produce textual representation from their Read/ToTarget methods (_should be bidirectional when possible_)

- Convert`Specific_name` - those that convert something to something else, including parsers (_should be bidirectional almost always_)

- Filter`Specific_name` - those that filter their values and return stripped down data, possibly also converted (_most often unidirectional: Read/ToTarget_)
			
- Sort`Specific_name` - those that order collection like items (_usually unidirectonal: Read/ToTarget_)
			
- Calc`Specific_name` - those that calculate something from the iunput data (_usually unidirectional: Read/ToTarget_)

The `Specific_name` describes the operation performed by the formatter, it should be limited to no more than a product of 3 words (exceptions are fine, but should be avoided - especially for system formatters).

The above convention is not binding for the aggregate formatters (both system and custom). They can combine different kinds of formatters to form a more convenient construct for frequent usage and this makes the convention a bit inappropriate for them. Still, the aggregates are not so many and taking the time to name them well is always possible. See how explicit usage can be replaced with an aggregate in the example code snippets further in the document.

## Bidirectional/unidirectional formatters

If it is possible all formatters SHOULD be reversible (bidirectional). However, this is not always the case. Obviously one cannot expect that from a `sorter`, `filter` or `calculator` formatters. With these almost always information will be lost during their operation and its reversal will be possible only rarely.

BindKraft defines the directions as **ToTarget** and **FromTarget** and we treat `ToTarget` as `primary direction`. This is the direction that is implemented and the reverse (**FromTarget**) is not usable or is implemented as `pass-through`. The naming comes from the way formatters work in bindings - format/convert the data between the data and the source.

TODO: _More information about the implementation conventions_

## Using formatters from code

There are two instance methods defined in BaseObject providing options to call formatters directly - both system and custom ones. Because of the way the custom formatters are used the custom formatters are supported only on an existing instance of them. Typically this is Ok, because in most cases where custom formatters need to be invoked from code, they are also invoked from the mark-up (the view/template of a component etc.). This way a natural synchronization occurs - both processing through bindings and explicit operations in code use the same instance. This may be a little inconvenient when custom formatters are needed only by the code - an instance of them, initialized and configured correctly will need to be created in this case.

The **ad hoc formatters are not supported** by the `BaseObject.prototype.Format` and `UnFormat` methods.

The methods are:
```Javascript
BaseObject.prototype.Format(name_or_inst, val, bind, params)
```

>Formats `val` through the formatter specified by `name_or_inst` (see how below). The `bind` and `params` are optional. bind can be a reference to a binding or null to omit it. params is a string containing parameters the same way as they are specified in a binding (e.g. `{ ... format=SomeFormatter(the_parameters) ... }` ). Yet the last to arguments rarely make any sense when using a formatter from the code, but they are provided for the rare occasions when this is possible.

```Javascript
BaseObject.prototype.UnFormat(name_or_inst, val, bind, params)
```

The call has the same arguments supported, but calls the inverse action - FromTarget of the formatter.

The `name_or_inst` argument in the above methods can be a string, in which case it is the name of a registered system formatter, or a reference to an exisitng instance of a formatter (custom or system). The existing instance is usually in one of your object's properties if it is prepared for usage also from the mark-up.




## Using system formatters in a template.

The usage of system formatters does not require any preparation - exactly the purpose of their existence. As a result they are used the same way no matter what is the kind of the mark up template - a view, a template of control or a window. Thus the example snippets in this section can appear anywhere (only the rest of the bindings may need a change - here the `source` and the `path` of the data are only used so that the examples can look more real).

Let's start with a very simple case - all examples are with date and time values, assume the data context contains what is stated in the example no matter how unlikely this will be in real life. _If you think this is stupid and these things should be done with date/time pickers, you do not get the point of this document and programming in general - go find another job._

### Basic single bidirectional formatter

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=FormatDateTime}"/>
```

Depending on the locale of the system the output will look accordingly. The system locale is set with the `initculture` command in the boot CL script(e.g. initculture 'en').

If the user edits the text and the input does not violate the format when this.updateSources() is called the `dateval` in the data context will be updated.

The default date-time format in BK is "N" - a shorthand for the long date-time format using mostly numeric representation for the date - reversible one for all cultures. So for "en" ("en-US") culture this will produce something like:

2/18/2019 7:36:08 PM

### Use parameters with a formatter (if it supports any)

Sometimes formatting certain data can be done in various ways - too many to warrant implementation of one formatter for each kind of formatting. For these
cases the formatters API enables formatters to accept parameters from the bindings in which they are used.

The parameters are static, they cannot be changed programmatically (not easily at least), thus the parameters should be seen more like a configuration for the individual formatter.

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=FormatDateTime([bg] n)}"/>
```
In this example we tell the FormatDateTime to use bg (Bulgarian) localization and "n" predefined format (long date-time without seconds). The output will be like:

18.02.2019 07:36
or
18.02.2019 г. 07:36
In Bulgaria both formats are used for the same purpose and the symbol "г." may be removed from the localization configuration sometimes.

The next step we can do is to use the parameters understood by FormatDateTime even deeper - try explicit formats:

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=FormatDateTime([bg] dd.MM.yyyy)}"/>
```

Her the bg locale is probably unneeded, but why? Well, for this formatting it contains the pattern used in Bulgaria, but we do specify it explicitly, so in this particular case the locale doesn't bring nothing useful and we can do the same like so:

```html
<input type="text" 
    data-bind-val="{bind path=dateval format=FormatDateTime(dd.MM.yyyy)}"/>
```

Notice that we omitted the hours and the minutes? We can include them, but the usual format for this is dd.MM.yyyy HH:mm - 24 hour time and a space between the date and the time part. We need quotes to deal with the space (they can be used above too - but thanks to the fact that no spaces were needed they were omitted)

So, this is how the mark-up will change:

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=FormatDateTime([bg] 'dd.MM.yyyy HH:mm')}"/>
```
and we will have output like:

18.02.2019 07:36

The parameters supported by different formatters will depend on their implementation. Even their syntax (what appears in the brackets) will vary between 3-4 typical ones.

Something else one should be aware is the existence of alias classes for some formatters pre-configured with some of these parameters. A good example again are the data-time formatters. When date-time values are needed, typically they are formatted in a few frequently used forms (long, short etc.). In the case of dates this correspond to these shorthand formats that can be used as parameters: n, N, w, W, f, F and so on. Instead of forcing you to use parameters everywhere BK defines a few 'alias' classes for that. Alias classes are classes that inherit the one that does the actual work and either change nothing (done most often when a bad naming is corrected, but compatibility has to be kept) or configure the default state a bit differently.

For FormatDateTime these alias classes are available:

- FormatShortDate - short date, no time, _shorthand: d_
- FormatLongDate - long date, no time, _shorthand: D_
- FormatShortTime - short time, no date, _shorthand: t_
- FormatLongTime - long time (with seconds), no date, _shorthand: T_
- FormatShortDateTime - short date with short time, _shorthand: n_
- FormatLongDateTime - long date and long time, _shorthand: W_

The short variants SHOULD be reversible in all locales, this is not guaranteed for the long ones, but the look better (when used for rendering read-only content). All the aliases work with the default culture set during boot time.

And an example usage:

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=FormatDateTime(n)}"/>
<!-- can be replaced with -->
<input type="text" 
    data-bind-val="{bind path=dateval format=FormatShortDateTime}"/>
```

When such aliases are available for certain formatters, they are recommended, because they help to avoid mix-ups in the UI. Of course this technique is applicable not only to formatters that format values to UI representation, the same applies to convertors, filters etc. The purpose of the aliases will obviously differ.

We can actually illustrate this and the next section will do that (besides describing the conversion that is its main topic.).

### Converting and formatting

Up to this point we have been formatting a Date value to a text representation. However this is not always realistic. Most apps avoid pre-processing of the data they request from the server and in their view it will be quite usual to work with raw data - just parsed from a received JSON for example. The date-time values in the parsed data can be converted to Date objects by the ajax pipeline, but this practice has its negative sides. So, in real world situations we will need to read our date-time value from fields that actually contain a textual representation.

For the sake of the examples: There is no standard dedicated encoding of Date values. They are encoded in strings and the two most widely used formats (now and in the recent past) are a subset of the ISO 8601 standard and a literal carrying the milliseconds count from 01.01.1970 - "\/Date(1550836814173)\/". Today the ISO 8601 is almost the only format used, but a few years ago the other one was still somewhat popular among some .NET programmers (some support for it hurts nobody).

In the examples below we assume the data context was loaded from some JSON and the date-time values are in string fields. So, what we need is to decode them to Date objects and then format them to user-readable texts (and do it in reverse when writing data back to the data context).

```html
<!--
    Data context
    { dateval: "2019-02-18T17:36:08Z" }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=ConvertDateTime,FormatDateTime}"/>
```

Here we have a binding configured with two formatters:

1) convertor to and from Date object
2) the formatter we already used above.

ConvertDateTime actually supports a parameter that specifies the format from which to convert. If nothing is specified it uses the system default which is almost always ISO (denoting ISO 8601 date-time values). Unless the template we write is designed for some place where the data is not encoded the same way it is in the rest of the system, we are better off leaving it to use the system defaults - even if they change, everything will be Ok, because the convertor will adjust its function. But let us illustrate such an exception:

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=ConvertDateTime(MS),FormatDateTime}"/>
```

Here the dates are assumed to be strings like this one "\/Date(1550836814173)\/" in the data context (MS is the key that tells the convertor this). Of course we can pass parameters to both formatters:

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=ConvertDateTime(ISO),FormatDateTime([bg] N)}"/>
```

Here we explicitly specify the encoding in the data context to the convertor ConvertDateTime and we specify specific locale and format shothand to the FormatDateTime.

The formatters are executed left-to-right in the primary direction (ToTarget) - i.e. in the example above when setting the value of the text box the binding will first pass the value through ConvertDateTime, then the result through FormatDateTime. This, of course, happens when the target (or many targets) are updated - e.g. this.updateTargets() for instance.

The order of execution goes in reverse when the other direction is executed. For example, in the above example when this.updateSources() is executed, the binding will read the value of the text box pass it through the FormatDateTime's FromTarget, then the result through ConvertDateTime's FromTarget and after that store it in the source determined by the path element of the binding.

This is fine, but working this way one has to specify both formatters everywhere. Obviously, similar situations will occur with other formatters as well. For that reason BindKraftJS supports `aggregates`. Under the hood two special classes (one for system formatters and one for custom ones) are inherited lightly and instead of implementing/overriding methods and properties the developers who create aggregates, just initialize their classes by setting a list of formatters in their constructor (see how this is done in the article Formatters).

So, we can use especially created and registered aggregates for those scenarios that are expected to happen all the time:

```html
<!--
    Data context
    { dateval: new Date() }
-->

<input type="text" 
    data-bind-val="{bind path=dateval format=DefaultDateTimeFormat}"/>
```

This aggregate contains both **ConvertDateTime** and **FormatDateTime** with their default settings. At the time of writing 3 aggregates existed about dates in the system formatters:

- DefaultDateTimeFormat - default reversible date-time format (ISO and n)
- DefaultDateFormat - default reversible time format (ISO and d)
- DefaultTimeFormat - default reversible time format. (ISO and t)

The settings listed above match the typical system settings.

Passing parameters to aggregates - is it possible? It is possible if they support it, but they rarely do, especially system formatter aggregates. The reason is quite obvious - knowing that the parameters have to serve 2 (or even more in some cases) formatters is confusing and in a way defeats the purpose of the aggregates. Whenever parameters are supported anyway, they are limited - subset of the parameters of one of the included formatters or simplified notation that is internally translated to only some possible parameters of some the contained formatters. This is rarely needed, so consult the documentation or the team for more detailed info.

### Sidenote about dates and times

We used dates for the examples and to avoid forcing you to look for more details about this in other articles we will summarize some details about working with dates and times. This is only indirectly related to formatters.

AS it was mentioned a subset of ISO 8601 is actually used with JSON. To further complicate the situation Javascript has not Time type, but only Date (at least at the time of writing). So, the obvious elephant in the room is - while we want to transfer only Time or only Date sometimes the circumstances are such that have to transfer full date-time values only (unless we want to solve more annoying problems).

So, the convention all BK supplied date-time related stuff is following is that when only time or only date is needed the other part is ignored even if it exists. No assumptions should be made what the date part is of a date-time value that is used as a medium for time only for example. E.g. such a value may start as Date object in the browser and after transferring through some user editing, then JSON posted to the server it can become a DateTime value in a .NET server code. Only the time part will be taken care of, the date part can be set to certain "0" by the code participating in the process, but it can be also ignored in different manner - set to the current date, first day of the year and whatnot. Ignoring the part means no control is exercised over its value, no API has options to do this - it is just ignored and may happen to be set to something, but it is generally unclear what and when.

The lesson is - no assumptions are save, any code dealing with the date part only or the time part only should not base its operation on assumptions for the other part.

## Custom formatters

While both system and custom formatters work in almost the same way internally - how it happens with the custom is what actually concerns everybody. The system formatters are built by a few people, but building custom formatters most often than not is an everyday task.

A custom formatter is not registered with the system, it is exposed for use only locally - to a specific view or template for example. How custom is a custom formatter is also a valid question - it can be something used across the app and even in a few others, but it can be also an ad hoc code written while creating a template as part of the code that backs it (in some of its data-class) - doing something very specific - meaningful only there.

Before going further it would be helpful to adjust the way you see this:

A formatter doing something self-contained is usually reusable. This does not mean that this formatter will indeed be needed in many places - it depends on what it does. No matter how much demand is there being self contained and not dependent on the state of integral parts of the app (e.g. a specific view or a component) it can (and usually is) be implemented as class inheriting CustomFormatterBase. This means it is implemented in almost the same way a system formatter is, but it is not registered with the system.

Teh system formatters are very general purpose ones. Among them there are a few that are less demanded, but they are still general - not specific to the unique needs of an app. So, it is not impossible that you may consider making a given custom formatter a system one, but your request will be most probably rejected. This illustrates what the custom formatter may look like - very much like system one.

To keep such concerns easy to imagine we will base the next parts of the section on the following example need (all examples will revolve around that):

    We will assume that we have a Person structure that is often part of the data with which we work. For the example purposes let us assume the structure looks like this object:

```Javascript
{
    firstname: "Jason",
    middlename: "Fleece",
    lastname: "Thief",
    sex: "male",
    born: "2000-02-05T01:45:00.000Z",
    weight: 80
}
```
### Ad Hoc formatter

Let's start with the simplest thing to do. We will do it in a view this time (the view is a template loaded as content of a SimpleViewWindow).

Our class may look like this:

```Javascript
function MyView() {
    GenericViewBaseEx.apply(this,arguments);
}
MyView.Inherit(GenericViewBaseEx,"MyView");
// And the formatter:
MyView.prototype.personFormatter = {
    ToTarget: function(val, binding, params) {
        return val.firstname + " " + val.middlename + " " + val.lastname;
    },
    FromTarget: function() { throw "cannot convert"; }
}
```

Our formatter composes a string consisting of the 3 names of the person. For the sake of the example no checks are made.

In fact we can skip FromTarget instead of throwing exception there in case somebody tries to read data back - our formatter is unidirectional.

How the usage will look:

```html
<div data-class="MyView">
    Name: <span data-bind-text="{read path=person format=__view:personFormat}"></span>
</div>
```

### Using the state in Ad Hoc formatter

As we have seen these formatters are implemented like methods, but by pairs under one field of the class. They are actually called as methods - their this will point to the instance of the class just like a normal method.

Let's change the class:

```Javascript
function MyView() {
    GenericViewBaseEx.apply(this,arguments);
}
MyView.Inherit(GenericViewBaseEx,"MyView");
MyView.ImplementProperty("shortmode", new InitializeBooleanParameter("", false));
// And the formatter:
MyView.prototype.personFormatter = {
    ToTarget: function(val, binding, params) {
        if (this.get_shortmode()) {
            return val.firstname + " " + val.lastname;
        } else {
            return val.firstname + " " + val.middlename + " " + val.lastname;
        }
    },
    FromTarget: function() { throw "cannot convert"; }
}
MyView.prototype.onDoSomething = function() {
    this.set_shortmode(this.get_shortmode());
    this.updateTargets();
}
```

We added a property that controls how the view displays its data - short/brief or full. It is unlikely that this property will be changed from random places, so we keep it passive and do all the job needed to invoke re-rendering in an event handler. Assume that there are other pieces of data that render in brief and full mode, other ad hoc formatters may do the same, some parts of the view may have their visibility bound to the mode as well - anyway, the property is a general instruction for the whole view and we honor it in our formatter.

This is easy thanks to the fact that our this points to the instance and our formatter methods act the same way normal methods do.

Example view may look like this:

```html
<div data-class="MyView">
    Name: <span data-bind-text="{read path=person format=__view:personFormat}"></span>
    <input type="button" value="toggle mode" data-on-click="{bind source=__view path=onDoSomething}" />
</div>
```

This looks simple, but as the complexity of the view grows you may need to comply with the concerns of other parts of the view. Lets throw a few hints in that direction.

### A little digression. What happens when things get more complicated?

There is nothing editable in our example view, so we do not have to care about updating the sources, but if it was a form for editing something where the name of the person is only shown we have to take care, of course. As you probably know there are different approaches to this, to name some:

- use flags to update only bindings that have something to do with the mode.
- update sources first than update targets. This will get harder when validation is used as well - you may not want to save to the sources invalid values, so mode changes may be cancelled if validation fails. A double buffering technique is also used sometimes, but it is costly - there have to be more reasons than this alone to justify it.
- update specific bindings by name
- update only areas that you know are read-only (id the mode concerns only them)
- fire an event and configure the bindings that have to react to re-read the data when it fires.

BindKraftJS being an exception among data binding solutions leaves the control over the data flow through binding to the programmer. As you already know, this requires decisions, but pays back by allowing optimizations completely impossible otherwise. For those not yet deeply familiar with BindKraft - one has to know the variety of ways to control the data flow en masse and in detail in order to design the behavior of the UI piece he/she works on. The total effort is usually the same as in almost any framework that implements some form of data binding, but the pattern the data binding process follows is defined by the programmer, not the other way around. So, the differences one notices while doing similar stuff with BindKraft and a number of other frameworks is that in BindKraft you have to mainly animate (trigger) the data binding process and react to events and data actions less - in frameworks that automate the data binding process the work shifts in the other direction - heavy reaction code, little data flow triggering code. Still the total amount of work is usually similar, the benefit that BindKraft has on that level alone is the natural chance to avoid the unneeded or unwanted data transfers instead of reacting to them to prevent their consequences.

This digression hopefully gave you an idea what is the price of wanting to trigger additional data transfers because of a formatter, but this is a topic that deserves a separate discussion.

### Using custom formatters implemented as classes

As it probably became clear - the ad hoc formatters play a role comparable to other OOP elements - like properties for instance. They use the same API like other formatters, but it will not be a stretch to say that even calling them formatters (or converters, or filters and so on) is not always precise enough and some programmers will probably like some alternative term better.

In contrast formatters implemented as classes are clearly better representatives of the formatters breed. These are usually especially designed to perform certain kind of formatting, conversion etc. This kind of custom formatters can interact with the state of the instances through which it is exposed for usage, but when this is done, it is in some more general manner.

To start let us imagine we have this (pointless) formatter implemented:

```Javascript
function UpperCaseCustomFormatter() {
    CustomFormatterBase.apply(this, arguments);
}
UpperCaseCustomFormatter.Inherit(CustomFormatterBase,"UpperCaseCustomFormatter");
UpperCaseCustomFormatter.prototype.Read = function(host, val, bind, args) {
    if (typeof val != string || val.length == 0) return val;
    if (args == "firstletter") {
        return val.charAt(0).toUpperCase() + val.slice(1);
    } else {
        return val.toUpperCase();
    }
}
UpperCaseCustomFormatter.prototype.Write = function(host, val, bind, args) {
    return val;
}
```

Yes, there is a CSS for that, but for the sake of the example this is fine. 

To use the formatter one has to create it and attach it to a field or a property of an instance participating in the template.