# Binding syntax

This syntax is for both `data-bind-{targetexpr}` syntax and `data-on-{event}` syntax, however not all settings apply (make sense) for both. This is noted in the details about each of them.

It is important to always consider the fact that each binding is an object of one of two classes:

  `Binding` class - all the `data-bing-{targetexpr}` bindings
  `Handler` class - all the `data-on-{event}` bindings.

The terminology is as follows:

```HTML
  <!-- DATA BINDINGS -->
  <someelement ... data-bind-{target_expression}="{expression or source_expression}" ...>

  <!-- EVENT BINDINGS -->
  <someelement ... data-on-{eventname}="{expression or source_expression}" ...>
```

> For general concepts and usage discussion see [Bindings](../Bindings.md)

> [Target expressions](Bindings.md#target-operation) are documented here

> Expressions (also called source expressions) are described below and in the linked pages


## Expression syntax scheme

```bnf
"{"bind|read|probe["("<positive_int>")"]
    (
      [source=<element_reference>|"static"|"globalresource"|"settings"|"systemsettings"|"appletstorage"|"parentcontext"|"ajaxsettings"] |
      [service=<provided_service>] |
      [shellcommand=<shell_command_name>]
    )?
    ( 
      [path=<sourcepath>] |
      [trigger=<eventname>]
    )?
    [throw=<query_alias>]?
    [format|inverseformat=<formatters>]? 
    [customformat|inversecustomformat=<formatters>]? 
    [options=<optionlist>]?
    [flags=<flags>]? 
    [create|createleaf="object"|"array"]?
    [checkstate=<target_eventlist>]?
    [readdata|(readdata"("<positive_int>")")=<source_eventlist>]?
    [writedata|(writedata"("<positive_int>")")=<target_eventlist>]?
    [ref|reference"["<refname>"]"=<element_optional_binding_reference>]*
    [debug=<element_method_reference>]? 
    [text|number='<binding_string_value>']? 
    [object=<classname>]? 
    [validator=’<element_references>’|<element_references>]? 
    [name=<binding_name>]? 
    [trace=<trace_option>]?
    [allowread=<element_method_reference>]?
    [allowwrite=<element_method_reference>]?
    [onload|onenter|onleave|onclose=<rule_name>]* 
    [parameter|argument=’<binding_string_value>’]? 
} 

<element_reference> ::= <parent_key>["/"<child_key>]

<element_references> ::= <element_reference> ( "," <element_reference> )*

<parent_key> ::= <data_key>|<special-key> ; data-key of a parent element

<child_key> ::= <data_key> ; of an element inside the element pointed by the parent key (nested at any level)

<special-key> ::= "parent"|"self"|".."|"."|"__view"|"__control"

<data_key> ::= (alphanumeric|_)+ ; A data key of an element 

; multiple formatters (a list) are supported from version 1.41
<formatters> ::= ( <formatter> | <custom_formatter> ) [ "(" <formatter_params> ")" ] ( "," ( <formatter> | <custom_formatter> ) [ "(" <formatter_params> ")" ] )*

<formatter> ::= (alphanumeric|_)+ ; A name of a static formatter

<custom_formatter> ::= <element_reference> ":" <propertyname>

; added in version 1.41
<formatter_params> ::= (^")" | "))")* ; Spaces are allowed, but closing bracket must be escaped with doubling

<propertyname> ::= (alphanumeric|_)+ ; The name of the property of the referenced object that contains an object {} with two methods ToTarget and FromTarget

<optionlist> ::= [{"persistable","asyncread","async","asyncwrite","disabled","freezesite", "operation", "nonpersistable"}] ; comma separated list of option names

<flags> ::= (alphanumeric|_)+[("," (alphanumeric|_)+)*]

<target_eventlist> ::= <eventlist>

<source_eventlist> ::= <eventlist>

<eventlist> ::= <domevent>|<frameworkevent>|(<element_reference>":"<domevent>)|<element_reference>":"<frameworkevent>

<domevent> ::= (alphanumeric | _)+

<frameworkevent> ::= $ (alphanumeric | _)+

<refname> ::= (alphanumeric|_)+

<element_optional_binding_reference> ::= (<element_reference> [ ":" <binding_name> | "@" <property_name> | "~" <property_name> ])+

<binding_name> ::= (alphanumeric|_)+

<element_method_reference> ::= <element_reference> [ ":" <method_name> ]  ; points to a method of an data-class attached to the element specified by the <element_reference>

<method_name> ::= (alphanumeric|_)+ ; While javascript allows more symbols in the identifiers we are limited to these only

<positive_int> ::= numeric+

<provided_service> ::= <protocolname>|<classname>

<protocolname> ::= (alphanumeric|_)+

<classname> := (alphanumeric|_)+

<shell_command_name> := (alphanumeric | _)+

<query_alias> := (alphanumeric | _)+
```

## [`bind`, `read` or `probe` ](BindingSyntax/bindingtype.md)

Specififies the behavior of the binding when updateTargets/updateSources are called for mass binding activation. Does not matter for the `data-on-` bindings - in them `bind` should always be used by convention. [Read more ...](BindingSyntax/bindingtype.md)

## `source` and `service`

_mutually exclusive with `service`_

Optional attribute specifying the source of the data binding. It works together with the `path` attribute - the source points at the start point (object), `path` defines the path from there.

If neither `source` or `service` attributes are present the binding source is the data context.

This is an optional element which is needed if the source of the data is not the current data context. When you access data elements in the current data context you should omit this part. When you need to read the data from another element from the template or most likely the data-class object bound to it you need to specify the element. This is done using the typical element reference based on data-key attributes (see below). Some keywords are reserved and have speciall meaning in the source directive. These should not be used as data keys if possible. The special sources are:

* `self` - The element or if there is a data-class specified on it - the instance of that class attached to the element.
* `static` - Static value useful for some parameterizations or for tests. A `text`, `number` or `object` directives can be used to specify the value. The text and number need value in quotes e.g. `number='8'` and object specifies a class name or the keyword `object`. e.g. `object=object` will assign empty simple javascript object which is often convenient for local data contexts filled with bindings. Example: `{read source=static text='some text'}`.
* `globalresource` - a reference to the resource store (programmatically available at CBinding.resources as instance of the string resources manager - CStringResources. Warning: This may have slightly different behavior on some BindKraft systems.
* `appletstorage` - provides access to the data in the applet storage (if available under the specific circumstances). The applet storage is an exposed as a service IAppletStorage interface. Usually it is implemented by the app.
* `systemsettings` - provides access to the system settings. Programmatically available under the `CSystem.Default().settings` as plain JS object tree.
* `settings` - Reserved for future use.
* `parentcontext` - Will work like a binding without source, but will always look in the data context outside this element. This is often needed in components that change their data context, but need someof their properties to be bound to data in the outer data context.

## `service` - bind to the closest available service of the type specified

The `service` keyword specifies an interface or class name as a source for the binding. Examples:

```
{read service=IMyInterface path=$numsections}
{bind service=MyApplication path=$caption}
```

The specified type in `service=sometype` expression is located through `Base.prototype.findService(typename)` method and then the path is calculated on it (i.e. `path=$prop` accesses get/set property on the service no matter where it is located). Service location in general depends on the developer, but it has a default behavior which is convenient enough to be left intact in most cases: The hierarchy is searched back through the DOM to the first BindKraft window, then the window hierarchy is followed back until a window that is a root level window of an app is found, then the app hierarchy is followed and finally this ends with the system (the `Shell` - in some systems the service location may be stopped before the `Shell`). Each element along the way is asked if it can supply the requested service.

Of course, each element can apply custom logic for service location and figuratively speaking "change the search direction" in some custom way, but these deviations are usually bound to a specific element and are transparent to the requester. See more in `Service location` and `Structural queries` (for more information check framework messaging/communication articles).

Interesting use cases are those which use the App as main service provider (no matter if it implements the services itself or creates/serves implementations in separate classes). This usage is very natural in BondKraft because the Apps are by design hubs that connect multiple windows and views hosted in them to code that sits in the middle of all this to perform the application's logic leaving the details of the UI to the views and the windows. In a typical application expecting the app to provide most application specific services is just "direct connection to the hub" that by being in the middle can easily react to UI events and apply their effect to the rest of the UI.

`service` can be used in both `data-bind` and `data-on` bindings.

## path

Path is a dotted notation that describes the path to the source value from the source object, which is the object determined through the source, service parameter or is the data context if both source and service are omitted.

 The path may consist of any number of elements separated with “.”. Pseudo properties are supported by specifying a link in the path chain with "$" prefix. The path specifies the properties to be traversed over the specified source object or the data context in order to reach the desired value. Thus path=a.b.c means that the value will be obtained from the "a" property property of the source object, then the b property of the returned by the a property object then the c property of the last one. If one of these properties is a pseudo property you specify it like this: path=a.$b.c which means that the property b will be in fact a combination of get_b() and set_b(newval) methods available on the object a. This pseudo property syntax works for both data context and an explicit `source` specified by using the source parameter. Pseudo properties are typically implemented only by objects attached to elements (using data-class attribute) and rarely appear in data contexts or over raw DOM elements. This means that in most cases usage of pseudo properties without source parameter is an indication for a mistake. Example: Assume you have data context like this (in javascript object initializer notation): { name: “Emmanuel”, age: 35, spouse: { name: “Brigitte”, Age: 105}} Then we can display the age of the spouse in a text box like this: < input data-bind-val="{bind path=spouse.Age}" type="text" />. 
        
    T he path parameter supports complex syntax that enables the binding to  Full source path syntax below.determine its source dynamically, for the full description of the currently supported syntax see the Full source path syntax below.

## format and inverseformat (hisstorically also customformat and inversecustomformat)

The API that supports formatters also enables the programmer to create and use the same constructs as `converters` or `transformers`. In fact all of these purposes require the same approach and these differentiate from each other only by purpose - formatters usually transform data to/from human readable/writable format, while the others transform the structure of the data, convert from one type to another, gather data from different places and return it as if it is really on the other end of the binding.

The `format` parameter of a binding specifies one or more formatters to apply over the passing value/data. They are specified with their name or parent/child key location followed by optional parentheses which may contain configuration parameter(s), the different formatters are listed coma delimited and no spaces are allowed (except in the configuration parentheses). They are executed in the order in which they are specified in To Target mode and in the reverse in From Target mode. The configuration parameter is just a string and the specific formatter defines its further syntax - it can be a format string, one or more numbers specifying precision for example, shortcut names of common formatting patterns, instructions telling a converter what exactly to do and so on.

`TODO - to be continued`

## [options](BindingSyntax/options.md)

The options influence the way the binding works in some way. They often turn on or off certain features or change how they work. Most often the options control features that require some processing which will be ineffective if it is always performed and they give the developer the chance to enable it only on these bindings where it matters.

The available options

  `persistable` - enables the binding to change the data entity state when performing update sources. For example if the binding path is `a.b.c` the state of the object at `a.b` will be updated.

  `async`, `asyncread`, `asyncwrite` - asynchronous processing of the updateTargets/Sources. The `async` will perform both asynchronously, while asyncread is only for updateTargets and asyncwrite only for updateSources. Internally this is done with this.async (see `BaseObject`) which creates a task and registers it with the global task scheduler for execution (_For beginners_: this is advanced technique that "replaces" the setTimeout.).

  `disabled` - Disables the binding on which it is specified. Can be needed for a quick fix temporarily or to control programmatically which bindings should work etc. There are better ways to control which bindings work or not workat any given instance - see flags and name binding parameters.

  `freezesite` - If the target of the binding supports IFreezable it will freeze it while updating it (writing a property usually). While freezing can have many purposes, its main role is to temporarily prevent the events of the object from firing. This is extremely important if the act of updating a property starts a long chain of changes that cause many events to fire, possibly on multiple objects even. This may cause in some cases (especially during initialization) cyclic redundancies and it is desirable to diable this for a while - until finished with some kind of configuration, parameterization.

  `operation` - Normally bindings do not recognize `Operation` objects, but if this option is set, they will detect them, wait such an `Operation` value to complete and they will set to their targets the operation result (passing it through all the specified formatters the same way this is done with normal values). This allows in many cases to avoid the need to write custom synchronization code and instruct the binding to wait on its own for the operation to complete.

  `nonpersistable` - obsolete, kept for backwards compatibility, will be removed in the next major version.
  

## throw

Applicable only to `data-on-` bindings, will do nothing in _data-bind-_ syntax.

This causes the binding to throw a `structural query` in response to the event. The query thrown has to have a registered alias.

Syntax:
```html
  Example:
  <div  ... data-on-click="{bind source=__view path=one.two throw=updatecommands parameter='1,2,3'}" ...> ...</div>
```

Here throw refers to a structural query alias "updatecommands" which has to be previously registered. This one comes from BindKraft itself and  `UpdateCommandBars` class is registered behind this alias. As a result clicking the element will create an instance of the class and throw it as a structural query starting at that HTML element (the element on which the binding is specified). If there is a `data-class` attribute on this element and it the class specified listens for this type of query it will be the first to have the chance to fulfill it - see documentation about `Structural Queries` for further details.

Except a very few queries BK doesn't register much (see the list below). The developers can use this feature to eliminate the need to call as handlers methods on their class only to throw a query. 

What can this be used for? In the example above we used `UpdateCommandBars` query. Its purpose is to fall through the view and reach its window or a window a bit further that displays UI control elements like menus, toolbars, ribbons and alike. These UI elements usually have states synced with the state of a view or views and have to be updated whenever these states change. The developer can try to optimize that and update their state only when the relevant states are changed. Depending on the particular UI structure this can be both easy or rather complicated (to determine when the update has to be invoked). So, throwing a query directly with a binding can save some work in situations like this by invoking the update in more design-bound manner.

Even te above example rises the question is this a good or a bad technique? Obviously there is no single way to answer this - one can produce a cleaner code by relieving the code behind a view from many or all query throws it needs to perform, but this can be a bad approach if these queries have important role in what this code does and this finally leads to the need to sync two separate actions. This usually happens when the relation between what they do is not recognized in time - before writing the code. Thus the potentials for bad practices is not more, nor less than any typical coding and it is up to the developer to determine if usage of such bindings will be a blessing or a curse for the particular task. In any case the option is there and in our own usage we manged to reap its benefits in more than a few cases. It can be especially recommended for prototyping work - inconsistencies are expected in prototypes, but also functionality is needed in order to show how the actual product will work to clients or the management. This is one of those techniques that can certainly help in such cases.

BindKraft registered aliases:
  - datastatechanged
  - hostcommand
  - updatecommands

  TODO: Write details

### Register structural query aliases

TODO: ... to be written ...